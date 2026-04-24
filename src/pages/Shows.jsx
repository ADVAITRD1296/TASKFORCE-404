import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetShows, apiBookShow, apiGetBookings } from '../services/api';
import '../styles/showsCss.css';

const Shows = () => {
  const { user, token } = useAuth();
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    movie: '',
    tickets: 1,
    showtime: '10:00 AM'
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    apiGetShows()
      .then(data => {
        setShows(data);
        if (data.length > 0) {
          setBookingForm(prev => ({ ...prev, movie: data[0].id.toString() }));
        }
      })
      .catch(err => console.error('Error fetching shows:', err));
  }, []);

  useEffect(() => {
    if (user && token) {
      loadBookings();
    } else {
      setBookings([]);
    }
  }, [user, token]);

  const loadBookings = () => {
    apiGetBookings('SHOW')
      .then(data => setBookings(data))
      .catch(err => console.error('Error fetching bookings:', err));
  };

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.id]: e.target.value });
  };

  const calculateTotal = async () => {
    if (!user) {
      alert("Please login to book tickets!");
      return;
    }

    const selectedMovie = shows.find(s => s.id.toString() === bookingForm.movie);
    if (!selectedMovie) return;

    const total = selectedMovie.price * Number(bookingForm.tickets);
    setTotalPrice(total);
    
    setIsBooking(true);
    try {
      await apiBookShow(
        selectedMovie.name,
        bookingForm.tickets,
        bookingForm.showtime,
        selectedMovie.price
      );
      alert(`Successfully booked tickets for ${selectedMovie.name}!`);
      loadBookings();
      setShowBooking(false);
      document.getElementById('bookingSection')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Container className="shows-page py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="showsheading" style={{ fontWeight: 800 }}>TRENDING MOVIES</h1>
        <div className="d-flex gap-2">
            <Button variant="info" onClick={() => document.getElementById('bookingSection')?.scrollIntoView({ behavior: 'smooth' })}>
                Booked Tickets
            </Button>
            <Button variant="primary" onClick={() => setShowBooking(true)}>
                Book Now
            </Button>
        </div>
      </div>

      <Row className="g-4">
        {shows.map(show => (
          <Col key={show.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="movie-card h-100 shadow-sm border-0" onClick={() => setSelectedShow(show)}>
            <Card.Img variant="top" src={show.imageUrl} alt={show.name} style={{ height: '350px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title className="h5">{show.name}</Card.Title>
                <Card.Text className="text-warning">
                  <i className="fa-solid fa-star me-1"></i> {show.rating || 'N/A'}
                </Card.Text>
                <Card.Text className="text-muted mb-0">{show.genre}</Card.Text>
                <Card.Text className="fw-bold text-primary">₹{show.price}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Movie Details Modal */}
      <Modal show={!!selectedShow} onHide={() => setSelectedShow(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedShow?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <img src={selectedShow?.imageUrl} alt={selectedShow?.name} className="img-fluid rounded" />
            </Col>
            <Col md={8}>
              <div dangerouslySetInnerHTML={{ __html: selectedShow?.summary }} />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Booking Modal */}
      <Modal show={showBooking} onHide={() => setShowBooking(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Tickets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Movie</Form.Label>
              <Form.Select id="movie" value={bookingForm.movie} onChange={handleBookingChange}>
                {shows.map(show => (
                  <option key={show.id} value={show.id}>
                    {show.name} - ₹{show.price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Tickets</Form.Label>
              <Form.Control type="number" id="tickets" min="1" max="10" value={bookingForm.tickets} onChange={handleBookingChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Show Time</Form.Label>
              <Form.Select id="showtime" value={bookingForm.showtime} onChange={handleBookingChange}>
                <option>10:00 AM</option>
                <option>1:30 PM</option>
                <option>4:00 PM</option>
                <option>7:00 PM</option>
                <option>10:00 PM</option>
              </Form.Select>
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" onClick={calculateTotal} disabled={isBooking}>
                {isBooking ? 'Booking...' : 'Book Tickets'}
              </Button>
            </div>
            {totalPrice > 0 && (
                <div className="mt-3 text-center text-success fw-bold">
                    Total Price: ₹{totalPrice}
                </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Booked Tickets Section */}
      <div id="bookingSection" className="mt-5 pt-5">
        <h2 className="mb-4" style={{ fontWeight: 800 }}>Your Booked Tickets</h2>
        <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
                <Table striped bordered hover className="mb-0">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th>REFERENCE</th>
                            <th>DETAILS</th>
                            <th>PRICE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center py-4">No tickets booked yet.</td>
                            </tr>
                        ) : (
                            bookings.map((b, i) => (
                                <tr key={i}>
                                    <td>{b.bookingReference}</td>
                                    <td>{b.details}</td>
                                    <td>₹{b.totalPrice}</td>
                                    <td>
                                      <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>
                                        {b.status}
                                      </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Shows;
