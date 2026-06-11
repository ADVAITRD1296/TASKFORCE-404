import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Badge, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { apiGetProfile, apiUpdateProfile } from '../services/api';
import '../styles/homeCss.css';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '', dob: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = () => {
    setLoading(true);
    apiGetProfile()
      .then(data => {
        setProfileData(data);
        setEditForm({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          dob: data.dob ? data.dob : ''
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      await apiUpdateProfile(editForm);
      setEditing(false);
      loadProfile();
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.message || 'Failed to update profile', type: 'danger' });
    }
  };

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="booking-hero-bg text-center" style={{ '--hero-image': `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80)`, height: '300px' }}>
        <div className="hero-dark-overlay"></div>
        <Container className="position-relative" style={{ zIndex: 2, paddingTop: '60px' }}>
          <h1 className="fw-bold mb-2 text-white" style={{ fontSize: '2.5rem' }}>Your Profile</h1>
          <p className="text-white-50">Manage your personal information and preferences.</p>
        </Container>
      </div>

      <Container className="pb-5" style={{ marginTop: '-80px', position: 'relative', zIndex: 3 }}>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="border-0 rounded-4 overflow-hidden" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              
              <div className="p-4 p-md-5 bg-white">
                {msg.text && <div className={`alert alert-${msg.type} rounded-3 fw-bold shadow-sm`}>{msg.text}</div>}
                
                {loading && !profileData ? (
                  <div className="text-center py-5">
                     <span className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></span>
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-5">
                      <div style={{
                        width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold',
                        boxShadow: '0 8px 20px rgba(255,107,0,0.3)', flexShrink: 0
                      }}>
                        {profileData?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="text-center text-md-start">
                        <h2 className="fw-bold mb-1" style={{ color: '#1A1A1A' }}>{profileData?.name}</h2>
                        <div className="text-muted mb-2 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                          <i className="fa-solid fa-envelope"></i> {profileData?.email}
                        </div>
                        <Badge bg="success" className="px-3 py-2 rounded-pill fw-bold">Active Member</Badge>
                      </div>
                      <div className="ms-md-auto mt-3 mt-md-0">
                        <Button 
                          variant={editing ? "outline-secondary" : "primary"}
                          className="rounded-pill fw-bold px-4 shadow-sm"
                          onClick={() => setEditing(!editing)}
                        >
                          {editing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                      </div>
                    </div>

                    <hr className="mb-4" style={{ borderColor: '#E8ECF2' }} />

                    {editing ? (
                      <Form onSubmit={handleUpdate} className="bg-light p-4 rounded-4 shadow-sm">
                        <h5 className="fw-bold mb-4">Edit Details</h5>
                        <Row className="g-4">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold small text-muted text-uppercase mb-1">Full Name</Form.Label>
                              <Form.Control value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border-0 shadow-sm rounded-3 py-2 fw-semibold" required />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-bold small text-muted text-uppercase mb-1">Phone Number</Form.Label>
                              <Form.Control value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="border-0 shadow-sm rounded-3 py-2 fw-semibold" required />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold small text-muted text-uppercase mb-1">Date of Birth</Form.Label>
                              <Form.Control type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="border-0 shadow-sm rounded-3 py-2 fw-semibold" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold small text-muted text-uppercase mb-1">Address</Form.Label>
                              <Form.Control as="textarea" rows={3} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="border-0 shadow-sm rounded-3 py-2 fw-semibold" placeholder="Enter your full address" />
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="mt-4 text-end">
                          <Button variant="primary" type="submit" className="rounded-pill px-4 fw-bold shadow-sm">Save Changes</Button>
                        </div>
                      </Form>
                    ) : (
                      <Row className="g-4">
                        <Col md={6}>
                          <div className="p-4 rounded-4 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='none'}>
                            <div className="text-muted small fw-bold text-uppercase mb-2">Phone Number</div>
                            <div className="fs-5 fw-bold" style={{ color: '#1A1A1A' }}>
                              <i className="fa-solid fa-phone me-2" style={{ color: '#FF6B00' }}></i>
                              {profileData?.phone || 'Not provided'}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="p-4 rounded-4 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='none'}>
                            <div className="text-muted small fw-bold text-uppercase mb-2">Member Since</div>
                            <div className="fs-5 fw-bold" style={{ color: '#1A1A1A' }}>
                              <i className="fa-solid fa-calendar-check me-2 text-success"></i>
                              {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }) : 'Recently'}
                            </div>
                          </div>
                        </Col>
                        <Col md={12}>
                          <div className="p-4 rounded-4 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='none'}>
                            <div className="text-muted small fw-bold text-uppercase mb-2">Date of Birth</div>
                            <div className="fs-5 fw-bold" style={{ color: '#1A1A1A' }}>
                              <i className="fa-solid fa-cake-candles me-2" style={{ color: '#E11D48' }}></i>
                              {profileData?.dob ? new Date(profileData.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : <span className="text-muted fw-normal" style={{ fontSize: '1rem' }}>No date of birth provided.</span>}
                            </div>
                          </div>
                        </Col>
                        <Col md={12}>
                          <div className="p-4 rounded-4 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='none'}>
                            <div className="text-muted small fw-bold text-uppercase mb-2">Address</div>
                            <div className="fs-5 fw-bold" style={{ color: '#1A1A1A' }}>
                              <i className="fa-solid fa-location-dot me-2 text-danger"></i>
                              {profileData?.address || <span className="text-muted fw-normal" style={{ fontSize: '1rem' }}>No address provided. Click 'Edit Profile' to add one.</span>}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
