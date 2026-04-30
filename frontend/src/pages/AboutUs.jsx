import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import '../styles/about_us.css';

import tflogo      from '../assets/images/tflogo.png';
import travel      from '../assets/images/travel.jpg';
import iiitLucknow from '../assets/images/IIIT-Lucknow.jpg';
import advait      from '../assets/images/Advait.jpeg';
import ranveer     from '../assets/images/ranveer.jpeg';
import pruthviraj  from '../assets/images/pruthviraj.jpeg';
import ayan        from '../assets/images/ayan.jpeg';
import arijeet     from '../assets/images/arijeet.jpeg';
import ketan       from '../assets/images/ketan.jpeg';
import krish       from '../assets/images/krish.jpeg';
import suryansh    from '../assets/images/suryansh.jpeg';
import piyush      from '../assets/images/piyush.jpeg';
import rishab      from '../assets/images/rishab.jpeg';

const team = [
  {
    name: 'Ranveer Hajari',
    role: 'Frontend Developer',
    location: 'Beed, Maharashtra',
    desc: 'Idea & design specialist. Enjoys gaming and movies.',
    img: ranveer,
  },
  {
    name: 'Pruthviraj Mane',
    role: 'UI Developer',
    location: 'Nanded, Maharashtra',
    desc: 'Creative contributor focused on front-end and UI work.',
    img: pruthviraj,
  },
  {
    name: 'Ayan Saha',
    role: 'Full-Stack Developer',
    location: 'Durgapur, West Bengal',
    desc: 'Developer & integrator — loves travel and food.',
    img: ayan,
  },
  {
    name: 'Arijeet Mukherjee',
    role: 'Product & Design',
    location: 'Indore, Madhya Pradesh',
    desc: 'Provides insights that guide product choices and helps in design.',
    img: arijeet,
  },
  {
    name: 'Ketan Mishra',
    role: 'Backend Developer',
    location: 'Lucknow, Uttar Pradesh',
    desc: 'Ensures smooth workflows and helps in creation of forms.',
    img: ketan,
  },
  {
    name: 'Krrish Dixit',
    role: 'Developer',
    location: 'Lucknow, Uttar Pradesh',
    desc: 'Key member of our team who helps in coding and support.',
    img: krish,
  },
  {
    name: 'Suryansh Kumar Singh',
    role: 'JavaScript Engineer',
    location: 'Lucknow, Uttar Pradesh',
    desc: 'JavaScript expert with a knack for clean, performant code.',
    img: suryansh,
  },
  {
    name: 'Piyush Singh',
    role: 'UI/UX Designer',
    location: 'Prayagraj, Uttar Pradesh',
    desc: 'Helps in designing and prototyping web pages.',
    img: piyush,
  },
  {
    name: 'Rishab Shaukya',
    role: 'QA & Debugging',
    location: 'Ujjain, Rajasthan',
    desc: 'Fosters a positive team environment and always helps with debugging.',
    img: rishab,
  },
];

