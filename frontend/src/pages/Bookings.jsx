import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { apiGetBookings, apiCancelBooking } from '../services/api';
import '../styles/homeCss.css';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [msg, setMsg] = useState({ text: '', color: '' });

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadBookings = () => {
    setLoading(true);
    apiGetBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await apiCancelBooking(id);
      setMsg({ text: 'Booking cancelled successfully', color: 'success' });
      loadBookings();
      setTimeout(() => setMsg({ text: '', color: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.message || 'Failed to cancel', color: 'danger' });
    }
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  // Filter bookings
  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const pastBookings = bookings.filter(b => b.status !== 'CONFIRMED');

  const renderBookings = (list) => {
    if (list.length === 0) {
      return (
        <Card className="border-0 shadow-sm rounded-bottom-4 p-5 text-center bg-white">
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.4 }}>📅</div>
          <h4 className="fw-bold" style={{ color: '#1A1A1A' }}>No bookings found</h4>
          <p className="text-muted">When you book a trip or show, it will appear here.</p>
        </Card>
      );
    }
    return (
      <div className="d-flex flex-column gap-3 p-4 bg-white shadow-sm rounded-bottom-4">
        {list.map((b) => (
          <Card key={b.id} className="border-0 rounded-4 p-4 booking-card" style={{ transition: 'transform 0.2s, box-shadow 0.2s', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', 
                    background: b.bookingType === 'FLIGHT' ? '#E8F1FF' : b.bookingType === 'TRAIN' ? '#F3E8FF' : b.bookingType === 'HOTEL' ? '#FFF0E5' : '#E6F9EE',
                    color: b.bookingType === 'FLIGHT' ? '#1A73E8' : b.bookingType === 'TRAIN' ? '#7B2FBE' : b.bookingType === 'HOTEL' ? '#FF6B00' : '#059669',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
                  }}>
                    <i className={`fa-solid ${b.bookingType === 'FLIGHT' ? 'fa-plane' : b.bookingType === 'TRAIN' ? 'fa-train' : b.bookingType === 'HOTEL' ? 'fa-hotel' : b.bookingType === 'BUS' ? 'fa-bus' : 'fa-ticket'}`}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-capitalize" style={{ color: '#1A1A1A' }}>
                      {b.bookingType} Booking
                    </h5>
                    <div className="text-muted small fw-bold text-uppercase mt-1" style={{ letterSpacing: '0.05em' }}>Ref: {b.bookingReference}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#444', fontWeight: 500 }} className="ms-1 mt-2">
                  {b.details}
                </div>
              </Col>
              <Col md={4} className="text-md-end mt-4 mt-md-0">
                <div className="d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end h-100 ps-md-4 border-start border-0 border-md-start" style={{ borderColor: '#E2E8F0 !important' }}>
                  <div className="text-start text-md-end">
                    <div className="text-muted small fw-bold text-uppercase mb-1">Total Paid</div>
                    <div className="fw-bold mb-2" style={{ fontSize: '1.4rem', color: '#1A1A1A', lineHeight: 1 }}>₹{b.totalPrice?.toLocaleString()}</div>
                    <Badge bg={b.status === 'CONFIRMED' ? 'success' : 'danger'} className="px-3 py-2 rounded-pill fw-bold">
                      {b.status}
                    </Badge>
                  </div>
                  
                  {b.status === 'CONFIRMED' && (
                    <div className="mt-md-3">
                      <Button variant="outline-danger" size="sm" className="rounded-pill fw-bold px-3 shadow-sm" onClick={() => handleCancel(b.id)}>
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="booking-hero-bg text-center" style={{ '--hero-image': `url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80)`, height: '300px' }}>
        <div className="hero-dark-overlay"></div>
        <Container className="position-relative" style={{ zIndex: 2, paddingTop: '60px' }}>
          <h1 className="fw-bold mb-2 text-white" style={{ fontSize: '2.5rem' }}>My Bookings</h1>
          <p className="text-white-50">View and manage all your past and upcoming trips.</p>
        </Container>
      </div>

      <Container className="pb-5" style={{ marginTop: '-60px', position: 'relative', zIndex: 3, maxWidth: '900px' }}>
        {msg.text && (
          <div className={`alert alert-${msg.color} rounded-4 shadow-sm mb-4 fw-bold text-center`}>
            {msg.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
             <span className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></span>
          </div>
        ) : (
          <div className="rounded-4 shadow" style={{ background: '#fff' }}>
            <Tabs
              id="bookings-tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="border-bottom px-3 pt-3"
            >
              <Tab eventKey="upcoming" title={<span className="fw-bold px-3 py-2 d-inline-block">Upcoming</span>}>
                {renderBookings(upcomingBookings)}
              </Tab>
              <Tab eventKey="past" title={<span className="fw-bold px-3 py-2 d-inline-block">Past & Cancelled</span>}>
                {renderBookings(pastBookings)}
              </Tab>
            </Tabs>
          </div>
        )}
      </Container>
    </>
  );
};

export default Bookings;
