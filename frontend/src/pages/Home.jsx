import React from 'react';
import './Home.css';

export default function Home({ goToLogin, goToRegister }) {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="home-logo">TalentHub</div>
        <div className="home-nav-links">
          <button className="btn-nav-login" onClick={goToLogin}>Log In</button>
          <button className="btn-nav-register" onClick={goToRegister}>Get Started</button>
        </div>
      </nav>

      <header className="home-hero">
         <div className="hero-content">
            <h1 className="hero-title">Unlock Your Team's <span className="text-gradient">Full Potential</span></h1>
            <p className="hero-subtitle">TalentHub is the intuitive, all-in-one HR platform that simplifies payroll, tracks attendance natively, and accelerates employee performance.</p>
            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={goToRegister}>Start for Free</button>
              <button className="btn-hero-secondary" onClick={goToLogin}>Go to Dashboard &rarr;</button>
            </div>
         </div>
      </header>

      <section className="home-features">
        <h2 className="features-title">Everything you need to manage talent</h2>
        <div className="features-grid">
           <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Employee Management</h3>
              <p>Seamlessly onboard, coordinate, and organize your entire workforce from a single pane of glass.</p>
           </div>
           <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Smart Attendance</h3>
              <p>Real-time check-ins and highly accurate leave balance tracking designed to eliminate friction.</p>
           </div>
           <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Automated Payroll</h3>
              <p>Generate salary slips securely with a single click as an Admin.</p>
           </div>
        </div>
      </section>
      
      <footer className="home-footer">
        <p>&copy; 2026 TalentHub Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
