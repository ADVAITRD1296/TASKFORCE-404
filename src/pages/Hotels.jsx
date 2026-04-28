import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetHotels, apiSearchHotels, apiBookHotel } from '../services/api';
import { WhatsappShareButton, TwitterShareButton, WhatsappIcon, TwitterIcon } from 'react-share';
import '../styles/homeCss.css';

const Hotels = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    destination: '',
    checkin: '',
    checkout: '',
    guests: '1 Guest',
    roomType: 'Standard Room'
  });
  const [msg, setMsg] = useState({ text: '', color: '' });
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Booking Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [tempBooking, setTempBooking] = useState({
    checkin: '',
    checkout: '',
    guests: '1 Guest'
  });

  const trendingDestinations = [
    { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', hotels: '450+ Hotels' },
    { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800', hotels: '800+ Hotels' },
    { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', hotels: '600+ Hotels' }
  ];

  useEffect(() => {
    loadInitialHotels();
  }, []);

  const loadInitialHotels = async () => {
    try {
      const data = await apiGetHotels();
      setHotels(data);
    } catch (err) {
      console.error('Error loading hotels:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const results = await apiSearchHotels(formData.destination, formData.roomType);
      setHotels(results);
      setMsg({ text: `Found ${results.length} hotels in ${formData.destination}`, color: 'primary' });
    } catch (err) {
      setMsg({ text: 'Search failed. Please try again.', color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = (hotel) => {
    if (!user) {
      setMsg({ text: "Please login to book a hotel", color: 'warning' });
      return;
    }
    setSelectedHotel(hotel);
    setTempBooking({
      checkin: formData.checkin || '',
      checkout: formData.checkout || '',
      guests: formData.guests
    });
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const res = await apiBookHotel(
        selectedHotel.id, 
        tempBooking.checkin || '2024-05-01', 
        tempBooking.checkout || '2024-05-05', 
        tempBooking.guests, 
        selectedHotel.roomType
      );
      setMsg({ text: `Success! Booking ID: ${res.bookingReference}`, color: 'success' });
      setShowModal(false);
      loadInitialHotels();
    } catch (err) {
      setMsg({ text: `Booking failed: ${err.message}`, color: 'danger' });
    }
  };

  return (
    <div className="hotels-page py-5">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Find Your <span className="text-gradient">Perfect Stay</span></h1>
          <p className="text-muted lead">Discover luxury hotels and cozy retreats around the world.</p>
        </div>

        {/* Modern Search Bar */}
        <Card className="border-0 shadow-lg rounded-5 p-4 mb-5 bg-white">
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col lg={3}>
                <Form.Label className="small fw-bold text-uppercase text-muted ms-2">Destination</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Where are you going?" 
                  className="bg-light border-0 py-3"
                  value={formData.destination} 
                  onChange={(e) => setFormData({...formData, destination: e.target.value})} 
                  required 
                />
              </Col>
              <Col lg={2}>
                <Form.Label className="small fw-bold text-uppercase text-muted ms-2">Check-in</Form.Label>
                <Form.Control 
                  type="date" 
                  className="bg-light border-0 py-3"
                  value={formData.checkin} 
                  onChange={(e) => setFormData({...formData, checkin: e.target.value})} 
                />
              </Col>
              <Col lg={2}>
                <Form.Label className="small fw-bold text-uppercase text-muted ms-2">Check-out</Form.Label>
                <Form.Control 
                  type="date" 
                  className="bg-light border-0 py-3"
                  value={formData.checkout} 
                  onChange={(e) => setFormData({...formData, checkout: e.target.value})} 
                />
              </Col>
              <Col lg={2}>
                <Form.Label className="small fw-bold text-uppercase text-muted ms-2">Guests</Form.Label>
                <Form.Select className="bg-light border-0 py-3" value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})}>
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                </Form.Select>
              </Col>
              <Col lg={3} className="d-flex align-items-end">
                <Button variant="primary" type="submit" className="w-100 py-3 rounded-4 fw-bold" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search Hotels'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {msg.text && (
          <div className={`alert alert-${msg.color} rounded-4 shadow-sm mb-5 text-center fw-bold`}>
            {msg.text}
          </div>
        )}

        {/* Trending Destinations */}
        <div className="mb-5">
          <h3 className="fw-bold mb-4">Trending <span className="text-gradient">Destinations</span></h3>
          <Row className="g-4">
            {trendingDestinations.map((dest, i) => (
              <Col md={4} key={i}>
                <div className="position-relative rounded-5 overflow-hidden shadow-sm hover-up" style={{ height: '300px' }}>
                  <img src={dest.img} className="w-100 h-100 object-fit-cover" alt={dest.name} />
                  <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-gradient-dark text-white">
                    <h4 className="fw-bold mb-1">{dest.name}</h4>
                    <span className="small opacity-75">{dest.hotels}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Hotel Grid */}
        <div>
          <h3 className="fw-bold mb-4">Available <span className="text-gradient">Hotels</span></h3>
          <Row className="g-4">
            {hotels.map((hotel) => (
              <Col lg={4} md={6} key={hotel.id}>
                <Card className="h-100 border-0 shadow-sm rounded-5 overflow-hidden hotel-card">
                  <div className="position-relative">
                    <Card.Img variant="top" src={hotel.imageUrl} style={{ height: '240px', objectFit: 'cover' }} />
                    <Badge bg="white" text="dark" className="position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2 shadow-sm">
                      ⭐ {hotel.rating || '4.5'}
                    </Badge>
                  </div>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-1">{hotel.name}</h5>
                    <p className="text-muted small mb-3"><i className="fa-solid fa-location-dot me-2"></i>{hotel.location}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-primary fw-bold h5 mb-0">₹{hotel.pricePerNight}</span>
                        <span className="text-muted small"> / night</span>
                      </div>
                      <div className="d-flex gap-2">
                        <WhatsappShareButton url={window.location.href} title={`Check out ${hotel.name} on Bookzy!`}>
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <Button variant="primary" className="rounded-pill px-4" onClick={() => handleBook(hotel)}>
                          Book
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {hotels.length === 0 && (
              <Col className="text-center py-5 text-muted">No hotels found matching your search.</Col>
            )}
          </Row>
        </div>
      </Container>

      {/* Hotel Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered rounded-5>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Confirm Stay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHotel && (
            <div className="mb-4 p-3 bg-light rounded-4">
              <h6 className="fw-bold mb-1">{selectedHotel.name}</h6>
              <p className="text-muted small mb-0">{selectedHotel.location}</p>
            </div>
          )}
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small fw-bold">Check-in</Form.Label>
                <Form.Control 
                  type="date" 
                  value={tempBooking.checkin} 
                  onChange={(e) => setTempBooking({...tempBooking, checkin: e.target.value})}
                  className="rounded-3"
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small fw-bold">Check-out</Form.Label>
                <Form.Control 
                  type="date" 
                  value={tempBooking.checkout} 
                  onChange={(e) => setTempBooking({...tempBooking, checkout: e.target.value})}
                  className="rounded-3"
                />
              </Col>
              <Col md={12}>
                <Form.Label className="small fw-bold">Guests</Form.Label>
                <Form.Select 
                  value={tempBooking.guests} 
                  onChange={(e) => setTempBooking({...tempBooking, guests: e.target.value})}
                  className="rounded-3"
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4">Cancel</Button>
          <Button variant="primary" onClick={confirmBooking} className="rounded-pill px-4 shadow-sm">Confirm Booking</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Hotels;
