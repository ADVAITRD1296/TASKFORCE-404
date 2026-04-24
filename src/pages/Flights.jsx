import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetFlights, apiSearchFlights, apiBookFlight } from '../services/api';
import '../styles/flight.css';

const Flights = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', color: '' });

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
      setMsg({ text: 'Search failed', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId) => {
    if (!user) {
      setMsg({ text: 'Please login to book a flight', color: 'orange' });
      return;
    }
    try {
      const res = await apiBookFlight(flightId, 1, 'Economy');
      setMsg({ text: `Flight booked! Reference: ${res.bookingReference}`, color: 'green' });
      loadFlights();
    } catch (err) {
      setMsg({ text: err.message, color: 'red' });
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ fontWeight: 800 }}>Flight Tickets</h1>
      
      <Card className="p-4 mb-5 shadow-sm border-0 bg-light">
        <Form onSubmit={handleSearch}>
          <Row className="g-3">
            <Col md={5}>
              <Form.Control 
                placeholder="From (Origin)" 
                value={search.origin} 
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control 
                placeholder="To (Destination)" 
                value={search.destination} 
                onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {msg.text && (
        <div className={`alert alert-${msg.color === 'green' ? 'success' : (msg.color === 'orange' ? 'warning' : 'danger')} mb-4`}>
          {msg.text}
        </div>
      )}

      <Table hover responsive className="bg-white rounded shadow-sm overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th>Airline</th>
            <th>Flight #</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Price</th>
            <th>Seats</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(f => (
            <tr key={f.id}>
              <td>{f.airline}</td>
              <td>{f.flightNumber}</td>
              <td>{f.origin}</td>
              <td>{f.destination}</td>
              <td>₹{f.price}</td>
              <td>{f.availableSeats}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => handleBook(f.id)}
                  disabled={f.availableSeats <= 0}
                >
                  {f.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                </Button>
              </td>
            </tr>
          ))}
          {flights.length === 0 && (
            <tr><td colSpan="7" className="text-center py-4 text-muted">No flights found</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Flights;
