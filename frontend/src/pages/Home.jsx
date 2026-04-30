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
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <h1 className="hero-title">
            Your Journey <span className="text-gradient">Starts Here</span>
          </h1>
          <p className="lead mb-5 text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '1.25rem' }}>
            Book flights, trains, hotels, and entertainment all in one premium platform.
            Experience the future of travel with Bookzy.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/travel/flights" variant="primary" size="lg">
              Explore Flights
            </Button>
            <Button as={Link} to="/hotels" variant="outline-primary" size="lg" className="px-5">
              Find Hotels
            </Button>
          </div>
        </Container>
      </div>

      <Container fluid className="p-0 mb-5">
        <div className="carousel-container px-md-5">
          <Carousel
            indicators={true}
            interval={5000}
            pause="hover"
            fade
            controls={true}
            className="bookzy-carousel rounded-5 shadow-lg"
            prevIcon={<span className="carousel-arrow"><i className="fa-solid fa-chevron-left"></i></span>}
            nextIcon={<span className="carousel-arrow"><i className="fa-solid fa-chevron-right"></i></span>}
          >
            <Carousel.Item>
              <div className="carousel-img-wrap">
                <img className="d-block w-100" src={image1} alt="Explore the world" />
              </div>
              <Carousel.Caption className="carousel-caption-cinematic">
                <p className="carousel-label">✦ Discover</p>
                <h3>Explore the World</h3>
                <p>Discover hidden gems and popular destinations with ease.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <div className="carousel-img-wrap">
                <img className="d-block w-100" src={image2} alt="Luxury Stays" />
              </div>
              <Carousel.Caption className="carousel-caption-cinematic">
                <p className="carousel-label">✦ Stay</p>
                <h3>Luxury Stays</h3>
                <p>Curated hotels for your perfect vacation.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <div className="carousel-img-wrap">
                <img className="d-block w-100" src={image3} alt="Seamless Travel" />
              </div>
              <Carousel.Caption className="carousel-caption-cinematic">
                <p className="carousel-label">✦ Travel</p>
                <h3>Seamless Travel</h3>
                <p>Everything you need for your trip in one place.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </Container>

      {/* Feature Section */}
      <Container className="mycontainer py-5">
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <div className="info-section">
              <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-bold">ABOUT US</span>
              <h2 className="mb-4 display-5 fw-bold">Welcome to <span className="text-gradient">Bookzy</span></h2>
              <p className="description text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Your all-in-one platform designed to simplify the way you travel, explore, and enjoy entertainment.
                At Bookzy, we bring together train, flight, and bus bookings along with hotel reservations, movie
                tickets, and show passes under one seamless system.
              </p>
              <p className="description text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Instead of jumping between multiple apps or websites, Bookzy lets you find everything in a single, 
                user-friendly space. Our goal is to make booking effortless by offering real-time availability, 
                secure payments, transparent pricing, and quick confirmations.
              </p>
              <Button as={Link} to="/about" variant="primary" className="rounded-pill px-4 py-2">
                Know More About Us
              </Button>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div className="position-relative">
                <div className="position-absolute top-50 start-50 translate-middle w-75 h-75 bg-primary opacity-10 blur-3xl rounded-circle"></div>
                <img src={imagebookzy} alt="Bookzy Illustration" className="img-fluid position-relative z-1" style={{ maxWidth: '500px' }} />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Services Grid */}
      <Container className="mt-5 py-5 text-center">
        <h3 className="mb-5 fw-bold">Our <span className="text-gradient">Services</span></h3>
        <Row className="g-4">
            <Col md={4}>
                <div className="card h-100 p-5 text-center">
                    <div className="icon-box mb-4 mx-auto bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        <i className="fa-solid fa-plane-departure fa-2x text-primary"></i>
                    </div>
                    <h4 className="fw-bold">Easy Travel</h4>
                    <p className="text-muted">Book flights, trains, and buses with just a few clicks.</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="card h-100 p-5 text-center">
                    <div className="icon-box mb-4 mx-auto bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        <i className="fa-solid fa-hotel fa-2x text-warning"></i>
                    </div>
                    <h4 className="fw-bold">Stay Comfortable</h4>
                    <p className="text-muted">Find the best hotels at the most affordable prices.</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="card h-100 p-5 text-center">
                    <div className="icon-box mb-4 mx-auto bg-success-subtle rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        <i className="fa-solid fa-ticket fa-2x text-success"></i>
                    </div>
                    <h4 className="fw-bold">Entertainment</h4>
                    <p className="text-muted">Get tickets for the latest movies and shows instantly.</p>
                </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
