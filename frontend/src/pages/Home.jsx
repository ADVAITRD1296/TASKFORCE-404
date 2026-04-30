import React from 'react';
import { Carousel, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import imagebookzy from '../assets/images/imagebookzy.png';
import '../styles/homeCss.css';

const Home = () => {
  return (
    <div className="home-page pb-5">
      {/* Hero Section — Compact */}
      <div
        className="position-relative overflow-hidden d-flex align-items-center"
        style={{
          minHeight: '340px',
          maxHeight: '380px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      >
        <div className="hero-dark-overlay"></div>
        <Container className="position-relative text-center py-3" style={{ zIndex: 2 }}>
          <h1 className="fw-black text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', textShadow: '0 2px 8px rgba(0,0,0,0.45)', letterSpacing: '-0.02em' }}>
            Your Journey <span style={{ color: '#FFB347' }}>Starts Here</span>
          </h1>
          <p className="text-white mb-4" style={{ maxWidth: '520px', margin: '0 auto', fontSize: '1rem', opacity: 0.92 }}>
            Book flights, trains, hotels &amp; entertainment — all in one place.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/travel/flights" variant="primary" size="sm" className="rounded-pill px-4 fw-bold">
              ✈ Explore Flights
            </Button>
            <Button
              as={Link} to="/hotels" size="sm" className="rounded-pill px-4 fw-semibold"
              style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.7)', color: '#fff' }}
            >
              🏨 Find Hotels
            </Button>
          </div>
        </Container>
      </div>

      {/* Carousel */}
      <Container fluid className="p-0 mb-4">
        <div className="carousel-container px-md-5 pt-4">
          <Carousel indicators={true} interval={4000} pause="hover" className="rounded-4 shadow overflow-hidden">
            <Carousel.Item>
              <img className="d-block w-100" src={image1} alt="Explore the world" />
              <Carousel.Caption className="bg-glass rounded-3 p-3 text-dark mb-3 mx-3">
                <h3 className="fw-bold fs-5">Explore the World</h3>
                <p className="small mb-0">Discover hidden gems and popular destinations.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={image2} alt="Luxury Stays" />
              <Carousel.Caption className="bg-glass rounded-3 p-3 text-dark mb-3 mx-3">
                <h3 className="fw-bold fs-5">Luxury Stays</h3>
                <p className="small mb-0">Curated hotels for your perfect vacation.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={image3} alt="Seamless Travel" />
              <Carousel.Caption className="bg-glass rounded-3 p-3 text-dark mb-3 mx-3">
                <h3 className="fw-bold fs-5">Seamless Travel</h3>
                <p className="small mb-0">Everything you need for your trip in one place.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </Container>

      {/* Feature Section */}
      <Container className="mycontainer py-4">
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <div className="info-section">
              <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>ABOUT US</span>
              <h2 className="mb-3 fw-bold" style={{ fontSize: '1.8rem' }}>Welcome to <span className="text-gradient">Bookzy</span></h2>
              <p className="text-muted mb-3" style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                Your all-in-one platform designed to simplify the way you travel, explore, and enjoy entertainment.
                At Bookzy, we bring together train, flight, and bus bookings along with hotel reservations, movie
                tickets, and show passes under one seamless system.
              </p>
              <Button as={Link} to="/about" variant="primary" className="rounded-pill px-4">
                Know More About Us
              </Button>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div className="position-relative">
              <img src={imagebookzy} alt="Bookzy Illustration" className="img-fluid" style={{ maxWidth: '420px' }} />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Services Grid */}
      <Container className="py-4 text-center">
        <h3 className="mb-4 fw-bold">Our <span className="text-gradient">Services</span></h3>
        <Row className="g-3">
          <Col md={4}>
            <div className="card h-100 p-4 text-center">
              <div className="icon-box mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '64px', height: '64px', background: '#FFF0E5' }}>
                <i className="fa-solid fa-plane-departure fa-lg text-primary"></i>
              </div>
              <h5 className="fw-bold">Easy Travel</h5>
              <p className="text-muted small mb-0">Book flights, trains, and buses with just a few clicks.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="card h-100 p-4 text-center">
              <div className="icon-box mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '64px', height: '64px', background: '#E8F1FF' }}>
                <i className="fa-solid fa-hotel fa-lg" style={{ color: '#1A73E8' }}></i>
              </div>
              <h5 className="fw-bold">Stay Comfortable</h5>
              <p className="text-muted small mb-0">Find the best hotels at the most affordable prices.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="card h-100 p-4 text-center">
              <div className="icon-box mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '64px', height: '64px', background: '#E6F9EE' }}>
                <i className="fa-solid fa-ticket fa-lg text-success"></i>
              </div>
              <h5 className="fw-bold">Entertainment</h5>
              <p className="text-muted small mb-0">Get tickets for the latest movies and shows instantly.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
