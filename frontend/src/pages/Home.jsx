import React, { useState } from 'react';
import { Carousel, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import imagebookzy from '../assets/images/imagebookzy.png';
import rajasthanImg from '../assets/images/rajasthan_new.jpg';
import '../styles/homeCss.css';

/* Hero carousel slides — high-quality Unsplash travel images */
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=85',
    label: 'DESTINATIONS',
    title: 'Explore the World',
    sub: 'Discover breathtaking destinations across every continent.',
    cta: { label: '✈ Book a Flight', to: '/travel/flights' },
  },
  {
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=85',
    label: 'LUXURY STAYS',
    title: 'Unwind in Style',
    sub: 'Curated hotels from cosy retreats to 5-star resorts.',
    cta: { label: '🏨 Browse Hotels', to: '/hotels' },
  },
  {
    img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1400&q=85',
    label: 'TRAIN TRAVEL',
    title: 'Journey Across India',
    sub: 'Book train tickets instantly for any route in India.',
    cta: { label: '🚂 Book Trains', to: '/travel/trains' },
  },
  {
    img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1400&q=85',
    label: 'ENTERTAINMENT',
    title: 'Catch Every Show',
    sub: 'Movies, live events and theatre — all in one click.',
    cta: { label: '🎬 Browse Shows', to: '/shows' },
  },
];

/* Trust / feature badges */
const FEATURES = [
  { icon: 'fa-shield-halved', color: '#22c55e', bg: '#E6F9EE', title: 'Secure Payments',     desc: '100% safe transactions with bank-level encryption.' },
  { icon: 'fa-headset',       color: '#1A73E8', bg: '#E8F1FF', title: '24/7 Support',         desc: 'Expert help available round the clock, every day.' },
  { icon: 'fa-rotate-left',   color: '#f59e0b', bg: '#FFF8E5', title: 'Easy Cancellations',  desc: 'Flexible refund policies on most bookings.' },
  { icon: 'fa-tag',           color: '#FF6B00', bg: '#FFF0E5', title: 'Best Price Guarantee', desc: 'We match or beat any price you find elsewhere.' },
];

