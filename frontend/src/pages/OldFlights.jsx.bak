import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetFlights, apiSearchFlights, apiBookFlight } from '../services/api';
import { WhatsappShareButton, TwitterShareButton, WhatsappIcon, TwitterIcon } from 'react-share';
import flightSunsetImg from '../assets/images/flight_sunset.png';
import '../styles/homeCss.css';

const MOCK_FLIGHTS = [
  { id: 1, airline: 'Air India', flightNumber: 'AI-302', origin: 'Delhi', destination: 'Mumbai', price: 4500, availableSeats: 42, departureTime: '06:00', arrivalTime: '08:15', duration: '2h 15m' },
  { id: 2, airline: 'IndiGo', flightNumber: '6E-221', origin: 'Mumbai', destination: 'Bangalore', price: 3800, availableSeats: 18, departureTime: '10:30', arrivalTime: '12:45', duration: '2h 15m' },
  { id: 3, airline: 'SpiceJet', flightNumber: 'SG-145', origin: 'Delhi', destination: 'Goa', price: 5200, availableSeats: 7, departureTime: '14:00', arrivalTime: '16:30', duration: '2h 30m' },
  { id: 4, airline: 'Vistara', flightNumber: 'UK-819', origin: 'Bangalore', destination: 'Delhi', price: 6100, availableSeats: 30, departureTime: '07:45', arrivalTime: '10:30', duration: '2h 45m' },
  { id: 5, airline: 'Air India', flightNumber: 'AI-505', origin: 'Lucknow', destination: 'Mumbai', price: 5800, availableSeats: 22, departureTime: '09:00', arrivalTime: '11:15', duration: '2h 15m' },
  { id: 6, airline: 'IndiGo', flightNumber: '6E-789', origin: 'Lucknow', destination: 'Indore', price: 3200, availableSeats: 35, departureTime: '13:00', arrivalTime: '14:30', duration: '1h 30m' },
  { id: 7, airline: 'GoAir', flightNumber: 'G8-412', origin: 'Hyderabad', destination: 'Chennai', price: 2900, availableSeats: 50, departureTime: '16:00', arrivalTime: '17:15', duration: '1h 15m' },
  { id: 8, airline: 'Vistara', flightNumber: 'UK-623', origin: 'Kolkata', destination: 'Delhi', price: 5500, availableSeats: 0, departureTime: '20:00', arrivalTime: '22:30', duration: '2h 30m' },
];

