import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="mt-5">
      <Container>
        <Row className="g-5 mb-5">
          {/* Brand */}
          <Col md={4}>
            <h5 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '1.25rem' }}>BOOKZY</h5>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Your all-in-one platform for flights, trains, hotels, and entertainment. Built with ❤️ by Taskforce 404 at IIIT Lucknow.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={3}>
            <h5 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Quick Links
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Hotels', to: '/hotels' },
                { label: 'Flights', to: '/travel/flights' },
                { label: 'Trains', to: '/travel/trains' },
                { label: 'Shows', to: '/shows' },
                { label: 'Offers', to: '/offers' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Contact */}
          <Col md={5}>
            <h5 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Get In Touch
            </h5>
            <div className="d-flex flex-column gap-2 mb-4">
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                <i className="fa-solid fa-phone me-2" style={{ color: 'rgba(255,255,255,0.4)' }}></i>
                +91 12345 67890
              </p>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                <i className="fa-solid fa-envelope me-2" style={{ color: 'rgba(255,255,255,0.4)' }}></i>
                <a href="mailto:taskforce404@gmail.com" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  taskforce404@gmail.com
                </a>
              </p>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
              Follow Us
            </p>
            <div className="d-flex gap-2">
              <a href="https://www.instagram.com/taskforce_404/" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://github.com/ADVAITRD1296/TASKFORCE-404.git" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>

        <div className="border-top pt-5 text-center" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
          © 2025 Taskforce 404 — Designed by the Team &nbsp;•&nbsp; All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
