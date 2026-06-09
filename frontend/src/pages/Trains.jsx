import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { apiGetTrains, apiSearchTrains, apiBookTrain } from '../services/api';
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

// Compute duration between two ISO timestamps, or return stored string
const formatDuration = (dep, arr, stored) => {
  if (stored && typeof stored === 'string' && !stored.includes('T')) return stored;
  if (dep && arr && dep.includes('T') && arr.includes('T')) {
    const d1 = new Date(dep), d2 = new Date(arr);
    if (!isNaN(d1) && !isNaN(d2)) {
      let diff = (d2 - d1) / 60000;
      if (diff < 0) diff += 1440 * Math.ceil(-diff / 1440);
      const h = Math.floor(diff / 60), m = diff % 60;
      return `${h}h${m > 0 ? ' ' + m + 'm' : ''}`;
    }
  }
  return stored || '--';
};

const formatPrice = (p) => {
  const n = parseFloat(p);
  return isNaN(n) ? '—' : Math.round(n).toLocaleString('en-IN');
};

const MOCK_TRAINS = [
  { id: 1, trainName: 'Rajdhani Express', trainNumber: '12309', origin: 'Delhi', destination: 'Mumbai', price: 1800, availableSeats: 120, departureTime: '16:30', arrivalTime: '08:15', duration: '15h 45m' },
  { id: 2, trainName: 'Shatabdi Express', trainNumber: '12001', origin: 'Delhi', destination: 'Lucknow', price: 950, availableSeats: 85, departureTime: '06:00', arrivalTime: '12:30', duration: '6h 30m' },
  { id: 3, trainName: 'Duronto Express', trainNumber: '12213', origin: 'Mumbai', destination: 'Delhi', price: 2100, availableSeats: 45, departureTime: '23:15', arrivalTime: '16:50', duration: '17h 35m' },
  { id: 4, trainName: 'Gatimaan Express', trainNumber: '12049', origin: 'Delhi', destination: 'Agra', price: 750, availableSeats: 200, departureTime: '08:10', arrivalTime: '09:50', duration: '1h 40m' },
  { id: 5, trainName: 'Lucknow Mail', trainNumber: '12229', origin: 'Lucknow', destination: 'Mumbai', price: 1200, availableSeats: 60, departureTime: '22:00', arrivalTime: '20:15', duration: '22h 15m' },
  { id: 6, trainName: 'Howrah Express', trainNumber: '12311', origin: 'Kolkata', destination: 'Delhi', price: 1500, availableSeats: 30, departureTime: '19:40', arrivalTime: '15:20', duration: '19h 40m' },
  { id: 7, trainName: 'Vande Bharat', trainNumber: '22436', origin: 'Lucknow', destination: 'Indore', price: 1100, availableSeats: 150, departureTime: '05:50', arrivalTime: '14:30', duration: '8h 40m' },
  { id: 8, trainName: 'Tamil Nadu Express', trainNumber: '12621', origin: 'Delhi', destination: 'Chennai', price: 2400, availableSeats: 0, departureTime: '21:05', arrivalTime: '07:15', duration: '34h 10m' },
];

const TRAIN_THEMES = {
  'Rajdhani Express': { bg: '#FFF0E5', color: '#FF6B00', emoji: '🔴' },
  'Shatabdi Express': { bg: '#E8F1FF', color: '#1A73E8', emoji: '🔵' },
  'Duronto Express':  { bg: '#F3E8FF', color: '#7B2FBE', emoji: '🟣' },
  'Gatimaan Express': { bg: '#E6F9EE', color: '#059669', emoji: '🟢' },
  'Vande Bharat':     { bg: '#FEF9E7', color: '#D4AC0D', emoji: '🟡' },
};

const CLASSES = [
  { cls: 'SL',  label: 'Sleeper',       desc: 'Most economical', color: '#059669', bg: '#E6F9EE' },
  { cls: '3A',  label: '3-Tier AC',     desc: 'Popular choice',  color: '#1A73E8', bg: '#E8F1FF' },
  { cls: '2A',  label: '2-Tier AC',     desc: 'Extra comfort',   color: '#7B2FBE', bg: '#F3E8FF' },
  { cls: '1A',  label: '1st Class AC',  desc: 'Premium travel',  color: '#FF6B00', bg: '#FFF0E5' },
];

