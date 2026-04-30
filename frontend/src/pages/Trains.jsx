import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetTrains, apiSearchTrains, apiBookTrain } from '../services/api';
import flightSunsetImg from '../assets/images/flight_sunset.png';
import '../styles/homeCss.css';

const MOCK_TRAINS = [
  { id: 1, trainName: 'Rajdhani Express', trainNumber: '12309', origin: 'Delhi', destination: 'Mumbai', price: 1800, availableSeats: 120 },
  { id: 2, trainName: 'Shatabdi Express', trainNumber: '12001', origin: 'Delhi', destination: 'Lucknow', price: 950, availableSeats: 85 },
  { id: 3, trainName: 'Duronto Express', trainNumber: '12213', origin: 'Mumbai', destination: 'Delhi', price: 2100, availableSeats: 45 },
  { id: 4, trainName: 'Gatimaan Express', trainNumber: '12049', origin: 'Delhi', destination: 'Agra', price: 750, availableSeats: 200 },
  { id: 5, trainName: 'Lucknow Mail', trainNumber: '12229', origin: 'Lucknow', destination: 'Mumbai', price: 1200, availableSeats: 60 },
  { id: 6, trainName: 'Howrah Express', trainNumber: '12311', origin: 'Kolkata', destination: 'Delhi', price: 1500, availableSeats: 30 },
  { id: 7, trainName: 'Vande Bharat', trainNumber: '22436', origin: 'Lucknow', destination: 'Indore', price: 1100, availableSeats: 150 },
  { id: 8, trainName: 'Tamil Nadu Express', trainNumber: '12621', origin: 'Delhi', destination: 'Chennai', price: 2400, availableSeats: 0 },
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
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Comfortable train journeys across the country.</p>
        </Container>
      </div>

      <Container className="pb-5">
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

      <div className="table-responsive rounded-4 shadow-sm overflow-hidden border border-secondary" style={{ backgroundColor: 'var(--clr-surface)' }}>
        <Table hover variant="dark" className="mb-0">
          <thead className="text-white" style={{ backgroundColor: 'var(--clr-primary)' }}>
            <tr>
              <th>Train Name</th>
              <th>Number</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trains.map(t => (
              <tr key={t.id} className="align-middle">
                <td>
                  <div className="fw-bold">{t.trainName}</div>
                </td>
                <td><span className="badge bg-primary">{t.trainNumber}</span></td>
                <td>{t.origin}</td>
                <td>{t.destination}</td>
                <td className="text-primary fw-bold">₹{t.price}</td>
                <td>{t.availableSeats}</td>
                <td>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="px-3 rounded-pill"
                    onClick={() => handleBook(t)}
                    disabled={t.availableSeats <= 0}
                  >
                    {t.availableSeats > 0 ? 'Book' : 'Full'}
                  </Button>
                </td>
              </tr>
            ))}
            {trains.length === 0 && (
              <tr><td colSpan="7" className="text-center py-5 text-muted">No trains found</td></tr>
            )}
          </tbody>
        </Table>
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
