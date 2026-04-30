import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetTrains, apiSearchTrains, apiBookTrain } from '../services/api';
import flightSunsetImg from '../assets/images/flight_sunset.png';
import '../styles/homeCss.css';

const MOCK_TRAINS = [
  { id: 1, trainName: 'Rajdhani Express', trainNumber: '12309', origin: 'Delhi', destination: 'Mumbai', price: 1800, availableSeats: 120, departureTime: '16:30', arrivalTime: '08:15', duration: '15h 45m' },
  { id: 2, trainName: 'Shatabdi Express', trainNumber: '12001', origin: 'Delhi', destination: 'Lucknow', price: 950, availableSeats: 85, departureTime: '06:00', arrivalTime: '12:30', duration: '6h 30m' },
  { id: 3, trainName: 'Duronto Express', trainNumber: '12213', origin: 'Mumbai', destination: 'Delhi', price: 2100, availableSeats: 45, departureTime: '23:15', arrivalTime: '16:50', duration: '17h 35m' },
  { id: 4, trainName: 'Gatimaan Express', trainNumber: '12049', origin: 'Delhi', destination: 'Agra', price: 750, availableSeats: 200, departureTime: '08:10', arrivalTime: '09:50', duration: '1h 40m' },
  { id: 5, trainName: 'Lucknow Mail', trainNumber: '12229', origin: 'Lucknow', destination: 'Mumbai', price: 1200, availableSeats: 60, departureTime: '22:00', arrivalTime: '20:15', duration: '22h 15m' },
  { id: 6, trainName: 'Howrah Express', trainNumber: '12311', origin: 'Kolkata', destination: 'Delhi', price: 1500, availableSeats: 30, departureTime: '19:40', arrivalTime: '15:20', duration: '19h 40m' },
  { id: 7, trainName: 'Vande Bharat', trainNumber: '22436', origin: 'Lucknow', destination: 'Indore', price: 1100, availableSeats: 150, departureTime: '05:50', arrivalTime: '14:30', duration: '8h 40m' },
  { id: 8, trainName: 'Tamil Nadu Express', trainNumber: '12621', origin: 'Delhi', destination: 'Chennai', price: 2400, availableSeats: 0, departureTime: '21:05', arrivalTime: '07:15', duration: '34h 10m' },
];