const AboutUs = () => {
  return (
    <div className="about-us-page">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero py-5">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <h1 style={{ fontWeight: 800 }}>
                We build delightful booking experiences — all in one place.
              </h1>
              <p className="lead mt-3" style={{ color: 'var(--clr-muted)' }}>
                Taskforce 404 is a passionate web team from IIIT Lucknow focused on clean design, intuitive UX and fast, reliable web apps. We believe in crafting digital experiences that are not only visually stunning but also highly performant and accessible to everyone. From seamless booking workflows to robust scalable architectures, we pour our expertise into every line of code to make travel and entertainment as effortless as a single click.
              </p>
              <div className="mt-4 d-flex gap-3 flex-wrap align-items-center">
                <a href="#team" className="btn btn-primary px-4 rounded-pill">Meet the Team</a>
                <Badge bg="light" text="dark" className="p-2 border fw-semibold">
                  <i className="fa-solid fa-graduation-cap me-2"></i>IIIT Lucknow
                </Badge>
              </div>

              {/* Founded card */}
              <div className="hero-card mt-4 p-3 border rounded-3 shadow-sm bg-white">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={tflogo}
                    alt="Taskforce 404 Logo"
                    width="60"
                    height="60"
                    style={{ borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <strong>Founded</strong>
                    <div className="text-muted small">November 2025</div>
                  </div>
                  <div className="ms-auto text-end text-muted d-none d-sm-block small">
                    <div><strong>Focus</strong></div>
                    <div>Web Development • UX</div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="team-photo-frame-rect">
                  <img src={travel} alt="Travel experience" />
                </div>
                <Card.Body>
                  <h5 className="fw-bold mb-1">One-stop travel &amp; entertainment</h5>
                  <p className="text-muted small mb-0">
                    Compare prices, book tickets and manage your trips from a single dashboard.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Leader Card ───────────────────────────────────── */}
      <section id="team" className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 800, color: 'var(--clr-primary)' }}>Meet the Team</h2>
            <p className="text-muted">A product-minded team from IIIT Lucknow.</p>
          </div>

          {/* Leader */}
          <Row className="justify-content-center mb-5">
            <Col xs={12} sm={8} md={5} lg={4}>
              <Card
                className="text-center shadow-sm border-0"
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08) !important',
                  padding: '24px',
                }}
              >
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src={advait}
                    alt="Advait Deshpande — Team Leader"
                    className="team-avatar"
                  />
                </div>
                <Card.Body className="p-0">
                  <Card.Title className="fw-bold mb-1">
                    Advait Deshpande{' '}
                    <Badge bg="warning" text="dark" className="ms-1">Leader</Badge>
                  </Card.Title>
                  <p className="small text-muted mb-1 fw-semibold">Team Leader</p>
                  <p className="small text-muted mb-0">Visionary leader who coordinates design &amp; delivery for the whole team.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Team grid — 3 on desktop, 2 on tablet, 1 on mobile */}
          <Row className="g-4">
            {team.map((member, index) => (
              <Col key={index} xs={12} sm={6} md={4}>
                <Card
                  className="h-100 shadow-sm text-center"
                  style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.11)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="d-flex justify-content-center mb-3">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="team-avatar"
                    />
                  </div>
                  <Card.Body className="p-0">
                    <Card.Title className="fw-bold mb-1" style={{ fontSize: '1rem' }}>
                      {member.name}
                    </Card.Title>
                    <p className="small fw-semibold mb-1" style={{ color: 'var(--clr-primary)' }}>
                      {member.role}
                    </p>
                    <p className="small text-muted mb-2" style={{ fontSize: '0.8rem' }}>
                      <i className="fa-solid fa-location-dot me-1"></i>
                      {member.location}
                    </p>
                    <Card.Text className="text-muted small mb-0" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {member.desc}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Our Mission ───────────────────────────────────── */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <span
                className="badge rounded-pill mb-3 px-3 py-2"
                style={{ background: '#FFF0E5', color: '#FF6B00', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em' }}
              >
                OUR MISSION
              </span>
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.8rem' }}>
                Simplify the way you travel &amp; experience the world
              </h2>
              <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>
                {/* TODO: replace with real copy */}
                At Bookzy, we believe planning your next adventure should be effortless. Our mission is to bring together every booking need — trains, flights, buses, hotels, and entertainment — under one beautifully designed, easy-to-use platform.
              </p>
              <p className="text-muted mb-0" style={{ lineHeight: 1.8 }}>
                {/* TODO: replace with real copy */}
                We started as a student project at IIIT Lucknow, driven by the frustration of juggling multiple apps for a single trip. Today, Bookzy is our answer to that problem — and we're just getting started.
              </p>
              <div className="mt-4 d-flex gap-4 flex-wrap">
                <div>
                  <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--clr-primary)' }}>10+</div>
                  <div className="text-muted small">Team Members</div>
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '1.5rem', color: 'var(--clr-accent)' }}>5</div>
                  <div className="text-muted small">Booking Categories</div>
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#22c55e' }}>IIIT</div>
                  <div className="text-muted small">Lucknow</div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <img
                src={iiitLucknow}
                alt="IIIT Lucknow campus"
                className="img-fluid rounded-3 shadow"
                width="100%"
                style={{ maxHeight: '360px', objectFit: 'cover', display: 'block' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
};

export default AboutUs;
