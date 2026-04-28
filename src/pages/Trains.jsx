import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetTrains, apiSearchTrains, apiBookTrain } from '../services/api';
const Trains = () => {
  const { user } = useAuth();
  const [trains, setTrains] = useState([]);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiSearchTrains(search.origin, search.destination);
      setTrains(data);
    } catch (err) {
      setMsg({ text: 'Search failed', color: 'red' });
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
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ fontWeight: 800 }}>Train Tickets</h1>
      
      <Card className="p-4 mb-5 shadow-sm border-0 bg-light rounded-4">
        <Form onSubmit={handleSearch}>
          <Row className="g-3">
            <Col md={5}>
              <Form.Control 
                placeholder="From Station" 
                className="rounded-3 border-0 shadow-sm"
                value={search.origin} 
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control 
                placeholder="To Station" 
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

      <div className="table-responsive bg-white rounded-4 shadow-sm overflow-hidden border">
        <Table hover className="mb-0">
          <thead className="bg-primary text-white">
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
                <td><span className="badge bg-secondary">{t.trainNumber}</span></td>
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
  );
};

export default Trains;
