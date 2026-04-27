import React, { useState } from "react";
import "./Registration.css";
import { useNotification } from "../context/NotificationContext";

export default function Login({ onLogin, goToRegister }) {
  const { showNotification } = useNotification();
  const [form, setForm] = useState({ email: "", password: "", role: "", department: "", rememberMe: false });
  const [showPwd, setShowPwd] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) return showNotification("Please verify you are not a robot", "info");
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            username: form.email.trim().toLowerCase(), 
            password: form.password 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save the JWT token for future requests
        localStorage.setItem("token", data.token);
        
        // Standardize role to Title Case for UI compatibility (ADMIN -> Admin, HR -> HR)
        let roleStr = data.roles && data.roles.length > 0 
            ? data.roles[0].replace("ROLE_", "").toUpperCase() 
            : "EMPLOYEE";
            
        if (roleStr === "ADMIN") roleStr = "Admin";
        else if (roleStr === "HR") roleStr = "HR";
        else roleStr = "Employee";
            
        // Tell App.jsx we successfully logged in and if password update is required
        if (onLogin) onLogin(roleStr, data.email || data.username, data.temporaryPassword, data.firstName, data.lastName);
      } else {
        setError(data.message || "Error: Invalid credentials");
      }
    } catch (err) {
      setError("Server is not responding. Ensure the Spring Boot backend is running.");
    }
  };

  return (
    <div className="reg-page-wrapper">
      <h1 className="reg-app-title">TalentHub</h1>
      <div className="reg-card">
        <h2 className="reg-title" style={{ marginBottom: "24px" }}>Login to TalentHub</h2>
        
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #f87171', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="reg-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div className="reg-field full-width">
            <label>Email / Username</label>
            <div className="reg-input-group">
              <span className="reg-icon-left"><MailIconOutline /></span>
              <input type="text" name="email" placeholder="Email / Username" value={form.email} onChange={handleChange} className="pl-icon" required />
            </div>
          </div>

          <div className="reg-field full-width">
            <label>Password</label>
            <div className="reg-input-group">
              <span className="reg-icon-left"><LockIcon /></span>
              <input type={showPwd ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} className="pl-icon input-no-left-icon" required />
              <span className="reg-icon-right" onClick={() => setShowPwd(!showPwd)}><EyeIcon /></span>
            </div>
          </div>


          <div className="recaptcha-box" onClick={() => setVerified(!verified)}>
            <div className="recaptcha-left">
              <div className="recaptcha-checkbox">
                {verified && <span style={{ color: '#0ea5e9', fontSize: '26px', fontWeight: 'bold' }}>✓</span>}
              </div>
              <span className="recaptcha-text">I'm not a robot</span>
            </div>
            <div className="recaptcha-right">
              <RecaptchaLogo />
              <div className="recaptcha-terms">Privacy - Terms</div>
            </div>
          </div>

          <div className="reg-field full-width flex-center-left" style={{ marginTop: '8px' }}>
            <input type="checkbox" id="rememberMeLogin" name="rememberMe" checked={form.rememberMe} onChange={handleChange} className="custom-checkbox" />
            <label htmlFor="rememberMeLogin" className="checkbox-label">Remember Me</label>
          </div>

          <div className="reg-field full-width">
            <button type="submit" className="reg-submit-btn">Login</button>
          </div>

          <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); showNotification("Please contact your HR administrator to reset your password.", "info"); }}>Forgot Password?</a>
          {goToRegister && (
             <div style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#64748b" }}>
               Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); goToRegister(); }} style={{ color: "#3b82f6", fontWeight: 500 }}>Create New User</a>
             </div>
          )}
        </form>
      </div>
    </div>
  );
}

const MailIconOutline = () => <svg viewBox="0 0 24 24" fill="#3b82f6" width="18" height="18"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"/></svg>;
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const ChevronDownIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const RecaptchaLogo = () => (
  <svg viewBox="0 0 32 32" width="26" height="26">
    <path fill="#4285F4" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 25a11 11 0 1 1 11-11 11 11 0 0 1-11 11z"/>
    <path fill="#4285F4" d="M16 10a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm-1 8.5l-2.5-2.5 1.4-1.4 1.1 1.1 3.1-3.1 1.4 1.4z"/>
  </svg>
);
