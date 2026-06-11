import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetBuses, apiSearchBuses, apiBookBus } from '../services/api';
import busTravelImg from '../assets/images/bus_travel.png';
import '../styles/homeCss.css';

import bus1Img from '../assets/images/bus1.jpg';
import bus2Img from '../assets/images/bus2.jpg';
import bus3Img from '../assets/images/bus3.jpg';

const MOCK_BUSES = [
  { id: 1, operatorName: 'Volvo Express', busType: 'AC Sleeper', origin: 'Delhi', destination: 'Jaipur', price: 850, availableSeats: 25, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80' },
  { id: 2, operatorName: 'RedBus Premium', busType: 'AC Semi-Sleeper', origin: 'Mumbai', destination: 'Pune', price: 450, availableSeats: 40, imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80' },
  { id: 3, operatorName: 'Orange Travels', busType: 'Non-AC Seater', origin: 'Hyderabad', destination: 'Bangalore', price: 600, availableSeats: 15, imageUrl: bus1Img },
  { id: 4, operatorName: 'UPSRTC', busType: 'AC Seater', origin: 'Lucknow', destination: 'Delhi', price: 700, availableSeats: 55, imageUrl: bus2Img },
  { id: 5, operatorName: 'VRL Travels', busType: 'AC Sleeper', origin: 'Lucknow', destination: 'Indore', price: 1100, availableSeats: 12, imageUrl: bus3Img },
  { id: 6, operatorName: 'SRS Travels', busType: 'Multi-Axle Volvo', origin: 'Chennai', destination: 'Bangalore', price: 550, availableSeats: 0, imageUrl: bus3Img },
];

const Buses = () => {
  const { user } = useAuth();
  const [buses, setBuses] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [search, setSearch] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', color: '' });

  // Booking Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [numSeats, setNumSeats] = useState(1);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const data = await apiGetBuses();
      setBuses(data);
      setAllBuses(data);
    } catch (err) {
      console.warn('Backend unavailable, using demo data');
      setBuses(MOCK_BUSES);
      setAllBuses(MOCK_BUSES);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', color: '' });
    try {
      const data = await apiSearchBuses(search.origin, search.destination);
      setBuses(data);
    } catch (err) {
      const filtered = allBuses.filter(b => {
        const matchOrigin = !search.origin || b.origin.toLowerCase().includes(search.origin.toLowerCase());
        const matchDest = !search.destination || b.destination.toLowerCase().includes(search.destination.toLowerCase());
        return matchOrigin && matchDest;
      });
      setBuses(filtered);
      if (filtered.length === 0) {
        setMsg({ text: 'No buses found for this route', color: 'orange' });
      } else {
        setMsg({ text: `Found ${filtered.length} bus(es)`, color: 'green' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (bus) => {
    if (!user) {
      setMsg({ text: 'Please login to book a bus', color: 'orange' });
      return;
    }
    setSelectedBus(bus);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const res = await apiBookBus(selectedBus.id, numSeats);
      alert(`✅ Bus booked successfully! Booking Reference: ${res.bookingReference}`);
      setShowModal(false);
      loadBuses();
    } catch (err) {
      setMsg({ text: err.message, color: 'red' });
    }
  };

  return (
    <>
      <div className="booking-hero-bg text-center" style={{ '--hero-image': `url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80)` }}>
        <div className="hero-dark-overlay"></div>
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>🚌 Book Bus Tickets</h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Affordable, comfortable bus journeys with top operators across India.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
            {['GPS Tracked','Live Seat Map','Operator Ratings','Onboard WiFi*'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Bus types */}
        <div className="mb-4 mt-3">
          <h5 className="fw-bold mb-3" style={{ color: '#1A1A1A' }}>🚌 Bus Types We Offer</h5>
          <div className="d-flex gap-2 flex-wrap">
            {[
              { type: 'AC Sleeper',      icon: 'fa-moon',   color: '#1A73E8', bg: '#E8F1FF' },
              { type: 'AC Semi-Sleeper', icon: 'fa-couch',  color: '#7B2FBE', bg: '#F3E8FF' },
              { type: 'Seater AC',       icon: 'fa-chair',  color: '#059669', bg: '#E6F9EE' },
              { type: 'Non-AC Seater',   icon: 'fa-bus',    color: '#FF6B00', bg: '#FFF0E5' },
              { type: 'Multi-Axle Volvo',icon: 'fa-star',   color: '#f59e0b', bg: '#FFF8E5' },
            ].map(({ type, icon, color, bg }) => (
              <div key={type} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: '10px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={`fa-solid ${icon}`} style={{ color, fontSize: '14px' }}></i>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
        <Card className="booking-search-card glass-search-widget border-0">
        <Form onSubmit={handleSearch}>
          <Row className="g-2 align-items-center">
            <Col md={5}>
              <Form.Control 
                placeholder="From City" 
                value={search.origin} 
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control 
                placeholder="To City" 
                value={search.destination} 
                onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" type="submit" className="w-100 rounded-3 fw-bold" disabled={loading}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {msg.text && (
        <div className={`alert alert-${msg.color === 'green' ? 'success' : (msg.color === 'orange' ? 'warning' : 'danger')} mb-4 rounded-3 shadow-sm`}>
          {msg.text}
        </div>
      )}

      <Row className="g-4">
        {buses.map(b => (
          <Col md={6} key={b.id}>
            <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <Row className="g-0 h-100">
                <Col xs={4}>
                  <div 
                    style={{ 
                      backgroundImage: `url(${b.imageUrl})`,
                      height: '100%',
                      minHeight: '180px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </Col>
                <Col xs={8}>
                  <Card.Body className="p-3 d-flex flex-column justify-content-between h-100">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h5 className="fw-bold mb-0" style={{ fontSize: '1rem' }}>{b.operatorName}</h5>
                        <span className="text-primary fw-bold" style={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>₹{b.price}</span>
                      </div>
                      <p className="text-muted small mb-2" style={{ fontSize: '0.8rem' }}>{b.busType}</p>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{b.origin}</span>
                        <span className="text-muted">→</span>
                        <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{b.destination}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2 pt-2" style={{ borderTop: '1px solid var(--clr-border)' }}>
                      <span className="text-primary fw-bold" style={{ fontSize: '0.8rem' }}>{b.availableSeats} seats left</span>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="px-3 rounded-pill fw-bold"
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => handleBook(b)}
                        disabled={b.availableSeats <= 0}
                      >
                        {b.availableSeats > 0 ? 'Book Now' : 'Full'}
                      </Button>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
        {buses.length === 0 && (
          <Col className="text-center py-5 text-muted">No buses found</Col>
        )}
      </Row>

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Book Seats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBus && (
            <div className="mb-4 p-3 bg-light rounded-3">
              <h6 className="fw-bold mb-1">{selectedBus.operatorName}</h6>
              <p className="text-muted small mb-0">{selectedBus.origin} → {selectedBus.destination}</p>
            </div>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Number of Seats</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                max={selectedBus?.availableSeats}
                value={numSeats}
                onChange={(e) => setNumSeats(parseInt(e.target.value))}
                className="rounded-3"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowModal(false)} className="rounded-3 px-4">Cancel</Button>
          <Button variant="primary" onClick={confirmBooking} className="rounded-3 px-4 shadow-sm">Confirm Booking</Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </>
  );
};

export default Buses;
