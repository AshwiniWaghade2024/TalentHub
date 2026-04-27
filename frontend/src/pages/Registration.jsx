import React, { useState, useEffect, useRef } from "react";
import "./Registration.css";
import { useNotification } from "../context/NotificationContext";

export default function Register({ goToLogin }) {
  const { showNotification } = useNotification();
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", role: "", department: "", password: "", confirmPassword: "", rememberMe: false
  });
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);
  const dropdownRef = useRef(null);

  const roles = [
    { value: "Admin", icon: <ShieldIcon className="role-icon admin-icon" /> },
    { value: "HR", icon: <UserCircleIcon className="role-icon hr-icon" /> },
    { value: "Employee", icon: <UserIcon className="role-icon emp-icon" /> }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsRoleOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleRoleSelect = (roleValue) => {
    let newDepartment = "";
    if (roleValue === "Admin") newDepartment = "Global";
    setForm({ ...form, role: roleValue, department: newDepartment });
    setIsRoleOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return showNotification("Passwords do not match", "error");
    showNotification("User Registered Successfully", "success");
    if (goToLogin) goToLogin();
  };

  let departmentOptions = [];
  if (form.role === "HR") {
    departmentOptions = ["HR Recruiter", "Training Manager", "Payroll HR"];
  } else if (form.role === "Employee") {
    departmentOptions = ["Software Engineer", "Tester", "Accountant", "Sales Executive"];
  }

  return (
    <div className="reg-page-wrapper">
      <h1 className="reg-app-title">TalentHub</h1>
      <div className="reg-card">
        <h2 className="reg-title">Create New User</h2>
        <p className="reg-subtitle">Fill in the details below to create a new user.</p>

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-field full-width">
            <label>Full Name</label>
            <div className="reg-input-group">
              <span className="reg-icon-left"><UserIconOutline /></span>
              <input type="text" name="fullName" placeholder="Enter full name" value={form.fullName} onChange={handleChange} className="pl-icon" required />
            </div>
          </div>

          <div className="reg-field full-width">
            <label>Email</label>
            <div className="reg-input-group">
              <span className="reg-icon-left"><MailIconOutline /></span>
              <input type="email" name="email" placeholder="Enter email" value={form.email} onChange={handleChange} className="pl-icon" required />
            </div>
          </div>

          <div className="reg-field">
            <label>Phone Number</label>
            <div className="reg-input-group">
              <span className="reg-icon-left text-emoji">🇮🇳 +91</span>
              <input type="tel" name="phone" placeholder="Enter phone number" value={form.phone} onChange={handleChange} className="pl-phone" required />
            </div>
          </div>

          <div className="reg-field position-relative" ref={dropdownRef}>
            <label>Role</label>
            <div className="reg-input-group custom-select" onClick={() => setIsRoleOpen(!isRoleOpen)}>
              <div className="selected-value">
                {form.role ? (
                  <>
                    {roles.find((r) => r.value === form.role)?.icon}
                    {form.role}
                  </>
                ) : (
                  <span className="placeholder">Select role</span>
                )}
              </div>
              <span className="reg-icon-right"><ChevronDownIcon /></span>
            </div>
            {isRoleOpen && (
              <ul className="dropdown-menu">
                {roles.map((r) => (
                  <li key={r.value} onClick={() => handleRoleSelect(r.value)} className={form.role === r.value ? "selected" : ""}>
                    {r.icon} {r.value}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="reg-field">
            <label>Department</label>
            <div className="reg-input-group" style={{ opacity: (form.role === "Admin" || !form.role) ? 0.7 : 1 }}>
              <select name="department" value={form.department} onChange={handleChange} required 
                disabled={form.role === "Admin" || !form.role}
                style={{ cursor: (form.role === "Admin" || !form.role) ? "not-allowed" : "pointer", backgroundColor: "transparent" }}>
                
                {form.role === "Admin" ? (
                  <option value="Global">Global</option>
                ) : (
                  <>
                    <option value="" disabled hidden>
                      {form.role ? "Select department" : "Select role first"}
                    </option>
                    {departmentOptions.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </>
                )}
              </select>
              <span className="reg-icon-right"><ChevronDownIcon /></span>
            </div>
          </div>

          <div className="reg-field empty-cell"></div>

          <div className="reg-field">
            <label>Password</label>
            <div className="reg-input-group">
              <input type={showPwd ? "text" : "password"} name="password" placeholder="Enter password" value={form.password} onChange={handleChange} className="input-no-left-icon" required />
              <span className="reg-icon-right" onClick={() => setShowPwd(!showPwd)}><EyeIcon /></span>
            </div>
          </div>

          <div className="reg-field">
            <label>Confirm password</label>
            <div className="reg-input-group">
              <input type={showConfPwd ? "text" : "password"} name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} className="input-no-left-icon" required />
              <span className="reg-icon-right" onClick={() => setShowConfPwd(!showConfPwd)}><EyeIcon /></span>
            </div>
          </div>

          <div className="reg-field full-width flex-center-left">
            <input type="checkbox" id="rememberMe" name="rememberMe" checked={form.rememberMe} onChange={handleChange} className="custom-checkbox" />
            <label htmlFor="rememberMe" className="checkbox-label">Remember Me</label>
          </div>

          <div className="reg-field full-width">
            <button type="submit" className="reg-submit-btn">Register</button>
          </div>
          {goToLogin && (
            <div className="reg-field full-width" style={{ textAlign: "center", marginTop: "16px" }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); goToLogin(); }} style={{ color: "#3b82f6", fontWeight: 500 }}>Login</a>
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const UserIconOutline = () => <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIconOutline = () => <svg viewBox="0 0 24 24" fill="#3b82f6" width="18" height="18"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"/></svg>;
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const ChevronDownIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>;
const ShieldIcon = ({className}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const UserCircleIcon = ({className}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>;
const UserIcon = ({className}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;