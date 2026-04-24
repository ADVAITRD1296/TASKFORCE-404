import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal, Button, Form } from 'react-bootstrap';

const AuthModal = ({ show, handleClose, type = 'login' }) => {
  const { login, register } = useAuth();
  const [modalType, setModalType] = useState(type);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    phone: '',
    dob: '',
    address: ''
  });
  const [msg, setMsg] = useState({ text: '', color: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModalType(type);
    setMsg({ text: '', color: '' });
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      phone: '',
      dob: '',
      address: ''
    });
  }, [type, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', color: '' });
    setLoading(true);

    try {
      if (modalType === 'login') {
        const res = await login(formData.email.toLowerCase().trim(), formData.password);
        if (res.success) {
          setMsg({ text: 'Login successful!', color: 'green' });
          setTimeout(handleClose, 700);
        } else {
          setMsg({ text: res.message, color: 'red' });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setMsg({ text: 'Passwords do not match.', color: 'red' });
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setMsg({ text: 'Password must be at least 6 characters.', color: 'red' });
          setLoading(false);
          return;
        }
        const res = await register(formData);
        if (res.success) {
          setMsg({ text: 'Account created!', color: 'green' });
          setTimeout(handleClose, 900);
        } else {
          setMsg({ text: res.message, color: 'red' });
        }
      }
    } catch (error) {
      setMsg({ text: 'Something went wrong. Please try again.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <Modal.Header closeButton>
        <Modal.Title>{modalType === 'login' ? 'Welcome Back' : 'Join Bookzy'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {modalType === 'register' && (
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                name="fullname" 
                placeholder="John Doe"
                value={formData.fullname} 
                required 
                onChange={handleChange} 
              />
            </Form.Group>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              placeholder="name@example.com"
              value={formData.email} 
              required 
              onChange={handleChange} 
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password} 
              required 
              minLength={6} 
              onChange={handleChange} 
            />
          </Form.Group>

          {modalType === 'register' && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="••••••••"
                  value={formData.confirmPassword} 
                  required 
                  onChange={handleChange} 
                />
              </Form.Group>
              
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                      type="tel" 
                      name="phone" 
                      placeholder="+91..."
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="dob" 
                      value={formData.dob} 
                      onChange={handleChange} 
                    />
                  </Form.Group>
                </div>
              </div>
            </>
          )}
          
          <Button className="btn-auth-primary" type="submit" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Processing...' : (modalType === 'login' ? 'Sign In' : 'Create Account')}
          </Button>

          <Button 
            className="btn-auth-secondary" 
            variant="link" 
            onClick={() => setModalType(modalType === 'login' ? 'register' : 'login')}
          >
            {modalType === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Button>

          {msg.text && (
            <div className={`auth-msg ${msg.color === 'green' ? 'success' : 'error'}`}>
              {msg.text}
            </div>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
