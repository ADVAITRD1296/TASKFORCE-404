import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import '../styles/offers.css';

const Offers = () => {
  const offers = [
    { id: 1, title: 'Summer Splash', desc: 'Get 20% off on all hotel bookings this summer.', code: 'SUMMER20', badge: 'Popular' },
    { id: 2, title: 'Flight Frenzy', desc: 'Flat ₹1000 off on international flights.', code: 'FLYHIGH', badge: 'Limited Time' },
    { id: 3, title: 'Movie Night', desc: 'Buy 1 Get 1 free on movie tickets for Weekend shows.', code: 'BOGO', badge: 'Weekend Special' },
    { id: 4, title: 'Student Discount', desc: 'Extra 10% off for students with valid ID.', code: 'STUDENT10', badge: 'Ongoing' }
  ];

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ fontWeight: 800 }}>Special Offers</h1>
      <Row className="g-4">
        {offers.map(o => (
          <Col md={6} key={o.id}>
            <Card className="h-100 border-0 shadow-sm p-4">
              <div className="d-flex justify-content-between mb-3">
                <Badge bg="warning" text="dark">{o.badge}</Badge>
                <h5 className="text-primary fw-bold">{o.code}</h5>
              </div>
              <h4>{o.title}</h4>
              <p className="text-muted">{o.desc}</p>
              <Button variant="outline-primary" className="mt-auto">Copy Code</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Offers;
