import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Shows from './pages/Shows';
import Hotels from './pages/Hotels';
import Flights from './pages/Flights';
import Trains from './pages/Trains';
import Buses from './pages/Buses';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
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
            <Route path="/about" element={<AboutUs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
          <ChatWindow />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
