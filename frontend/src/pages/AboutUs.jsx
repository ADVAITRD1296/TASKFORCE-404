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

const AboutUs = () => {
  // pos = per-photo object-position override (only for photos where face is cut off)
  const team = [
    { name: 'Ranveer Hajari',       role: 'Beed, Maharashtra • IIIT Lucknow',      desc: 'Idea & design specialist. Enjoys gaming and movies.',                   img: ranveer,    pos: 'center 30%' },
    { name: 'Pruthviraj Mane',      role: 'Nanded, Maharashtra • IIIT Lucknow',     desc: 'Creative contributor — front-end and UI work.',                         img: pruthviraj                    },
    { name: 'Ayan Saha',            role: 'Durgapur, West Bengal • IIIT Lucknow',   desc: 'Developer & integrator — loves travel and food.',                       img: ayan                          },
    { name: 'Arijeet Mukherjee',    role: 'Indore, Madhya Pradesh • IIIT Lucknow',  desc: 'Provides insights that guide product choices and helps in design.',     img: arijeet                       },
    { name: 'Ketan Mishra',         role: 'Lucknow, Uttar Pradesh • IIIT Lucknow',  desc: 'Ensures smooth workflows and helps in creation of forms.',              img: ketan,      pos: 'center 30%' },
    { name: 'Krrish Dixit',         role: 'Lucknow, Uttar Pradesh • IIIT Lucknow',  desc: 'Key member of our team who helps in coding and support.',               img: krish                         },
    { name: 'Suryansh Kumar Singh', role: 'Lucknow, Uttar Pradesh • IIIT Lucknow',  desc: 'JavaScript expert.',                                                   img: suryansh,   pos: 'center 35%' },
    { name: 'Piyush Singh',         role: 'Prayagraj, Uttar Pradesh • IIIT Lucknow', desc: 'Helps in designing web pages.',                                        img: piyush                        },
    { name: 'Rishab Shaukya',       role: 'Ujjain, Rajasthan • IIIT Lucknow',       desc: 'Fosters a positive team environment and always helps with debugging.', img: rishab,     pos: 'center 30%' },
  ];

  return (
    <div className="about-us-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero py-5">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={7}>
              <h1 style={{ fontWeight: 800 }}>
                We build delightful booking experiences — all in one place.
              </h1>
              <p className="lead mt-3" style={{ color: 'var(--clr-muted)' }}>
                Taskforce 404 is a passionate web team from IIIT Lucknow focused on
                clean design, intuitive UX and fast, reliable web apps.
              </p>
              <div className="mt-4 d-flex gap-3 flex-wrap align-items-center">
                <a href="#team" className="btn btn-primary px-4">Meet the Team</a>
                <Badge bg="light" text="dark" className="p-2 border fw-semibold">
                  <i className="fa-solid fa-graduation-cap me-2"></i>IIIT Lucknow
                </Badge>
              </div>
              <div className="hero-card mt-4 p-3 border rounded-3 shadow-sm bg-white">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={tflogo}
                    alt="TF Logo"
                    style={{ height: '60px', width: '60px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
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
                <div className="team-photo-frame">
                  <img src={travel} alt="Travel" />
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

      {/* ── College ───────────────────────────────────────────── */}
      <section className="college py-5 bg-light">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="college-card">
                <h3 className="mb-3" style={{ fontWeight: 800, color: 'var(--clr-primary)' }}>
                  About IIIT Lucknow
                </h3>
                <p className="text-muted">
                  IIIT Lucknow is a premier institute focused on information technology
                  education and research. Our campus encourages innovation, collaboration
                  and practical learning.
                </p>
                <ul className="text-muted">
                  <li>Strong emphasis on practical projects</li>
                  <li>Collaborative labs and mentorship</li>
                  <li>Active student clubs</li>
                </ul>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src={iiitLucknow}
                alt="IIIT Lucknow"
                className="img-fluid rounded-3 shadow"
                style={{ maxHeight: '320px', width: '100%', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Team ─────────────────────────────────────────────── */}
      <section id="team" className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 800, color: 'var(--clr-primary)' }}>Meet the Team</h2>
            <p className="text-muted">A product-minded team from IIIT Lucknow.</p>
          </div>

          {/* Leader card — rectangular, not oval */}
          <Row className="justify-content-center mb-5">
            <Col xs={12} sm={8} md={5} lg={4}>
              <Card className="text-center shadow-sm border-0 leader-card">
                {/* Wrapper div controls the image, not Card.Img */}
                <div className="team-photo-frame leader-frame">
                  <img src={advait} alt="Advait Deshpande" />
                </div>
                <Card.Body className="pt-4">
                  <Card.Title className="fw-bold mb-1">
                    Advait Deshpande{' '}
                    <Badge bg="warning" text="dark" className="ms-1">Leader</Badge>
                  </Card.Title>
                  <p className="small text-muted mb-2">Sambhajinagar, Maharashtra • IIIT Lucknow</p>
                  <p className="text-muted small mb-0">Visionary leader who coordinates design &amp; delivery.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Team grid */}
          <Row className="g-4">
            {team.map((member, index) => (
              <Col key={index} xs={12} sm={6} md={4}>
                <Card className="h-100 shadow-sm border-0 team-member-card">
                  <div className="team-photo-frame">
                    <img src={member.img} alt={member.name} style={member.pos ? { objectPosition: member.pos } : undefined} />
                  </div>
                  <Card.Body className="pt-3">
                    <Card.Title className="fw-bold mb-1" style={{ fontSize: '1rem' }}>
                      {member.name}
                    </Card.Title>
                    <p className="small text-muted mb-2">{member.role}</p>
                    <Card.Text className="text-muted small mb-0">{member.desc}</Card.Text>
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
