import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../common/AuthModal';
import logo from '../../assets/images/logo.png';
import '../../styles/homeCss.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState('login');
  const location = useLocation();

  const handleAuthOpen = (type) => {
    setAuthType(type);
    setShowAuth(true);
  };

  const isActive = (path) => location.pathname.includes(path) ? 'active' : '';
  const isHome = location.pathname === '/' ? 'active' : '';

  return (
    <header
      className="site-header sticky-top"
      style={{ backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 8px rgba(0,0,0,0.07)', height: '56px', display: 'flex', alignItems: 'center' }}
    >
      <div className="container d-flex align-items-center" style={{ gap: '12px', height: '100%' }}>
        {/* Logo only */}
        <Link to="/" className="flex-shrink-0 text-decoration-none">
          <img src={logo} height="32px" style={{ borderRadius: '7px', display: 'block' }} alt="Bookzy Logo" />
        </Link>

        {/* Center Tabs */}
        <div className="d-none d-md-flex align-items-center rounded-pill px-1" style={{ backgroundColor: '#F5F7FA', border: '1px solid #E2E8F0', gap: '2px' }}>
          {/* Home tab */}
          <Link to="/" className={`nav-tab-pill ${isHome} d-flex flex-column align-items-center text-decoration-none`}>
            <i className="fa-solid fa-house" style={{ fontSize: '0.95rem' }}></i>
            <span>Home</span>
          </Link>
          <Link to="/travel/flights" className={`nav-tab-pill ${isActive('/flights')} d-flex flex-column align-items-center text-decoration-none`}>
            <i className="fa-solid fa-plane" style={{ fontSize: '0.95rem' }}></i>
            <span>Flights</span>
          </Link>
          <Link to="/hotels" className={`nav-tab-pill ${isActive('/hotels')} d-flex flex-column align-items-center text-decoration-none`}>
            <i className="fa-solid fa-hotel" style={{ fontSize: '0.95rem' }}></i>
            <span>Hotels</span>
          </Link>
          <Link to="/travel/trains" className={`nav-tab-pill ${isActive('/trains')} d-flex flex-column align-items-center text-decoration-none`}>
            <i className="fa-solid fa-train" style={{ fontSize: '0.95rem' }}></i>
            <span>Trains</span>
          </Link>
          <Link to="/travel/buses" className={`nav-tab-pill ${isActive('/buses')} d-flex flex-column align-items-center text-decoration-none`}>
            <i className="fa-solid fa-bus" style={{ fontSize: '0.95rem' }}></i>
            <span>Buses</span>
          </Link>
          <Link to="/shows" className={`nav-tab-pill ${isActive('/shows')} d-flex flex-column align-items-center text-decoration-none`}>
            <i className="fa-solid fa-ticket" style={{ fontSize: '0.95rem' }}></i>
            <span>Shows</span>
          </Link>
          <Link to="/offers" className={`nav-tab-pill ${isActive('/offers')} d-flex flex-column align-items-center text-decoration-none`}>
            <i className="fa-solid fa-percent" style={{ fontSize: '0.95rem' }}></i>
            <span>Offers</span>
          </Link>
        </div>

        {/* Right side — push to far right */}
        <div className="d-flex align-items-center ms-auto" style={{ gap: '10px' }}>
          {user ? (
            <div className="dropdown">
              <button
                className="btn rounded-pill d-flex align-items-center gap-2 dropdown-toggle"
                style={{ background: '#FFF0E5', border: '1.5px solid #FF6B00', color: '#FF6B00', padding: '5px 14px', fontSize: '13px' }}
                data-bs-toggle="dropdown"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                  style={{ width: '22px', height: '22px', fontSize: '11px', background: '#FF6B00', flexShrink: 0 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="fw-semibold" style={{ color: '#1A1A1A', fontSize: '13px' }}>{user.name.split(' ')[0]}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3" style={{ minWidth: '170px' }}>
                <li><Link className="dropdown-item py-2 fw-semibold" to="/profile"><i className="fa-solid fa-user me-2" style={{ color: '#FF6B00' }}></i>Profile</Link></li>
                <li><Link className="dropdown-item py-2 fw-semibold" to="/bookings"><i className="fa-solid fa-suitcase-rolling me-2" style={{ color: '#FF6B00' }}></i>My Bookings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item py-2 text-danger fw-bold" onClick={logout}><i className="fa-solid fa-right-from-bracket me-2"></i>Logout</button></li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => handleAuthOpen('login')}
              className="btn btn-primary rounded-pill fw-semibold d-flex align-items-center gap-1"
              style={{ padding: '7px 16px', fontSize: '13.5px' }}
            >
              <i className="fa-solid fa-user-circle"></i> Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className="d-md-none d-flex overflow-auto hide-scrollbar"
        style={{ backgroundColor: '#F5F7FA', borderTop: '1px solid #E2E8F0', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '4px 8px', gap: '4px' }}
      >
        <Link to="/" className={`nav-tab-pill mobile ${isHome} d-flex align-items-center gap-1 text-decoration-none px-3 py-1 rounded-pill`}>
          <i className="fa-solid fa-house"></i><span>Home</span>
        </Link>
        <Link to="/travel/flights" className={`nav-tab-pill mobile ${isActive('/flights')} d-flex align-items-center gap-1 text-decoration-none px-3 py-1 rounded-pill`}>
          <i className="fa-solid fa-plane"></i><span>Flights</span>
        </Link>
        <Link to="/hotels" className={`nav-tab-pill mobile ${isActive('/hotels')} d-flex align-items-center gap-1 text-decoration-none px-3 py-1 rounded-pill`}>
          <i className="fa-solid fa-hotel"></i><span>Hotels</span>
        </Link>
        <Link to="/travel/trains" className={`nav-tab-pill mobile ${isActive('/trains')} d-flex align-items-center gap-1 text-decoration-none px-3 py-1 rounded-pill`}>
          <i className="fa-solid fa-train"></i><span>Trains</span>
        </Link>
        <Link to="/travel/buses" className={`nav-tab-pill mobile ${isActive('/buses')} d-flex align-items-center gap-1 text-decoration-none px-3 py-1 rounded-pill`}>
          <i className="fa-solid fa-bus"></i><span>Buses</span>
        </Link>
        <Link to="/shows" className={`nav-tab-pill mobile ${isActive('/shows')} d-flex align-items-center gap-1 text-decoration-none px-3 py-1 rounded-pill`}>
          <i className="fa-solid fa-ticket"></i><span>Shows</span>
        </Link>
      </div>

      <AuthModal show={showAuth} handleClose={() => setShowAuth(false)} type={authType} />
    </header>
  );
};

export default Navbar;