/* Popular destinations */
const DESTINATIONS = [
  { name: 'Goa',       img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',  tag: 'Beach Escape' },
  { name: 'Manali',    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',  tag: 'Mountain Getaway' },
  { name: 'Rajasthan', img: rajasthanImg,  tag: 'Heritage & Culture' },
  { name: 'Kerala',    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',  tag: 'Backwater Bliss' },
];

const Home = () => {
  return (
    <div className="home-page pb-5">

      {/* ── Cinematic Carousel Hero ───────────────────── */}
      <div style={{ position: 'relative' }}>
        <Carousel
          fade
          indicators
          interval={2500}
          pause="hover"
          className="bookzy-carousel"
          style={{ borderRadius: 0 }}
        >
          {SLIDES.map((slide, i) => (
            <Carousel.Item key={i}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(320px, 55vh, 520px)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.72) 100%)',
                  }}
                />
                {/* caption */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(24px,4vw,56px)',
                    color: '#fff',
                    animation: 'caption-rise 0.65s ease 0.15s both',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.75)',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    {slide.label}
                  </span>
                  <h2
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                      fontWeight: 800,
                      marginBottom: '8px',
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 16px rgba(0,0,0,0.3)',
                      color: '#ffffff',
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', opacity: 0.88, marginBottom: '20px', maxWidth: '480px', color: '#ffffff' }}>
                    {slide.sub}
                  </p>
                  <Link
                    to={slide.cta.to}
                    style={{
                      display: 'inline-block',
                      padding: '12px 28px',
                      background: '#FF6B00',
                      color: '#fff',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(255,107,0,0.4)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* ── Stats Banner ─────────────────────────────── */}
      <div style={{ background: '#FF6B00' }}>
        <Container style={{ maxWidth: '1200px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              textAlign: 'center',
              padding: '20px 0',
              gap: '8px',
            }}
          >
            {[
              { num: '2M+',  label: 'Happy Travellers' },
              { num: '500+', label: 'Destinations' },
              { num: '50K+', label: 'Hotels Listed' },
              { num: '4.8★', label: 'Average Rating' },
            ].map(({ num, label }) => (
              <div key={label} style={{ padding: '8px' }}>
                <div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {num}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.82)', marginTop: '4px', fontWeight: 600 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Quick Booking Shortcuts ───────────────────── */}
      <Container style={{ maxWidth: '1200px', padding: '48px 24px 32px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)' }}>
            Where would you like to <span className="text-gradient">go?</span>
          </h2>
          <p className="text-muted mt-2">Choose a category and book your next experience in seconds.</p>
        </div>
        <Row className="g-3 justify-content-center">
          {[
            { to: '/travel/flights', icon: 'fa-plane',       label: 'Flights', color: '#1A73E8', bg: '#E8F1FF',  sub: 'Cheapest fares daily' },
            { to: '/travel/trains',  icon: 'fa-train',       label: 'Trains',  color: '#7B2FBE', bg: '#F3E8FF',  sub: 'Book any route instantly' },
            { to: '/travel/buses',   icon: 'fa-bus',         label: 'Buses',   color: '#059669', bg: '#E6F9EE',  sub: 'AC & sleeper options' },
            { to: '/hotels',         icon: 'fa-hotel',       label: 'Hotels',  color: '#FF6B00', bg: '#FFF0E5',  sub: '5-star to budget stays' },
            { to: '/shows',          icon: 'fa-ticket',      label: 'Shows',   color: '#dc2626', bg: '#FEE2E2',  sub: 'Movies, events & more' },
          ].map(({ to, icon, label, color, bg, sub }) => (
            <Col xs={6} sm={4} md={2} key={to}>
              <Link
                to={to}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '20px 12px',
                  borderRadius: '16px',
                  background: '#fff',
                  border: '1px solid #E8ECF2',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className={`fa-solid ${icon}`} style={{ fontSize: '20px', color }}></i>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '14px' }}>{label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px' }}>{sub}</div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ── Popular Destinations ─────────────────────── */}
      <div style={{ background: '#F5F7FA', padding: '48px 0' }}>
        <Container style={{ maxWidth: '1200px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1" style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)' }}>
                Popular <span className="text-gradient">Destinations</span>
              </h2>
              <p className="text-muted small mb-0">Hand-picked getaways loved by millions of travellers.</p>
            </div>
            <Link to="/hotels" style={{ fontSize: '13px', fontWeight: 600, color: '#FF6B00', textDecoration: 'none' }}>
              View all destinations →
            </Link>
          </div>
          <Row className="g-4">
            {DESTINATIONS.map(({ name, img, tag }) => (
              <Col key={name} xs={12} sm={6} md={3}>
                <Link
                  to="/hotels"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      height: '220px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                      transition: 'transform 0.25s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <img
                      src={img}
                      alt={name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)',
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '16px 18px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
                        {tag}
                      </div>
                      <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', fontFamily: "'Poppins',sans-serif" }}>
                        {name}
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ── About Bookzy ─────────────────────────────── */}
      <Container style={{ maxWidth: '1200px', padding: '48px 24px' }}>
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
              ABOUT BOOKZY
            </span>
            <h2 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)' }}>
              One platform for every journey
            </h2>
            <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>
              {/* TODO: replace with real copy */}
              Bookzy is your all-in-one travel companion — built by students at IIIT Lucknow to make booking simpler, faster, and more enjoyable. No more juggling between five different apps.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>
              {/* TODO: replace with real copy */}
              Whether it's a last-minute flight, a weekend hotel, or tickets to your favourite band — Bookzy has you covered.
            </p>
            <Button as={Link} to="/about" variant="primary" className="rounded-pill" style={{ padding: '12px 28px' }}>
              Our Story →
            </Button>
          </Col>
          <Col lg={6} className="text-center">
            <img
              src={imagebookzy}
              alt="Bookzy app illustration showing multiple booking categories"
              className="img-fluid"
              style={{ maxWidth: '420px', width: '100%' }}
            />
          </Col>
        </Row>
      </Container>

      {/* ── Why Choose Bookzy ────────────────────────── */}
      <div style={{ background: '#F5F7FA', padding: '48px 0' }}>
        <Container style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)' }}>
              Why <span className="text-gradient">Bookzy</span>?
            </h2>
            <p className="text-muted mt-2">Built with travellers in mind — from first click to final destination.</p>
          </div>
          <Row className="g-4">
            {FEATURES.map(({ icon, color, bg, title, desc }) => (
              <Col key={title} xs={12} sm={6} md={3}>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '28px 24px',
                    height: '100%',
                    border: '1px solid #E8ECF2',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <i className={`fa-solid ${icon}`} style={{ fontSize: '22px', color }}></i>
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>{title}</h5>
                  <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: 0, lineHeight: 1.65 }}>{desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ── Testimonials ─────────────────────────────── */}
      <Container style={{ maxWidth: '1200px', padding: '48px 24px' }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)' }}>
            What our travellers <span className="text-gradient">say</span>
          </h2>
        </div>
        <Row className="g-4">
          {[
            { name: 'Neha S.', city: 'Mumbai', stars: 5, text: 'Booked a last-minute flight to Goa in under 2 minutes. The UI is so clean and fast!' },
            { name: 'Arjun P.', city: 'Delhi',  stars: 5, text: 'Finally an app that covers trains AND movies. Used it for a full trip — highly recommend.' },
            { name: 'Priya K.', city: 'Bengaluru', stars: 4, text: 'Hotel search is brilliant. Found a great deal in Manali that I couldn\'t find elsewhere.' },
          ].map(({ name, city, stars, text }) => (
            <Col key={name} md={4}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #E8ECF2',
                  borderRadius: '16px',
                  padding: '24px',
                  height: '100%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '12px' }}>
                  {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                </div>
                <p style={{ fontSize: '0.92rem', color: '#444', lineHeight: 1.7, marginBottom: '16px' }}>
                  "{text}"
                </p>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A1A' }}>{name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{city}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

    </div>
  );
};

export default Home;
