import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../common/AuthModal';
import logo from '../../assets/images/logo.png';
import '../../styles/homeCss.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState('login');
  const navigate = useNavigate();

  const handleAuthOpen = (type) => {
    setAuthType(type);
    setShowAuth(true);
  };

  return (
    <header className="site-header sticky-top">
      <nav className="navbar navbar-expand-lg py-3" aria-label="Main navigation">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src={logo} height="40px" style={{ borderRadius: '8px' }} alt="Logo" />
            <span className="d-none d-sm-inline">BOOKZY</span>
          </Link>
          
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
              <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to="/shows" className="nav-link">Shows</Link></li>
              <li className="nav-item"><Link to="/hotels" className="nav-link">Hotels</Link></li>
              
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Travel
                </a>
                <ul className="dropdown-menu border-0 shadow-lg rounded-4 overflow-hidden mt-2">
                  <li><Link to="/travel/flights" className="dropdown-item py-2 px-4">Flights</Link></li>
                  <li><Link to="/travel/trains" className="dropdown-item py-2 px-4">Trains</Link></li>
                  <li><Link to="/travel/buses" className="dropdown-item py-2 px-4">Buses</Link></li>
                </ul>
              </li>

              <li className="nav-item"><Link to="/offers" className="nav-link">Offers</Link></li>
              <li className="nav-item"><Link to="/about" className="nav-link">About Us</Link></li>
            </ul>

            <div className="nav-right d-flex align-items-center gap-3">
              {user && (
                <div className="user-profile d-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="small fw-semibold">{user.name}</span>
                </div>
              )}

              <div className="auth-buttons">
                {user ? (
                  <button onClick={logout} className="btn btn-outline-danger px-4 rounded-pill">Logout</button>
                ) : (
                  <div className="d-flex gap-2 align-items-center">
                    <button onClick={() => handleAuthOpen('login')} className="btn btn-link btn-login text-decoration-none fw-semibold">Login</button>
                    <button onClick={() => handleAuthOpen('register')} className="btn btn-join-free px-4 rounded-pill">Join Free</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal show={showAuth} handleClose={() => setShowAuth(false)} type={authType} />
    </header>
  );
};

export default Navbar;
