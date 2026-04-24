import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Shows from './pages/Shows';
import Hotels from './pages/Hotels';
import Flights from './pages/Flights';
import Offers from './pages/Offers';
import MigrationPlaceholder from './components/common/MigrationPlaceholder';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/travel/flights" element={<Flights />} />
            <Route path="/travel/trains" element={<MigrationPlaceholder title="Train Tickets" />} />
            <Route path="/travel/buses" element={<MigrationPlaceholder title="Bus Tickets" />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
