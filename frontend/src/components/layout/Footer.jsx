import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { label: 'Home',    to: '/' },
    { label: 'Hotels',  to: '/hotels' },
    { label: 'Flights', to: '/travel/flights' },
    { label: 'Trains',  to: '/travel/trains' },
    { label: 'Buses',   to: '/travel/buses' },
  ];

  const exploreLinks = [
    { label: 'Shows & Cinema', to: '/shows' },
    { label: 'About Us',       to: '/about' },
  ];

  const linkStyle = {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.88rem',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    display: 'inline-block',
  };

  const headingStyle = {
    color: '#ffffff',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    marginBottom: '1rem',
  };

  return (
    <footer
      style={{
        background: '#1A1A1A',
        color: 'rgba(255,255,255,0.75)',
        paddingTop: '48px',
        paddingBottom: '24px',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        marginTop: '64px',
      }}
    >
      <Container>
        <Row className="g-5 mb-4">

          {/* ── Column 1: Brand ── */}
          <Col md={4} lg={4}>
            <h5 style={{ color: '#FF6B00', fontWeight: 800, fontSize: '1.3rem', marginBottom: '12px' }}>
              BOOKZY
            </h5>
            <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: '0.88rem', lineHeight: 1.75, maxWidth: '280px' }}>
              {/* TODO: replace with real copy */}
              Your all-in-one platform for flights, trains, hotels, and entertainment. Built with ❤️ by Taskforce 404 at IIIT Lucknow.
            </p>
            {/* Social icons */}
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '20px', marginBottom: '10px' }}>
              Follow Us
            </p>
            <div className="d-flex gap-2">
              <a
                href="https://www.instagram.com/taskforce_404/"
                target="_blank"
                rel="noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://github.com/ADVAITRD1296/TASKFORCE-404.git"
                target="_blank"
                rel="noreferrer"
                className="social-icon"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a
                href="#"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a
                href="#"
                className="social-icon"
                aria-label="Twitter / X"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </Col>

          {/* ── Column 2: Quick Links ── */}
          <Col md={2} lg={2}>
            <h6 style={headingStyle}>Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* ── Column 3: Explore ── */}
          <Col md={2} lg={2}>
            <h6 style={headingStyle}>Explore</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {exploreLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.65)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* ── Column 4: Contact ── */}
          <Col md={4} lg={4}>
            <h6 style={headingStyle}>Get In Touch</h6>
            <div className="d-flex flex-column gap-3">
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                <i className="fa-solid fa-phone me-2" style={{ color: 'rgba(255,255,255,0.35)', width: '16px' }}></i>
                +91 12345 67890
              </p>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                <i className="fa-solid fa-envelope me-2" style={{ color: 'rgba(255,255,255,0.35)', width: '16px' }}></i>
                <a
                  href="mailto:taskforce404@gmail.com"
                  style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.65)')}
                >
                  taskforce404@gmail.com
                </a>
              </p>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                <i className="fa-solid fa-location-dot me-2" style={{ color: 'rgba(255,255,255,0.35)', width: '16px' }}></i>
                IIIT Lucknow, Uttar Pradesh, India
              </p>
            </div>
          </Col>

        </Row>

        {/* Copyright */}
        <div
          className="border-top text-center"
          style={{
            borderColor: 'rgba(255,255,255,0.08) !important',
            paddingTop: '24px',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.80rem',
          }}
        >
          © {new Date().getFullYear()} Bookzy by Taskforce 404&nbsp;•&nbsp;All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
