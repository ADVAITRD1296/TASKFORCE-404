import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetBuses, apiSearchBuses, apiBookBus } from '../services/api';
const Buses = () => {
  const { user } = useAuth();
  const [buses, setBuses] = useState([]);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiSearchBuses(search.origin, search.destination);
      setBuses(data);
    } catch (err) {
      setMsg({ text: 'Search failed', color: 'red' });
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
      setMsg({ text: `Bus booked! Reference: ${res.bookingReference}`, color: 'green' });
      setShowModal(false);
      loadBuses();
    } catch (err) {
      setMsg({ text: err.message, color: 'red' });
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ fontWeight: 800 }}>Bus Tickets</h1>
      
      <Card className="p-4 mb-5 shadow-sm border-0 bg-light rounded-4">
        <Form onSubmit={handleSearch}>
          <Row className="g-3">
            <Col md={5}>
              <Form.Control 
                placeholder="From City" 
                className="rounded-3 border-0 shadow-sm"
                value={search.origin} 
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control 
                placeholder="To City" 
                className="rounded-3 border-0 shadow-sm"
                value={search.destination} 
                onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" type="submit" className="w-100 rounded-3 shadow-sm" disabled={loading}>
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
            <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden bus-card">
              <Row className="g-0 h-100">
                <Col md={4}>
                  <div 
                    className="h-100 bg-cover" 
                    style={{ 
                      backgroundImage: `url(${b.imageUrl})`,
                      minHeight: '150px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </Col>
                <Col md={8}>
                  <Card.Body className="d-flex flex-col justify-between p-4">
                    <div>
                      <div className="d-flex justify-between items-start mb-2">
                        <h5 className="fw-bold mb-0">{b.operatorName}</h5>
                        <span className="text-primary fw-bold">₹{b.price}</span>
                      </div>
                      <p className="text-muted small mb-3">{b.busType}</p>
                      <div className="d-flex items-center gap-2 mb-4">
                        <span className="fw-medium">{b.origin}</span>
                        <i className="fa-solid fa-arrow-right text-muted small"></i>
                        <span className="fw-medium">{b.destination}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-between items-center mt-auto">
                      <span className="text-muted small">{b.availableSeats} seats left</span>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="px-4 rounded-pill"
                        onClick={() => handleBook(b)}
                        disabled={b.availableSeats <= 0}
                      >
                        Book Now
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
  );
};

export default Buses;
