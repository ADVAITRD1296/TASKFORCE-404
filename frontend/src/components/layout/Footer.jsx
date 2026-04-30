import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="mt-5">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-6">
            <h5 style={{ fontWeight: 800 }}>Get in touch</h5>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              Have questions or want to collaborate? Reach out to us.
            </p>
            <p style={{ margin: 0 }}>
              <i className="fa-solid fa-phone"></i> +91 12345 67890
            </p>
            <p>
              <i className="fa-solid fa-envelope"></i>{' '}
              <a href="mailto:info@taskforce404.com" className="text-white text-decoration-none">
                taskforce404@gmail.com
              </a>
            </p>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-md-end justify-content-start mt-3 mt-md-0">
            <div>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>Follow us</p>
              <div className="d-flex mt-2">
                <a href="https://www.instagram.com/taskforce_404/" target="_blank" rel="noreferrer" className="me-3 text-white">
                  <i className="fa-brands fa-instagram fa-lg"></i>
                </a>
                <a href="https://github.com/ADVAITRD1296/TASKFORCE-404.git" target="_blank" rel="noreferrer" className="me-3 text-white">
                  <i className="fa-brands fa-github fa-lg"></i>
                </a>
                <a href="#" className="text-white">
                  <i className="fa-brands fa-linkedin fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 border-top pt-3" style={{ opacity: 0.95 }}>
          &copy; 2025 Taskforce 404 — Designed by Team • All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
