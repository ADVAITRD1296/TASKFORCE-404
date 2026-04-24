import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetHotels, apiSearchHotels, apiBookHotel } from '../services/api';
import '../styles/hotel.css';

const Hotels = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    destination: '',
    checkin: '',
    checkout: '',
    guests: '1 Guest',
    roomType: 'Standard Room'
  });
  const [msg, setMsg] = useState('');
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const destinations = [
    { name: 'New Delhi', img: 'https://pohcdn.com/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/New-Delhi-2.jpg' },
    { name: 'Bengaluru', img: 'https://karnatakatourism.org/_next/image/?url=https%3A%2F%2Fweb-cms.karnatakatourism.org%2Fwp-content%2Fuploads%2F2025%2F06%2FUB_City_at_night_.jpg&w=3840&q=75' },
    { name: 'Goa', img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fc/f0/goa.jpg?w=600&h=500&s=1' },
    { name: 'Mumbai', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F7xZ48abwAAgNst.jpg/960px-F7xZ48abwAAgNst.jpg' },
    { name: 'Chennai', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Chennai_-_bird%27s-eye_view.jpg/1200px-Chennai_-_bird%27s-eye_view.jpg' },
    { name: 'Hyderabad', img: 'https://static.toiimg.com/thumb/msid-92654212,width-748,height-499,resizemode=4,imgsize-128652/.jpg' }
  ];

  useEffect(() => {
    // Load initial featured hotels from DB
    apiGetHotels()
      .then(data => {
        // Just take the first few as featured
        setFeaturedHotels(data.slice(0, 3));
      })
      .catch(err => console.error('Error loading hotels:', err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMsg(`Searching for hotels in ${formData.destination}...`);
    setIsLoading(true);
    
    try {
      const results = await apiSearchHotels(formData.destination, formData.roomType);
      setFeaturedHotels(results);
      setMsg(`Found ${results.length} hotels matching your criteria.`);
      // Scroll to results
      document.getElementById('featured-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setMsg('Failed to search hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (hotel) => {
    if (!user) {
      alert("Please login first to book a hotel!");
      return;
    }
    
    // Basic check for dates
    if (!formData.checkin || !formData.checkout) {
      alert("Please select check-in and check-out dates in the search form first!");
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const res = await apiBookHotel(
        hotel.id,
        formData.checkin,
        formData.checkout,
        formData.guests,
        hotel.roomType
      );
      alert(`Success! Booked ${hotel.name}. Reference: ${res.bookingReference}`);
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
    }
  };

  return (
    <div className="hotels-page py-5">
      <section className="trending-section mt-4">
        <Container className="text-center">
          <h2 className="trend-title mb-2" style={{ fontWeight: 800 }}>Trending Destinations</h2>
          <p className="text-muted">Most popular choices for travellers from India</p>
          <Row className="g-4 mt-3">
            {destinations.map((dest, i) => (
              <Col key={i} md={4}>
                <div className="dest-card position-relative overflow-hidden rounded shadow-sm">
                  <img src={dest.img} className="dest-img w-100" style={{ height: '250px', objectFit: 'cover' }} alt={dest.name} />
                  <div className="dest-overlay position-absolute bottom-0 start-0 end-0 p-3 text-white fw-bold bg-dark bg-opacity-50">
                    {dest.name}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section id="featured-results" className="featured-section my-5">
        <Container>
          <h2 className="mb-4" style={{ fontWeight: 800 }}>Featured Hotels</h2>
          <Row className="g-4">
            {featuredHotels.length === 0 ? (
               <Col><p className="text-muted">No hotels found matching your search.</p></Col>
            ) : (
              featuredHotels.map((hotel, i) => (
                <Col key={i} md={4}>
                  <Card className="hotel-card h-100 shadow-sm border-0">
                    <Card.Img variant="top" src={hotel.imageUrl} style={{ height: '220px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{hotel.name}</Card.Title>
                      <Card.Text className="text-muted small mb-1">{hotel.location}</Card.Text>
                      <Card.Text className="text-warning mb-1">⭐ {hotel.rating || '4.5'} · Excellent</Card.Text>
                      <Card.Text className="fw-bold text-primary">From ₹{hotel.pricePerNight} / night</Card.Text>
                      <Button variant="outline-primary" size="sm" onClick={() => handleBook(hotel)}>
                        Book now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      <section id="booking-section" className="hotel-search-section py-5 bg-white shadow-sm mx-3 rounded">
        <Container>
          <h2 className="text-center mb-4" style={{ fontWeight: 800 }}>Find your perfect stay</h2>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label className="fw-bold">Destination</Form.Label>
                <Form.Control type="text" placeholder="Mumbai, Goa, Delhi..." value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} required />
              </Col>
              <Col md={4}>
                <Form.Label className="fw-bold">Check-In Date</Form.Label>
                <Form.Control type="date" value={formData.checkin} onChange={(e) => setFormData({...formData, checkin: e.target.value})} required />
              </Col>
              <Col md={4}>
                <Form.Label className="fw-bold">Check-Out Date</Form.Label>
                <Form.Control type="date" value={formData.checkout} onChange={(e) => setFormData({...formData, checkout: e.target.value})} required />
              </Col>
              <Col md={4}>
                <Form.Label className="fw-bold">Guests</Form.Label>
                <Form.Select value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})}>
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label className="fw-bold">Room Type</Form.Label>
                <Form.Select value={formData.roomType} onChange={(e) => setFormData({...formData, roomType: e.target.value})}>
                  <option>Standard Room</option>
                  <option>Deluxe Room</option>
                  <option>Luxury Suite</option>
                </Form.Select>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button variant="primary" type="submit" className="w-100 py-2" disabled={isLoading}>
                  {isLoading ? 'Searching...' : '🔍 Find hotels'}
                </Button>
              </Col>
            </Row>
            {msg && <div className="mt-3 text-center text-primary fw-bold">{msg}</div>}
          </Form>
        </Container>
      </section>
    </div>
  );
};

export default Hotels;
