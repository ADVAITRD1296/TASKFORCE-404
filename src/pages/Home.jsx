import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import imagebookzy from '../assets/images/imagebookzy.png';
import '../styles/homeCss.css';

const Home = () => {
  return (
    <div className="home-page">
      <Container fluid className="p-0">
        <div className="carousel-container">
          <Carousel indicators={false} interval={3000} pause={false}>
            <Carousel.Item>
              <img className="d-block w-100" src={image1} alt="First slide" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={image2} alt="Second slide" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={image3} alt="Third slide" />
            </Carousel.Item>
          </Carousel>
        </div>
      </Container>

      <Container className="mycontainer mt-5">
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="info-section">
              <h2 className="mb-4" style={{ fontWeight: 800 }}>Welcome to Bookzy</h2>
              <p className="description" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Your all-in-one platform designed to simplify the way you travel, explore, and enjoy entertainment.
                At Bookzy, we bring together train, flight, and bus bookings along with hotel reservations, movie
                tickets, and show passes under one seamless system.
              </p>
              <p className="description" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                Instead of jumping between multiple apps or websites, Bookzy lets you find everything in a single, 
                user-friendly space. Our goal is to make booking effortless by offering real-time availability, 
                secure payments, transparent pricing, and quick confirmations.
              </p>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <img src={imagebookzy} alt="Bookzy Illustration" className="img-fluid" style={{ maxWidth: '600px' }} />
          </Col>
        </Row>
      </Container>

      <Container className="mt-5 text-center">
        <div className="row g-4">
            <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center">
                    <i className="fa-solid fa-plane-departure fa-3x mb-3 text-primary"></i>
                    <h4>Easy Travel</h4>
                    <p>Book flights, trains, and buses with just a few clicks.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center">
                    <i className="fa-solid fa-hotel fa-3x mb-3 text-primary"></i>
                    <h4>Stay Comfortable</h4>
                    <p>Find the best hotels at the most affordable prices.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4 text-center">
                    <i className="fa-solid fa-ticket fa-3x mb-3 text-primary"></i>
                    <h4>Entertainment</h4>
                    <p>Get tickets for the latest movies and shows instantly.</p>
                </div>
            </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;
