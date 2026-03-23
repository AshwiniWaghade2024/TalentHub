import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

// Placeholder components - will be replaced with real pages based on images
const Dashboard = () => (
  <div style={{ display: 'flex' }}>
    <aside style={{ width: '280px', height: '100vh', padding: '1.5rem', borderRight: '1px solid var(--border)', background: 'white' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--primary)', fontSize: '1.5rem' }}>TalentHub</h2>
      <nav>
        <ul style={{ listStyle: 'none' }}>
          <li style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--bg-main)', marginBottom: '0.5rem', fontWeight: 500 }}>Dashboard</li>
          <li style={{ padding: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Attendance</li>
          <li style={{ padding: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Payroll</li>
          <li style={{ padding: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Performance</li>
          <li style={{ padding: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Reports</li>
        </ul>
      </nav>
    </aside>
    <main style={{ flex: 1, padding: '2.5rem', background: 'var(--bg-main)' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Dashboard Overview</h1>
        <div style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          Kashish (Admin)
        </div>
      </header>
      <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
        <p>Welcome to TalentHub. Waiting for UI reference images to build specific dashboard components.</p>
      </div>
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
