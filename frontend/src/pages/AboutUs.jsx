import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import '../styles/about_us.css';

// Import images (assuming they are in assets/images)
import tflogo from '../assets/images/tflogo.png';
import travel from '../assets/images/travel.jpg';
import iiitLucknow from '../assets/images/IIIT-Lucknow.jpg';
import advait from '../assets/images/Advait.jpeg';
import ranveer from '../assets/images/ranveer.jpeg';
import pruthviraj from '../assets/images/pruthviraj.jpeg';
import ayan from '../assets/images/ayan.jpeg';
import arijeet from '../assets/images/arijeet.jpeg';
import ketan from '../assets/images/ketan.jpeg';
import krish from '../assets/images/krish.jpeg';
import suryansh from '../assets/images/suryansh.jpeg';
import piyush from '../assets/images/piyush.jpeg';
import rishab from '../assets/images/rishab.jpeg';

const AboutUs = () => {
  const team = [
    { name: 'Ranveer Hajari', role: 'Beed, Maharashtra • IIIT Lucknow', desc: 'Idea & design specialist. Enjoys gaming and movies.', img: ranveer },
    { name: 'Pruthviraj Mane', role: 'Nanded, Maharashtra • IIIT Lucknow', desc: 'Creative contributor — front-end and UI work.', img: pruthviraj },
    { name: 'Ayan Saha', role: 'Durgapur, West Bengal • IIIT Lucknow', desc: 'Developer & integrator — loves travel and food.', img: ayan },
    { name: 'Arijeet Mukherjee', role: 'Indore, Madhya Pradesh • IIIT Lucknow', desc: 'Provides insights that guide product choices and helps in design.', img: arijeet },
    { name: 'Ketan Mishra', role: 'Lucknow, Uttar Pradesh • IIIT Lucknow', desc: 'Ensures smooth workflows and helps in creation of forms.', img: ketan },
    { name: 'Krrish Dixit', role: 'Lucknow, Uttar Pradesh • IIIT Lucknow', desc: 'Key member of our team who helps in coding and support.', img: krish },
    { name: 'Suryansh Kumar Singh', role: 'Lucknow, Uttar Pradesh • IIIT Lucknow', desc: 'JavaScript expert.', img: suryansh },
    { name: 'Piyush Singh', role: 'Prayagraj, Uttar Pradesh • IIIT Lucknow', desc: 'Helps in designing web pages.', img: piyush },
    { name: 'Rishab Shaukya', role: 'Ujjain, Rajasthan • IIIT Lucknow', desc: 'Fosters a positive team environment and always helps with debugging.', img: rishab },
  ];

  return (
    <div className="about-us-page">
      <section className="hero py-5">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <h1 style={{ fontWeight: 800 }}>We build delightful booking experiences — all in one place.</h1>
              <p className="lead mt-3">
                Taskforce 404 is a passionate web team from IIIT Lucknow focused on clean design,
                intuitive UX and fast, reliable web apps.
              </p>
              <div className="mt-4 d-flex gap-3 flex-wrap">
                <a href="#team" className="btn btn-primary">Meet the Team</a>
                <Badge bg="light" text="dark" className="p-2 border">
                  <i className="fa-solid fa-graduation-cap me-2"></i> IIIT Lucknow
                </Badge>
              </div>
              <div className="hero-card mt-4 p-3 border rounded shadow-sm bg-white">
                <div className="d-flex align-items-center gap-3">
                  <img src={tflogo} alt="TF Logo" style={{ height: '70px', width: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <strong>Founded</strong>
                    <div className="text-muted">November 2025</div>
                  </div>
                  <div className="ms-auto text-end text-muted d-none d-sm-block">
                    <div><strong>Focus</strong></div>
                    <div>Web Development • UX</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <Card className="hero-card border-0 shadow-sm overflow-hidden">
                <Card.Img variant="top" src={travel} style={{ height: '260px', objectFit: 'cover' }} />
                <Card.Body>
                  <h5>One-stop travel & entertainment</h5>
                  <p className="text-muted">Compare prices, book tickets and manage your trips from a single dashboard.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="college py-5 bg-light">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="college-card p-4">
                <h3 className="text-primary mb-3" style={{ fontWeight: 800 }}>About IIIT Lucknow</h3>
                <p className="text-muted">
                  IIIT Lucknow is a premier institute focused on information technology education and research. 
                  Our campus encourages innovation, collaboration and practical learning.
                </p>
                <ul className="text-muted">
                  <li>Strong emphasis on practical projects</li>
                  <li>Collaborative labs and mentorship</li>
                  <li>Active student clubs</li>
                </ul>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img src={iiitLucknow} alt="IIIT Lucknow" className="img-fluid rounded shadow" />
            </Col>
          </Row>
        </Container>
      </section>

      <section id="team" className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="text-primary" style={{ fontWeight: 800 }}>Meet the Team</h2>
            <p className="text-muted">A product-minded team from IIIT Lucknow.</p>
          </div>

          <Row className="justify-content-center mb-5">
            <Col md={6} lg={4}>
              <Card className="h-100 text-center shadow-sm">
                <Card.Img variant="top" src={advait} className="mx-auto mt-3 rounded-circle" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>Advait Deshpande <Badge bg="warning" text="dark">Leader</Badge></Card.Title>
                  <p className="small text-muted">Sambhajinagar, Maharashtra • IIIT Lucknow</p>
                  <p className="text-muted">Visionary leader who coordinates design & delivery.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            {team.map((member, index) => (
              <Col key={index} xs={12} md={4}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img variant="top" src={member.img} style={{ height: '250px', objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title>{member.name}</Card.Title>
                    <p className="small text-muted mb-2">{member.role}</p>
                    <Card.Text className="text-muted small">{member.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