const Trains = () => {
  const { user } = useAuth();
  const [trains, setTrains] = useState([]);
  const [allTrains, setAllTrains] = useState([]);
  const [search, setSearch] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', color: '' });
  
  // Booking Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ passengers: 1, classType: '3A' });

  useEffect(() => {
    loadTrains();
  }, []);

  const loadTrains = async () => {
    try {
      const data = await apiGetTrains();
      setTrains(data);
      setAllTrains(data);
    } catch (err) {
      console.warn('Backend unavailable, using demo data');
      setTrains(MOCK_TRAINS);
      setAllTrains(MOCK_TRAINS);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', color: '' });
    try {
      const data = await apiSearchTrains(search.origin, search.destination);
      setTrains(data);
    } catch (err) {
      const filtered = allTrains.filter(t => {
        const matchOrigin = !search.origin || t.origin.toLowerCase().includes(search.origin.toLowerCase());
        const matchDest = !search.destination || t.destination.toLowerCase().includes(search.destination.toLowerCase());
        return matchOrigin && matchDest;
      });
      setTrains(filtered);
      if (filtered.length === 0) {
        setMsg({ text: 'No trains found for this route', color: 'orange' });
      } else {
        setMsg({ text: `Found ${filtered.length} train(s)`, color: 'green' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (train) => {
    if (!user) {
      setMsg({ text: 'Please login to book a train', color: 'orange' });
      return;
    }
    setSelectedTrain(train);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const res = await apiBookTrain(selectedTrain.id, bookingDetails.passengers, bookingDetails.classType);
      setMsg({ text: `Train booked! Reference: ${res.bookingReference}`, color: 'green' });
      setShowModal(false);
      loadTrains();
    } catch (err) {
      setMsg({ text: err.message, color: 'red' });
    }
  };

  return (
    <>
      <div className="booking-hero-bg text-center" style={{ '--hero-image': `url(https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80)` }}>
        <div className="hero-dark-overlay"></div>
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>🚂 Book Your Train</h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Comfortable, affordable train journeys to every corner of India.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
            {['PNR Status Tracking','Seat Availability Live','e-Ticket on Email','Instant Refunds'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Travel class info */}
        <div className="mb-4 mt-3">
          <h5 className="fw-bold mb-3" style={{ color: '#1A1A1A' }}>🛏️ Travel Classes Available</h5>
          <div className="d-flex gap-2 flex-wrap">
            {[
              { cls: 'SL',  label: 'Sleeper',       desc: 'Most economical', color: '#059669', bg: '#E6F9EE' },
              { cls: '3A',  label: '3-Tier AC',     desc: 'Popular choice',  color: '#1A73E8', bg: '#E8F1FF' },
              { cls: '2A',  label: '2-Tier AC',     desc: 'Extra comfort',   color: '#7B2FBE', bg: '#F3E8FF' },
              { cls: '1A',  label: '1st Class AC',  desc: 'Premium travel',  color: '#FF6B00', bg: '#FFF0E5' },
            ].map(({ cls, label, desc, color, bg }) => (
              <div key={cls} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: '10px', padding: '10px 16px', minWidth: '120px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color }}>{cls}</span>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', marginTop: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <Card className="booking-search-card glass-search-widget border-0">
        <Form onSubmit={handleSearch}>
          <Row className="g-2 align-items-center">
            <Col md={5}>
              <Form.Control 
                placeholder="From Station" 
                value={search.origin} 
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control 
                placeholder="To Station" 
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

      <div className="d-flex flex-column gap-4">
        {trains.map(t => (
          <Card key={t.id} className="border-0 shadow-sm rounded-4 overflow-hidden hover-up p-4" style={{ backgroundColor: 'var(--clr-surface)' }}>
            <Row className="align-items-center g-3">
              <Col md={3}>
                <div className="d-flex align-items-center gap-3">
                  <div className="airline-logo-box p-3 rounded-4" style={{ backgroundColor: '#FFF0E5' }}>
                    <i className="fa-solid fa-train text-primary fa-2x"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">{t.trainName}</h5>
                    <span className="badge bg-primary mt-1">{t.trainNumber}</span>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center justify-content-between text-center px-4">
                  <div>
                    <h4 className="fw-bold mb-0 text-dark">{t.departureTime || '10:00'}</h4>
                    <span className="text-muted small">{t.origin}</span>
                  </div>
                  <div className="flex-grow-1 mx-3 position-relative">
                    <div className="border-bottom w-100" style={{ borderStyle: 'dashed !important', borderColor: '#ccc' }}></div>
                    <div className="text-muted small position-absolute top-50 start-50 translate-middle" style={{ backgroundColor: 'var(--clr-surface)', padding: '0 4px', marginTop: '-12px' }}>{t.duration || '10h'}</div>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-dark">{t.arrivalTime || '20:00'}</h4>
                    <span className="text-muted small">{t.destination}</span>
                  </div>
                </div>
              </Col>
              <Col md={2} className="text-center">
                <Badge bg="success-subtle" text="success" className="rounded-pill px-3 py-2 mb-2">Runs Daily</Badge>
                <div className="text-muted small fw-bold" style={{ color: t.availableSeats > 20 ? 'green' : 'orange' }}>
                  {t.availableSeats} Seats Left
                </div>
              </Col>
              <Col md={3}>
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <div className="text-end">
                    <h4 className="fw-bold text-primary mb-0">₹{t.price}</h4>
                    <span className="text-muted small">Starting</span>
                  </div>
                  <Button 
                    variant="primary" 
                    className="rounded-pill px-4 fw-bold" 
                    onClick={() => handleBook(t)}
                    disabled={t.availableSeats <= 0}
                  >
                    {t.availableSeats > 0 ? 'Book' : 'Full'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
        {trains.length === 0 && (
          <div className="text-center py-5 text-muted">No trains found</div>
        )}
      </div>

      {/* Booking Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered rounded-4>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {selectedTrain && (
            <div className="mb-4 p-3 bg-light rounded-3">
              <h6 className="fw-bold mb-1">{selectedTrain.trainName}</h6>
              <p className="text-muted small mb-0">{selectedTrain.origin} → {selectedTrain.destination}</p>
            </div>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Number of Passengers</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                max={selectedTrain?.availableSeats}
                value={bookingDetails.passengers}
                onChange={(e) => setBookingDetails({...bookingDetails, passengers: parseInt(e.target.value)})}
                className="rounded-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Select Class</Form.Label>
              <Form.Select 
                value={bookingDetails.classType}
                onChange={(e) => setBookingDetails({...bookingDetails, classType: e.target.value})}
                className="rounded-3"
              >
                <option value="SL">Sleeper (SL)</option>
                <option value="3A">3-Tier AC (3A)</option>
                <option value="2A">2-Tier AC (2A)</option>
                <option value="1A">1st Class AC (1A)</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={() => setShowModal(false)} className="rounded-3 px-4">Cancel</Button>
          <Button variant="primary" onClick={confirmBooking} className="rounded-3 px-4 shadow-sm">Confirm Booking</Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </>
  );
};

export default Trains;
