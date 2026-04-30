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
import Trains from './pages/Trains';
import Buses from './pages/Buses';
import MigrationPlaceholder from './components/common/MigrationPlaceholder';
import ChatWindow from './components/ChatWindow';

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
            <Route path="/travel/trains" element={<Trains />} />
            <Route path="/travel/buses" element={<Buses />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
          <ChatWindow />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
