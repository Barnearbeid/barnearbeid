import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Services from './pages/Services';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import CreateService from './pages/CreateService';
import ServiceDetail from './pages/ServiceDetail';

function App() {
  return (
    <ErrorBoundary>
      <Router basename="/barnearbeid">
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create-service" element={<CreateService />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 