const Trains = () => {
  const { user } = useAuth();
  const [trains, setTrains] = useState([]);
  const [allTrains, setAllTrains] = useState([]);
  const [search, setSearch] = useState({ origin: '', destination: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', color: '' });

  const [showModal, setShowModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ passengers: 1, classType: '3A' });

  useEffect(() => { loadTrains(); }, []);

  const loadTrains = async () => {
    try {
      const data = await apiGetTrains();
      setTrains(data); setAllTrains(data);
    } catch {
      setTrains(MOCK_TRAINS); setAllTrains(MOCK_TRAINS);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', color: '' });
    try {
      const data = await apiSearchTrains(search.origin, search.destination);
      setTrains(data);
    } catch {
      const filtered = allTrains.filter(t => {
        const matchOrigin = !search.origin || t.origin.toLowerCase().includes(search.origin.toLowerCase());
        const matchDest = !search.destination || t.destination.toLowerCase().includes(search.destination.toLowerCase());
        return matchOrigin && matchDest;
      });
      setTrains(filtered);
      setMsg(filtered.length === 0
        ? { text: 'No trains found for this route', color: 'warning' }
        : { text: `Found ${filtered.length} train(s)`, color: 'success' }
      );
    } finally { setLoading(false); }
  };

  const handleBook = (train) => {
    if (!user) { setMsg({ text: 'Please login to book a train', color: 'warning' }); return; }
    setSelectedTrain(train);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    try {
      const res = await apiBookTrain(selectedTrain.id, bookingDetails.passengers, bookingDetails.classType);
      setMsg({ text: `✅ Train booked! Reference: ${res.bookingReference}`, color: 'success' });
      setShowModal(false);
      loadTrains();
    } catch (err) {
      setMsg({ text: err.message, color: 'danger' });
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="booking-hero-bg text-center" style={{ '--hero-image': `url(https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1600&q=80)` }}>
        <div className="hero-dark-overlay" />
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold mb-2" style={{ fontSize: '2.2rem' }}>🚂 Book Your Train</h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>Comfortable, affordable train journeys to every corner of India.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
            {['PNR Status Tracking', 'Seat Availability Live', 'e-Ticket on Email', 'Instant Refunds'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                ✓ {tag}
              </span>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-5">
        {/* Travel Class Chips */}
        <div className="mb-4 mt-3">
          <h5 className="fw-bold mb-3" style={{ color: '#1A1A1A' }}>🛏️ Travel Classes Available</h5>
          <div className="d-flex gap-2 flex-wrap">
            {CLASSES.map(({ cls, label, desc, color, bg }) => (
              <div key={cls} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: '10px', padding: '10px 16px', minWidth: '120px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color }}>{cls}</span>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', marginTop: '2px' }}>{label}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{desc}</div>
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
                placeholder="From Station"
                value={search.origin}
                onChange={e => setSearch({ ...search, origin: e.target.value })}
              />
              <Form.Control
                style={{ flex: 1, minWidth: '180px' }}
                placeholder="To Station"
                value={search.destination}
                onChange={e => setSearch({ ...search, destination: e.target.value })}
              />
              <Button variant="primary" type="submit" className="fw-bold rounded-3 px-4" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                {loading ? '...' : '🔍 Search Trains'}
              </Button>
            </div>
          </Form>
        </Card>

        {msg.text && (
          <div className={`alert alert-${msg.color} rounded-4 shadow-sm mb-4 text-center fw-bold`}>{msg.text}</div>
        )}

        {/* Train Cards */}
        <div className="d-flex flex-column gap-3">
          {trains.map(t => {
            const theme = TRAIN_THEMES[t.trainName] || { bg: '#E8F1FF', color: '#1A73E8', emoji: '🚂' };
            const isFull = t.availableSeats <= 0;
            const isLow = t.availableSeats > 0 && t.availableSeats <= 20;
            return (
              <div key={t.id} style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #1A73E8',
                boxShadow: '0 2px 12px rgba(15,23,42,0.07)',
                padding: '20px 24px',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(15,23,42,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,23,42,0.07)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap', minWidth: 0 }}>

                  {/* Train Logo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 200px', minWidth: '160px' }}>
                    <div style={{ background: theme.bg, borderRadius: '12px', width: '52px', height: '52px', minWidth: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {theme.emoji}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A1A', lineHeight: 1.2 }}>{t.trainName}</div>
                      <div style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                        <span style={{ background: '#1A73E8', color: '#fff', borderRadius: '20px', padding: '2px 8px', fontWeight: 700, fontSize: '11px' }}>#{t.trainNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                    {/* Depart */}
                    <div style={{ flexShrink: 0, textAlign: 'center', width: '76px' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A1A', lineHeight: 1, whiteSpace: 'nowrap' }}>{formatTime(t.departureTime)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '3px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '76px' }}>{t.origin}</div>
                    </div>

                    {/* Dashed line + icon */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px', minWidth: '50px' }}>
                      <div style={{ position: 'relative', width: '100%', height: '2px', marginBottom: '5px' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '2px dashed #D0D7E4' }} />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '0 5px', color: '#1A73E8', fontSize: '12px', lineHeight: 1 }}>🚂</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#bbb', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatDuration(t.departureTime, t.arrivalTime, t.duration)}</div>
                    </div>

                    {/* Arrive */}
                    <div style={{ flexShrink: 0, textAlign: 'center', width: '76px' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A1A', lineHeight: 1, whiteSpace: 'nowrap' }}>{formatTime(t.arrivalTime)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '3px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '76px' }}>{t.destination}</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ textAlign: 'center', flex: '0 0 110px', minWidth: '90px' }}>
                    <span style={{ background: '#E6F9EE', color: '#059669', fontSize: '11px', fontWeight: 700, borderRadius: '20px', padding: '3px 10px', display: 'inline-block', marginBottom: '6px' }}>Runs Daily</span>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isFull ? '#ef4444' : isLow ? '#f59e0b' : '#22c55e' }}>
                      {isFull ? 'Sold Out' : isLow ? `⚠ ${t.availableSeats} left` : `${t.availableSeats} seats`}
                    </div>
                  </div>

                  {/* Price & Book */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1A73E8', lineHeight: 1, whiteSpace: 'nowrap' }}>₹{formatPrice(t.price)}</div>
                      <div style={{ fontSize: '0.68rem', color: '#aaa', marginTop: '3px', whiteSpace: 'nowrap' }}>{t.classType || 'Starting'}</div>
                    </div>
                    <Button
                      style={{
                        background: isFull ? '#ccc' : 'linear-gradient(135deg, #1A73E8, #1557B0)',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        padding: '8px 20px',
                        color: '#fff',
                        boxShadow: isFull ? 'none' : '0 4px 12px rgba(26,115,232,0.3)',
                      }}
                      onClick={() => handleBook(t)}
                      disabled={isFull}
                    >
                      {isFull ? 'Full' : 'Book Now'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {trains.length === 0 && (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚂</div>
              <div style={{ fontWeight: 600 }}>No trains found for this route</div>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold">Confirm Train Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-3">
            {selectedTrain && (
              <div className="mb-4 p-3 rounded-3" style={{ background: '#E8F1FF', border: '1px solid #BDD5FF' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedTrain.trainName} · #{selectedTrain.trainNumber}</div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>{selectedTrain.origin} → {selectedTrain.destination}</div>
                <div style={{ fontWeight: 700, color: '#1A73E8', marginTop: '6px', fontSize: '1.1rem' }}>₹{selectedTrain.price?.toLocaleString()}</div>
              </div>
            )}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Number of Passengers</Form.Label>
                <Form.Control type="number" min="1" max={selectedTrain?.availableSeats}
                  value={bookingDetails.passengers}
                  onChange={e => setBookingDetails({ ...bookingDetails, passengers: parseInt(e.target.value) })}
                  className="rounded-3" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Select Class</Form.Label>
                <Form.Select value={bookingDetails.classType}
                  onChange={e => setBookingDetails({ ...bookingDetails, classType: e.target.value })}
                  className="rounded-3">
                  <option value="SL">Sleeper (SL)</option>
                  <option value="3A">3-Tier AC (3A)</option>
                  <option value="2A">2-Tier AC (2A)</option>
                  <option value="1A">1st Class AC (1A)</option>
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

export default Trains;
