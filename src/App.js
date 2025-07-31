import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Profile from './pages/Profile';
import CreateService from './pages/CreateService';
import ServiceDetail from './pages/ServiceDetail';

function App() {
  return (
    <Router basename="/barnearbeid">
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-service" element={<CreateService />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 