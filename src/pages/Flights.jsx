import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetFlights, apiSearchFlights, apiBookFlight } from '../services/api';
import { WhatsappShareButton, TwitterShareButton, WhatsappIcon, TwitterIcon } from 'react-share';
import '../styles/homeCss.css';

const Flights = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiSearchFlights(search.origin, search.destination);
      setFlights(data);
    } catch (err) {
      setMsg({ text: 'Search failed', color: 'danger' });
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
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Fly <span className="text-gradient">Higher</span></h1>
        <p className="text-muted lead">Book the fastest flights at the lowest prices.</p>
      </div>
      
      <Card className="p-4 mb-5 shadow-lg border-0 bg-white rounded-5">
        <Form onSubmit={handleSearch}>
          <Row className="g-3 align-items-end">
            <Col md={5}>
              <Form.Label className="small fw-bold text-muted ms-2 text-uppercase">Origin</Form.Label>
              <Form.Control 
                placeholder="From (Origin)" 
                className="bg-light border-0 py-3"
                value={search.origin} 
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Label className="small fw-bold text-muted ms-2 text-uppercase">Destination</Form.Label>
              <Form.Control 
                placeholder="To (Destination)" 
                className="bg-light border-0 py-3"
                value={search.destination} 
                onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" type="submit" className="w-100 py-3 rounded-4 fw-bold shadow-sm" disabled={loading}>
                {loading ? '...' : 'Search'}
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
          <Card key={f.id} className="border-0 shadow-sm rounded-5 overflow-hidden hover-up flight-card bg-white p-4">
            <Row className="align-items-center g-4">
              <Col md={3}>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-3 rounded-4">
                    <i className="fa-solid fa-plane text-primary fa-2x"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">{f.airline}</h5>
                    <span className="text-muted small">{f.flightNumber}</span>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center justify-content-between text-center px-4">
                  <div>
                    <h4 className="fw-bold mb-0">10:00</h4>
                    <span className="text-muted small">{f.origin}</span>
                  </div>
                  <div className="flex-grow-1 mx-3 position-relative">
                    <div className="border-bottom w-100" style={{ borderStyle: 'dashed !important' }}></div>
                    <i className="fa-solid fa-plane text-primary position-absolute top-50 start-50 translate-middle bg-white px-2" style={{ fontSize: '12px' }}></i>
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">13:00</h4>
                    <span className="text-muted small">{f.destination}</span>
                  </div>
                </div>
              </Col>
              <Col md={2} className="text-center">
                <Badge bg="primary-subtle" text="primary" className="rounded-pill px-3 py-2 mb-2">Non-stop</Badge>
                <div className="text-muted small">2h 30m</div>
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
  );
};

export default Flights;
