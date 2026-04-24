import React from 'react';
import { Container } from 'react-bootstrap';

const MigrationPlaceholder = ({ title }) => {
  return (
    <Container className="py-5 text-center">
      <div className="py-5 px-4 bg-white rounded shadow-sm border">
        <h1 className="mb-4" style={{ fontWeight: 800 }}>{title}</h1>
        <div className="mb-4">
          <i className="fa-solid fa-screwdriver-wrench fa-4x text-primary"></i>
        </div>
        <h3>Coming Soon!</h3>
        <p className="text-muted lead">
          We are currently working on integrating the real-time booking engine for {title.toLowerCase()}. 
          Our team is busy connecting to the transport APIs to bring you the best prices.
        </p>
        <p>Please check back in a few days!</p>
        <a href="/" className="btn btn-primary mt-3">Return Home</a>
      </div>
    </Container>
  );
};

export default MigrationPlaceholder;
