import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetShows, apiBookShow, apiGetBookings } from '../services/api';
import entertainmentShowsImg from '../assets/images/entertainment_shows.png';
import '../styles/homeCss.css';

const MOCK_SHOWS = [
  { id: 1, name: 'Pushpa 2: The Rule', genre: 'Action / Drama', price: 250, rating: '8.2', imageUrl: 'https://image.tmdb.org/t/p/w500/bBFC6YOjEJYjnOealIG9ELcHk9g.jpg', summary: 'Pushpa Raj returns in this action-packed sequel, facing new enemies while building his sandalwood empire.' },
  { id: 2, name: 'Jawan', genre: 'Action / Thriller', price: 300, rating: '7.8', imageUrl: 'https://image.tmdb.org/t/p/w500/jFsBmmGM0Ifspp2WGhNVYy69sjY.jpg', summary: 'A prison warden recruits inmates to commit crimes that expose the corruption plaguing the country.' },
  { id: 3, name: 'Animal', genre: 'Crime / Drama', price: 350, rating: '7.5', imageUrl: 'https://image.tmdb.org/t/p/w500/sg8YRcaPx1TsME5hSjKylBvGqRb.jpg', summary: 'A son undergoes a transformative journey when he decides to avenge his father against threats.' },
  { id: 4, name: 'Dunki', genre: 'Comedy / Drama', price: 200, rating: '7.0', imageUrl: 'https://image.tmdb.org/t/p/w500/diyvmLs6CXkKBMhksqpqz2LBSQ0.jpg', summary: 'A group of aspiring immigrants attempt to reach their dream country through unconventional means.' },
  { id: 5, name: 'Oppenheimer', genre: 'Drama / History', price: 400, rating: '9.0', imageUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', summary: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
  { id: 6, name: 'Avengers: Endgame', genre: 'Action / Sci-Fi', price: 350, rating: '8.4', imageUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', summary: 'The Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.' },
];

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
      .catch(err => {
        console.warn('Backend unavailable, using demo data');
        setShows(MOCK_SHOWS);
        if (MOCK_SHOWS.length > 0) {
          setBookingForm(prev => ({ ...prev, movie: MOCK_SHOWS[0].id.toString() }));
        }
      });
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
    <>
      {/* Hero — 220px max, buttons inside */}
      <div
        className="booking-hero-bg text-center"
        style={{
          '--hero-image': `url(https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&q=80)`,
          height: '220px',
          maxHeight: '220px',
        }}
      >
        <div className="hero-dark-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%)' }}></div>
        <Container className="position-relative d-flex flex-column align-items-center justify-content-center h-100" style={{ zIndex: 2 }}>
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.6rem' }}>🎬 Cinema &amp; Shows</h1>
          <p style={{ opacity: 0.88, fontSize: '0.85rem', marginBottom: '14px' }}>Catch the latest blockbusters and live performances.</p>
          {/* Action buttons inside hero */}
          <div className="d-flex gap-2">
            <Button
              variant="outline-light"
              size="sm"
              className="rounded-pill px-3 fw-semibold"
              style={{ fontSize: '13px', borderColor: 'rgba(255,255,255,0.7)' }}
              onClick={() => document.getElementById('bookingSection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🎟 My Tickets
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="rounded-pill px-3 fw-semibold"
              style={{ fontSize: '13px' }}
              onClick={() => setShowBooking(true)}
            >
              + Book Tickets
            </Button>
          </div>
        </Container>
      </div>

      <Container className="shows-page pb-4" style={{ marginTop: '1.5rem' }}>

      {/* Movie cards — 4-col grid, compact */}
      <Row className="g-3 mb-4">
        {shows.map(show => (
          <Col key={show.id} xs={12} sm={6} md={4} lg={3}>
            <div
              className="h-100 bg-white hover-up"
              style={{
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onClick={() => setSelectedShow(show)}
            >
              {/* Poster image */}
              <div style={{ position: 'relative' }}>
                <img
                  src={show.imageUrl}
                  alt={show.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                />
                <span
                  style={{
                    position: 'absolute', top: '8px', left: '8px',
                    background: 'rgba(0,0,0,0.65)', color: '#FFD700',
                    fontSize: '11px', fontWeight: 700, padding: '2px 8px',
                    borderRadius: '20px', backdropFilter: 'blur(4px)',
                  }}
                >
                  ⭐ {show.rating || 'N/A'}
                </span>
              </div>
              {/* Card body */}
              <div style={{ padding: '10px 12px 12px' }}>
                <h6 className="fw-bold mb-1" style={{ fontSize: '0.92rem', color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {show.name}
                </h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.75rem', color: '#888888' }}>{show.genre}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FF6B00' }}>₹{show.price}</span>
                </div>
                <button
                  className="btn btn-outline-primary w-100 rounded-pill fw-semibold"
                  style={{ fontSize: '12px', padding: '5px 0' }}
                  onClick={(e) => { e.stopPropagation(); setSelectedShow(show); }}
                >
                  View Details
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Booked Tickets Section */}
      <div id="bookingSection" className="pt-5">
        <div className="card-glass rounded-5 p-5 shadow-sm border">
          <h3 className="fw-bold mb-4">Your <span className="text-gradient">Booked Tickets</span></h3>
          <Row className="g-4">
            {bookings.length === 0 ? (
              <Col className="text-center py-5 text-muted">No tickets booked yet.</Col>
            ) : (
              bookings.map((b, i) => (
                <Col md={6} key={i}>
                  <Card className="border-0 shadow-sm rounded-4 p-4">
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
    </>
  );
};

export default Shows;