const Flights = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [search, setSearch] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', color: '' });

  // Booking Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ passengers: 1, classType: 'Economy' });

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const data = await apiGetFlights();
      setFlights(data);
      setAllFlights(data);
    } catch (err) {
      console.warn('Backend unavailable, using demo data');
      setFlights(MOCK_FLIGHTS);
      setAllFlights(MOCK_FLIGHTS);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', color: '' });
    try {
      const data = await apiSearchFlights(search.origin, search.destination);
      setFlights(data);
    } catch (err) {
      // Fallback: filter mock data locally
      const filtered = allFlights.filter(f => {
        const matchOrigin = !search.origin || f.origin.toLowerCase().includes(search.origin.toLowerCase());
        const matchDest = !search.destination || f.destination.toLowerCase().includes(search.destination.toLowerCase());
        return matchOrigin && matchDest;
      });
      setFlights(filtered);
      if (filtered.length === 0) {
        setMsg({ text: 'No flights found for this route', color: 'warning' });
      } else {
        setMsg({ text: `Found ${filtered.length} flight(s)`, color: 'primary' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (flight) => {
    if (!user) {
      setMsg({ text: 'Please login to book a flight', color: 'warning' });
      return;
    }
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const res = await apiBookFlight(selectedFlight.id, bookingDetails.passengers, bookingDetails.classType);
      setMsg({ text: `Flight booked! Reference: ${res.bookingReference}`, color: 'success' });
      setShowModal(false);
      loadFlights();
    } catch (err) {
      setMsg({ text: err.message, color: 'danger' });
    }
  };

  return (
    <>
      <div className="booking-hero-bg text-center" style={{ '--hero-image': `url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)` }}>
        <div className="hero-dark-overlay"></div>
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>✈ Fly Higher</h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Search and compare the cheapest flights across all major airlines.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
            {['No Hidden Fees','Instant Confirmation','Free Cancellation*','24/7 Support'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Popular Routes */}
        <div className="mb-4 mt-3">
          <h5 className="fw-bold mb-3" style={{ color: '#1A1A1A' }}>🔥 Popular Routes</h5>
          <div className="d-flex gap-2 flex-wrap">
            {[
              { from: 'DEL', to: 'BOM', label: 'Delhi → Mumbai', price: '₹3,499' },
              { from: 'BOM', to: 'BLR', label: 'Mumbai → Bangalore', price: '₹2,999' },
              { from: 'DEL', to: 'GOI', label: 'Delhi → Goa', price: '₹4,299' },
              { from: 'BLR', to: 'HYD', label: 'Bangalore → Hyderabad', price: '₹1,899' },
            ].map(({ label, price }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', transition: 'border-color 0.2s ease', display: 'flex', flexDirection: 'column', gap: '2px' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF6B00'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{label}</span>
                <span style={{ fontSize: '12px', color: '#FF6B00', fontWeight: 700 }}>from {price}</span>
              </div>
            ))}
          </div>
        </div>
        <Card className="booking-search-card glass-search-widget border-0">
        <Form onSubmit={handleSearch}>
          <Row className="g-2 align-items-center">
            <Col md={5}>
              <Form.Control 
                placeholder="From — Origin city or airport" 
                value={search.origin} 
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control 
                placeholder="To — Destination city or airport" 
                value={search.destination} 
                onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" type="submit" className="w-100 rounded-3 fw-bold" disabled={loading}>
                {loading ? '...' : '🔍 Search'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {msg.text && (
        <div className={`alert alert-${msg.color} rounded-4 shadow-sm mb-4 text-center fw-bold`}>
          {msg.text}
        </div>
      )}

      <div className="d-flex flex-column gap-4">
        {flights.map(f => (
          <Card key={f.id} className="border-0 shadow-sm rounded-5 overflow-hidden hover-up flight-card p-4">
            <Row className="align-items-center g-4">
              <Col md={3}>
                <div className="d-flex align-items-center gap-3">
                  <div className="airline-logo-box p-3 rounded-4">
                    <i className="fa-solid fa-plane text-primary fa-2x"></i>
                  </div>
                  <div>
                            <h5 className="fw-bold mb-0" style={{fontSize: '1rem'}}>{f.airline}</h5>
                    <span className="text-muted small">{f.flightNumber}</span>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center justify-content-between text-center px-4">
                  <div>
                    <h4 className="fw-bold mb-0">{f.departureTime}</h4>
                    <span className="text-muted small">{f.origin}</span>
                  </div>
                  <div className="flex-grow-1 mx-3 position-relative">
                    <div className="border-bottom w-100" style={{ borderStyle: 'dashed !important' }}></div>
                    <i className="fa-solid fa-plane text-primary position-absolute top-50 start-50 translate-middle px-2" style={{ fontSize: '12px', backgroundColor: 'var(--clr-surface)' }}></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{f.arrivalTime}</h4>
                    <span className="text-muted small">{f.destination}</span>
                  </div>
                </div>
              </Col>
              <Col md={2} className="text-center">
                <Badge bg="primary-subtle" text="primary" className="rounded-pill px-3 py-2 mb-2">Non-stop</Badge>
                <div className="text-muted small">{f.duration}</div>
              </Col>
              <Col md={3}>
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <div className="text-end">
                    <h4 className="fw-bold text-primary mb-0">₹{f.price}</h4>
                    <span className="text-muted small">Economy</span>
                  </div>
                  <Button 
                    variant="primary" 
                    className="rounded-pill px-4" 
                    onClick={() => handleBook(f)}
                    disabled={f.availableSeats <= 0}
                  >
                    {f.availableSeats > 0 ? 'Book' : 'Full'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        ))}
        {flights.length === 0 && (
          <div className="text-center py-5 text-muted">No flights found</div>
        )}
      </div>

      {/* Flight Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered rounded-4>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Confirm Flight</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {selectedFlight && (
            <div className="mb-4 p-3 bg-light rounded-3">
              <h6 className="fw-bold mb-1">{selectedFlight.airline} - {selectedFlight.flightNumber}</h6>
              <p className="text-muted small mb-0">{selectedFlight.origin} → {selectedFlight.destination}</p>
            </div>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Number of Passengers</Form.Label>
              <Form.Control 
                type="number" 
                min="1" 
                max={selectedFlight?.availableSeats}
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
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
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

export default Flights;
