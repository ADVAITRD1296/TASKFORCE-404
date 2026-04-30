import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../common/AuthModal';
import logo from '../../assets/images/logo.png';

/* Navigation links — Offers removed */
const NAV_LINKS = [
  { to: '/',               label: 'Home',    icon: 'fa-house'       },
  { to: '/travel/flights', label: 'Flights', icon: 'fa-plane'       },
  { to: '/hotels',         label: 'Hotels',  icon: 'fa-hotel'       },
  { to: '/travel/trains',  label: 'Trains',  icon: 'fa-train'       },
  { to: '/travel/buses',   label: 'Buses',   icon: 'fa-bus'         },
  { to: '/shows',          label: 'Shows',   icon: 'fa-ticket'      },
  { to: '/about',          label: 'About',   icon: 'fa-circle-info' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showAuth,  setShowAuth]  = useState(false);
  const [authType,  setAuthType]  = useState('login');
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to) ||
      location.pathname.includes(to.split('/').pop());
  };

  const openAuth = (type) => {
    setAuthType(type);
    setShowAuth(true);
    setMenuOpen(false);
  };

  return (
    <>
      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header
        id="site-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1050,
          background: '#ffffff',
          borderBottom: '1px solid #E8ECF2',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* ── Logo + Brand ── */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="Bookzy logo"
              style={{ height: '44px', objectFit: 'contain' }}
            />
          </Link>

          {/* ── Desktop Nav — centred, organized tabs ── */}
          <nav
            className="d-none d-lg-flex"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            {NAV_LINKS.map(({ to, label, icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: active ? '#FF6B00' : '#444444',
                    background: active ? '#FFF0E5' : 'transparent',
                    fontWeight: active ? 700 : 600,
                    transition: 'all 0.18s ease',
                    minWidth: '60px',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = '#FFF8F3';
                      e.currentTarget.style.color = '#FF6B00';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#444444';
                    }
                  }}
                >
                  <i
                    className={`fa-solid ${icon}`}
                    style={{
                      fontSize: '16px',
                      color: active ? '#FF6B00' : 'inherit',
                    }}
                  ></i>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Tablet nav (md–lg): horizontal icon-only pills) ── */}
          <nav
            className="d-none d-md-flex d-lg-none"
            style={{ flex: 1, justifyContent: 'center', gap: '4px', display: 'flex' }}
          >
            {NAV_LINKS.map(({ to, label, icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  title={label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '7px 10px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: active ? '#FF6B00' : '#555555',
                    background: active ? '#FFF0E5' : 'transparent',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <i className={`fa-solid ${icon}`} style={{ fontSize: '15px' }}></i>
                  <span style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* ── Auth zone — right ── */}
          <div
            className="d-none d-md-flex"
            style={{ alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}
          >
            {user ? (
              <div className="dropdown">
                <button
                  className="btn rounded-pill d-flex align-items-center gap-2 dropdown-toggle"
                  style={{
                    background: '#FFF0E5',
                    border: '1.5px solid #FF6B00',
                    padding: '7px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#FF6B00',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#1A1A1A' }}>{user.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3" style={{ minWidth: '175px' }}>
                  <li>
                    <Link className="dropdown-item py-2 fw-semibold" to="/profile">
                      <i className="fa-solid fa-user me-2" style={{ color: '#FF6B00' }}></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 fw-semibold" to="/bookings">
                      <i className="fa-solid fa-suitcase-rolling me-2" style={{ color: '#FF6B00' }}></i>My Bookings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger fw-bold" onClick={logout}>
                      <i className="fa-solid fa-right-from-bracket me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  style={{
                    background: 'transparent',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B00'; e.currentTarget.style.color = '#FF6B00'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#1A1A1A'; }}
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth('register')}
                  style={{
                    background: 'linear-gradient(135deg, #FF6B00, #e85d00)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(255,107,0,0.3)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,107,0,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(255,107,0,0.3)'; }}
                >
                  Join Free
                </button>
              </>
            )}
          </div>

          {/* ── Hamburger — mobile only ── */}
          <button
            className="d-md-none"
            onClick={() => setMenuOpen((p) => !p)}
            style={{
              marginLeft: 'auto',
              background: menuOpen ? '#FFF0E5' : 'transparent',
              border: '1.5px solid #E2E8F0',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
              color: menuOpen ? '#FF6B00' : '#333333',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              flexShrink: 0,
            }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* ── Mobile slide-down menu ── */}
        {menuOpen && (
          <div
            className="d-md-none"
            style={{
              background: '#ffffff',
              borderTop: '1px solid #E8ECF2',
              boxShadow: '0 16px 40px rgba(0,0,0,0.10)',
              padding: '16px',
              animation: 'slideDown 0.22s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            {/* Nav grid — 4-per-row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {NAV_LINKS.map(({ to, label, icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '12px 8px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      background: active ? '#FFF0E5' : '#F5F7FA',
                      color: active ? '#FF6B00' : '#555555',
                      border: active ? '1.5px solid rgba(255,107,0,0.3)' : '1.5px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <i className={`fa-solid ${icon}`} style={{ fontSize: '18px' }}></i>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Auth in mobile */}
            <div style={{ borderTop: '1px solid #E8ECF2', paddingTop: '16px' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '8px 4px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FF6B00', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 800, flexShrink: 0 }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>Signed in</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-danger w-100 rounded-pill fw-semibold"
                    onClick={() => { logout(); setMenuOpen(false); }}
                  >
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => openAuth('login')}
                    style={{ padding: '12px', border: '1.5px solid #E2E8F0', borderRadius: '12px', background: 'transparent', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Login to your account
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    style={{ padding: '12px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg,#FF6B00,#e85d00)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 10px rgba(255,107,0,0.3)' }}
                  >
                    Create Free Account
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal show={showAuth} handleClose={() => setShowAuth(false)} type={authType} />
    </>
  );
};

export default Navbar;
