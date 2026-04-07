import React, { useState } from "react";
import "./Registration.css";

export default function ChangePassword({ onPasswordChanged, onCancel }) {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match!");
    }
    if (form.newPassword.length < 6) {
      return setError("Password must be at least 6 characters!");
    }
    
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/change-password", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
            oldPassword: form.oldPassword, 
            newPassword: form.newPassword 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onPasswordChanged();
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page-wrapper">
      <h1 className="reg-app-title">TalentHub</h1>
      <div className="reg-card">
        <h2 className="reg-title" style={{ marginBottom: "8px" }}>Update Password</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center' }}>
            To keep your account secure, please change your temporary password.
        </p>
        
        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #f87171', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="reg-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div className="reg-field full-width">
            <label>Current (Temporary) Password</label>
            <div className="reg-input-group">
              <span className="reg-icon-left"><LockIcon /></span>
              <input type="password" name="oldPassword" placeholder="Enter current password" value={form.oldPassword} onChange={handleChange} className="pl-icon" required />
            </div>
          </div>

          <div className="reg-field full-width">
            <label>New Password</label>
            <div className="reg-input-group">
              <span className="reg-icon-left"><LockIcon /></span>
              <input type="password" name="newPassword" placeholder="Enter new password" value={form.newPassword} onChange={handleChange} className="pl-icon" required />
            </div>
          </div>

          <div className="reg-field full-width">
            <label>Confirm New Password</label>
            <div className="reg-input-group">
              <span className="reg-icon-left"><LockIcon /></span>
              <input type="password" name="confirmPassword" placeholder="Confirm new password" value={form.confirmPassword} onChange={handleChange} className="pl-icon" required />
            </div>
          </div>

          <div className="reg-field full-width">
            <button type="submit" className="reg-submit-btn" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onCancel(); }} style={{ color: "#64748b", fontSize: "14px" }}>Cancel and Logout</a>
          </div>
        </form>
      </div>
    </div>
  );
}

const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
