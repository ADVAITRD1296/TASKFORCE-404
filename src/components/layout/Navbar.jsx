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
    <header className="site-header">
      <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
        <div className="container-fluid">
          <Link to="/" className="brand">
            <img src={logo} height="56px" width="180px" style={{ borderRadius: '10px' }} alt="Logo" />
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-links">
              <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to="/shows" className="nav-link">Shows</Link></li>
              <li className="nav-item"><Link to="/hotels" className="nav-link">Hotels</Link></li>
              
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Travel
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/travel/flights" className="dropdown-item">Flights</Link></li>
                  <li><Link to="/travel/trains" className="dropdown-item">Trains</Link></li>
                  <li><Link to="/travel/buses" className="dropdown-item">Buses</Link></li>
                </ul>
              </li>

              <li className="nav-item"><Link to="/offers" className="nav-link">Offers</Link></li>
              <li className="nav-item"><Link to="/about" className="nav-link">About Us</Link></li>
            </ul>

            <div className="nav-right d-flex align-items-center">
              <div className="user-info me-3">
                <span className={`status ${user ? 'online' : ''}`}>
                  {user ? `Welcome, ${user.name}` : 'Not logged in'}
                </span>
              </div>

              <div className="auth-buttons">
                {user ? (
                  <button onClick={logout} className="btn btn-outline-danger btn-sm">Logout</button>
                ) : (
                  <>
                    <button onClick={() => handleAuthOpen('login')} className="btn btn-outline-primary btn-sm me-2">Login</button>
                    <button onClick={() => handleAuthOpen('register')} className="btn btn-primary btn-sm">Register</button>
                  </>
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
