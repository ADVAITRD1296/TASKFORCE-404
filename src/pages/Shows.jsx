import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetShows, apiBookShow, apiGetBookings } from '../services/api';
import '../styles/homeCss.css';

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

  const handleBookSubmit = async () => {
    if (!user) {
      alert("Please login to book tickets!");
      return;
    }

    const selectedMovie = shows.find(s => s.id.toString() === bookingForm.movie);
    if (!selectedMovie) return;

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
    } catch (error) {
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Container className="shows-page py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Cinema & <span className="text-gradient">Shows</span></h1>
        <p className="text-muted lead">Catch the latest blockbusters and live performances.</p>
      </div>

      <div className="d-flex justify-content-end gap-3 mb-5">
        <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => document.getElementById('bookingSection')?.scrollIntoView({ behavior: 'smooth' })}>
          My Tickets
        </Button>
        <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowBooking(true)}>
          Book Tickets
        </Button>
      </div>

      <Row className="g-4 mb-5">
        {shows.map(show => (
          <Col key={show.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 border-0 shadow-lg rounded-5 overflow-hidden hover-up bg-white movie-card" onClick={() => setSelectedShow(show)}>
              <div className="position-relative">
                <Card.Img variant="top" src={show.imageUrl} alt={show.name} style={{ height: '400px', objectFit: 'cover' }} />
                <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-gradient-dark text-white">
                  <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2 shadow-sm mb-2">
                    ⭐ {show.rating || 'N/A'}
                  </Badge>
                  <h5 className="fw-bold mb-0">{show.name}</h5>
                </div>
              </div>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small">{show.genre}</span>
                  <span className="text-primary fw-bold">₹{show.price}</span>
                </div>
                <Button variant="outline-primary" className="w-100 rounded-pill" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedShow(show);
                }}>
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Booked Tickets Section */}
      <div id="bookingSection" className="pt-5">
        <div className="bg-glass rounded-5 p-5 shadow-sm border">
          <h3 className="fw-bold mb-4">Your <span className="text-gradient">Booked Tickets</span></h3>
          <Row className="g-4">
            {bookings.length === 0 ? (
              <Col className="text-center py-5 text-muted">No tickets booked yet.</Col>
            ) : (
              bookings.map((b, i) => (
                <Col md={6} key={i}>
                  <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{b.details.split('|')[0]}</h5>
                        <span className="text-muted small">Ref: {b.bookingReference}</span>
                      </div>
                      <Badge bg={b.status === 'CONFIRMED' ? 'success' : 'danger'} className="rounded-pill">
                        {b.status}
                      </Badge>
                    </div>
                    <div className="border-top pt-3 mt-2 d-flex justify-content-between align-items-center">
                      <span className="text-muted small">{new Date(b.createdAt).toLocaleDateString()}</span>
                      <span className="fw-bold text-primary">₹{b.totalPrice}</span>
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal show={!!selectedShow} onHide={() => setSelectedShow(null)} centered size="lg" className="rounded-5 overflow-hidden">
        <Modal.Body className="p-0">
          <Row className="g-0">
            <Col md={5}>
              <img src={selectedShow?.imageUrl} alt={selectedShow?.name} className="w-100 h-100 object-fit-cover" style={{ minHeight: '400px' }} />
            </Col>
            <Col md={7} className="p-5">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="fw-bold mb-0">{selectedShow?.name}</h2>
                <Button variant="link" className="text-muted p-0" onClick={() => setSelectedShow(null)}>
                  <i className="fa-solid fa-xmark fa-xl"></i>
                </Button>
              </div>
              <Badge bg="primary-subtle" text="primary" className="rounded-pill mb-4 px-3 py-2">{selectedShow?.genre}</Badge>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                {selectedShow?.summary ? selectedShow.summary.replace(/<[^>]*>?/gm, '') : 'No description available.'}
              </p>
              <div className="mt-5 d-flex gap-3">
                <Button variant="primary" className="rounded-pill px-5 py-2" onClick={() => {
                  setSelectedShow(null);
                  setShowBooking(true);
                }}>
                  Book Now
                </Button>
                <div className="text-end ms-auto">
                  <span className="d-block text-muted small">Price per ticket</span>
                  <span className="h4 fw-bold text-primary">₹{selectedShow?.price}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Booking Modal */}
      <Modal show={showBooking} onHide={() => setShowBooking(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Book Tickets</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted text-uppercase">Select Movie</Form.Label>
              <Form.Select id="movie" className="bg-light border-0 py-3" value={bookingForm.movie} onChange={handleBookingChange}>
                {shows.map(show => (
                  <option key={show.id} value={show.id}>
                    {show.name} (₹{show.price})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted text-uppercase">Tickets</Form.Label>
                <Form.Control type="number" id="tickets" className="bg-light border-0 py-3" min="1" max="10" value={bookingForm.tickets} onChange={handleBookingChange} />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold text-muted text-uppercase">Time</Form.Label>
                <Form.Select id="showtime" className="bg-light border-0 py-3" value={bookingForm.showtime} onChange={handleBookingChange}>
                  <option>10:00 AM</option>
                  <option>1:30 PM</option>
                  <option>7:00 PM</option>
                </Form.Select>
              </Col>
            </Row>
            <Button variant="primary" className="w-100 py-3 rounded-4 fw-bold" onClick={handleBookSubmit} disabled={isBooking}>
              {isBooking ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Shows;
