import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetFlights, apiSearchFlights, apiBookFlight } from '../services/api';
import '../styles/homeCss.css';

// Parse ISO datetime OR plain "HH:MM" string → "HH:MM"
const formatTime = (val) => {
  if (!val) return '--:--';
  if (typeof val === 'string' && val.includes('T')) {
    const t = new Date(val);
    if (isNaN(t)) return val.substring(11, 16);
    return t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return String(val).substring(0, 5);
};

// Compute duration between two ISO timestamps, or return a stored duration string
const formatDuration = (dep, arr, stored) => {
  if (stored && typeof stored === 'string' && !stored.includes('T')) return stored;
  if (dep && arr && dep.includes('T') && arr.includes('T')) {
    const d1 = new Date(dep), d2 = new Date(arr);
    if (!isNaN(d1) && !isNaN(d2)) {
      let diff = (d2 - d1) / 60000; // minutes
      if (diff < 0) diff += 1440;   // overnight
      const h = Math.floor(diff / 60), m = diff % 60;
      return `${h}h ${m > 0 ? m + 'm' : ''}`;
    }
  }
  return stored || '--';
};

const formatPrice = (p) => {
  const n = parseFloat(p);
  return isNaN(n) ? '—' : Math.round(n).toLocaleString('en-IN');
};

const MOCK_FLIGHTS = [
  { id: 1, airline: 'Air India', flightNumber: 'AI-302', origin: 'Delhi', destination: 'Mumbai', price: 4500, availableSeats: 42, departureTime: '06:00', arrivalTime: '08:15', duration: '2h 15m' },
  { id: 2, airline: 'IndiGo', flightNumber: '6E-221', origin: 'Mumbai', destination: 'Bangalore', price: 3800, availableSeats: 18, departureTime: '10:30', arrivalTime: '12:45', duration: '2h 15m' },
  { id: 3, airline: 'SpiceJet', flightNumber: 'SG-145', origin: 'Delhi', destination: 'Goa', price: 5200, availableSeats: 7, departureTime: '14:00', arrivalTime: '16:30', duration: '2h 30m' },
  { id: 4, airline: 'Vistara', flightNumber: 'UK-819', origin: 'Bangalore', destination: 'Delhi', price: 6100, availableSeats: 30, departureTime: '07:45', arrivalTime: '10:30', duration: '2h 45m' },
  { id: 5, airline: 'Air India', flightNumber: 'AI-505', origin: 'Lucknow', destination: 'Mumbai', price: 5800, availableSeats: 22, departureTime: '09:00', arrivalTime: '11:15', duration: '2h 15m' },
  { id: 6, airline: 'IndiGo', flightNumber: '6E-789', origin: 'Lucknow', destination: 'Indore', price: 3200, availableSeats: 35, departureTime: '13:00', arrivalTime: '14:30', duration: '1h 30m' },
  { id: 7, airline: 'GoAir', flightNumber: 'G8-412', origin: 'Hyderabad', destination: 'Chennai', price: 2900, availableSeats: 50, departureTime: '16:00', arrivalTime: '17:15', duration: '1h 15m' },
  { id: 8, airline: 'Vistara', flightNumber: 'UK-623', origin: 'Kolkata', destination: 'Delhi', price: 5500, availableSeats: 0, departureTime: '20:00', arrivalTime: '22:30', duration: '2h 30m' },
];

const AIRLINE_COLORS = {
  'Air India': { bg: '#FFF0E5', color: '#FF6B00', emoji: '🔴' },
  'IndiGo':    { bg: '#E8F1FF', color: '#1A73E8', emoji: '🔵' },
  'SpiceJet':  { bg: '#FFF3E0', color: '#F57C00', emoji: '🟠' },
  'Vistara':   { bg: '#F3E8FF', color: '#7B2FBE', emoji: '🟣' },
  'GoAir':     { bg: '#E6F9EE', color: '#059669', emoji: '🟢' },
};

const Flights = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [search, setSearch] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', color: '' });

  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ passengers: 1, classType: 'Economy' });

  useEffect(() => { loadFlights(); }, []);

  const loadFlights = async () => {
    try {
      const data = await apiGetFlights();
      setFlights(data); setAllFlights(data);
    } catch {
      setFlights(MOCK_FLIGHTS); setAllFlights(MOCK_FLIGHTS);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', color: '' });
    try {
      const data = await apiSearchFlights(search.origin, search.destination);
      setFlights(data);
    } catch {
      const filtered = allFlights.filter(f => {
        const matchOrigin = !search.origin || f.origin.toLowerCase().includes(search.origin.toLowerCase());
        const matchDest = !search.destination || f.destination.toLowerCase().includes(search.destination.toLowerCase());
        return matchOrigin && matchDest;
      });
      setFlights(filtered);
      setMsg(filtered.length === 0
        ? { text: 'No flights found for this route', color: 'warning' }
        : { text: `Found ${filtered.length} flight(s)`, color: 'success' }
      );
    } finally { setLoading(false); }
  };

  const handleBook = (flight) => {
    if (!user) { setMsg({ text: 'Please login to book a flight', color: 'warning' }); return; }
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const res = await apiBookFlight(selectedFlight.id, bookingDetails.passengers, bookingDetails.classType);
      setMsg({ text: `✅ Flight booked! Reference: ${res.bookingReference}`, color: 'success' });
      setShowModal(false);
      loadFlights();
    } catch (err) {
      setMsg({ text: err.message, color: 'danger' });
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="booking-hero-bg text-center" style={{ '--hero-image': `url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)` }}>
        <div className="hero-dark-overlay" />
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2.2rem' }}>✈️ Fly Higher</h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Search and compare the cheapest flights across all major airlines.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
            {['No Hidden Fees', 'Instant Confirmation', 'Free Cancellation*', '24/7 Support'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Popular Routes */}
        <div className="mb-4 mt-3">
          <h5 className="fw-bold mb-3" style={{ color: '#1A1A1A' }}>🔥 Popular Routes</h5>
          <div className="d-flex gap-2 flex-wrap">
            {[
              { label: 'Delhi → Mumbai', price: '₹3,499' },
              { label: 'Mumbai → Bangalore', price: '₹2,999' },
              { label: 'Delhi → Goa', price: '₹4,299' },
              { label: 'Bangalore → Hyderabad', price: '₹1,899' },
            ].map(({ label, price }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer', transition: 'border-color 0.2s', display: 'flex', flexDirection: 'column', gap: '2px' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6B00'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{label}</span>
                <span style={{ fontSize: '12px', color: '#FF6B00', fontWeight: 700 }}>from {price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Widget */}
        <Card className="booking-search-card glass-search-widget border-0 mb-4">
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <Form.Control
                style={{ flex: 1, minWidth: '180px' }}
                placeholder="From — Origin city or airport"
                value={search.origin}
                onChange={e => setSearch({ ...search, origin: e.target.value })}
              />
              <Form.Control
                style={{ flex: 1, minWidth: '180px' }}
                placeholder="To — Destination city or airport"
                value={search.destination}
                onChange={e => setSearch({ ...search, destination: e.target.value })}
              />
              <Button variant="primary" type="submit" className="fw-bold rounded-3 px-4" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                {loading ? '...' : '🔍 Search'}
              </Button>
            </div>
          </Form>
        </Card>

        {msg.text && (
          <div className={`alert alert-${msg.color} rounded-4 shadow-sm mb-4 text-center fw-bold`}>{msg.text}</div>
        )}

        {/* Flight Cards */}
        <div className="d-flex flex-column gap-3">
          {flights.map(f => {
            const theme = AIRLINE_COLORS[f.airline] || { bg: '#F5F7FA', color: '#555', emoji: '✈️' };
            const isFull = f.availableSeats <= 0;
            const isLow = f.availableSeats > 0 && f.availableSeats <= 10;
            return (
              <div key={f.id} className="flight-card" style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #FF6B00',
                boxShadow: '0 2px 12px rgba(15,23,42,0.07)',
                padding: '20px 24px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(15,23,42,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.07)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', minWidth: 0 }}>

                  {/* Airline Logo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, width: '180px' }}>
                    <div style={{ background: theme.bg, borderRadius: '12px', width: '46px', height: '46px', minWidth: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                      {theme.emoji}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1A1A1A', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.airline}</div>
                      <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '3px', fontWeight: 600, whiteSpace: 'nowrap' }}>{f.flightNumber}</div>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                    {/* Depart */}
                    <div style={{ flexShrink: 0, textAlign: 'center', width: '76px' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A1A', lineHeight: 1, whiteSpace: 'nowrap' }}>{formatTime(f.departureTime)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '3px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '76px' }}>{f.origin}</div>
                    </div>

                    {/* Dashed line + icon */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px', minWidth: '50px' }}>
                      <div style={{ position: 'relative', width: '100%', height: '2px', marginBottom: '5px' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '2px dashed #D0D7E4' }} />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '0 5px', color: '#FF6B00', fontSize: '12px', lineHeight: 1 }}>✈</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#bbb', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatDuration(f.departureTime, f.arrivalTime, f.duration)}</div>
                    </div>

                    {/* Arrive */}
                    <div style={{ flexShrink: 0, textAlign: 'center', width: '76px' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A1A', lineHeight: 1, whiteSpace: 'nowrap' }}>{formatTime(f.arrivalTime)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '3px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '76px' }}>{f.destination}</div>
                    </div>
                  </div>

                  {/* Class & Seats */}
                  <div style={{ textAlign: 'center', flexShrink: 0, width: '90px' }}>
                    <span style={{ background: '#FFF0E5', color: '#FF6B00', fontSize: '10px', fontWeight: 700, borderRadius: '20px', padding: '3px 8px', display: 'inline-block', marginBottom: '5px', whiteSpace: 'nowrap' }}>Non-stop</span>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, whiteSpace: 'nowrap', color: isFull ? '#ef4444' : isLow ? '#f59e0b' : '#22c55e' }}>
                      {isFull ? 'Sold Out' : isLow ? `⚠ ${f.availableSeats} left` : `${f.availableSeats} seats`}
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF6B00', lineHeight: 1, whiteSpace: 'nowrap' }}>₹{formatPrice(f.price)}</div>
                      <div style={{ fontSize: '0.68rem', color: '#aaa', marginTop: '3px', whiteSpace: 'nowrap' }}>{f.classType || 'Economy'}</div>
                    </div>
                    <Button
                      variant={isFull ? 'secondary' : 'primary'}
                      className="rounded-pill fw-bold px-4"
                      style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleBook(f)}
                      disabled={isFull}
                    >
                      {isFull ? 'Full' : 'Book Now'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {flights.length === 0 && (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
              <div style={{ fontWeight: 600 }}>No flights found for this route</div>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold">Confirm Flight Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-3">
            {selectedFlight && (
              <div className="mb-4 p-3 rounded-3" style={{ background: '#FFF0E5', border: '1px solid #FFD8B5' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedFlight.airline} · {selectedFlight.flightNumber}</div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>{selectedFlight.origin} → {selectedFlight.destination}</div>
                <div style={{ fontWeight: 700, color: '#FF6B00', marginTop: '6px', fontSize: '1.1rem' }}>₹{selectedFlight.price?.toLocaleString()}</div>
              </div>
            )}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Number of Passengers</Form.Label>
                <Form.Control type="number" min="1" max={selectedFlight?.availableSeats}
                  value={bookingDetails.passengers}
                  onChange={e => setBookingDetails({ ...bookingDetails, passengers: parseInt(e.target.value) })}
                  className="rounded-3" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Select Class</Form.Label>
                <Form.Select value={bookingDetails.classType}
                  onChange={e => setBookingDetails({ ...bookingDetails, classType: e.target.value })}
                  className="rounded-3">
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First Class">First Class</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="light" onClick={() => setShowModal(false)} className="rounded-3 px-4">Cancel</Button>
            <Button variant="primary" onClick={confirmBooking} className="rounded-3 px-4 shadow-sm">Confirm Booking</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Flights;
