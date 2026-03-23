import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, UserCircle, Users, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('');
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

    const roles = [
        { id: 'admin', label: 'Admin', icon: <Shield size={18} className="text-blue-500" />, color: '#3b82f6' },
        { id: 'hr', label: 'HR', icon: <UserCircle size={18} className="text-orange-500" />, color: '#f97316' },
        { id: 'employee', label: 'Employee', icon: <Users size={18} className="text-green-500" />, color: '#22c55e' },
    ];

    return (
        <div className="register-container animate-fade-in">
            <h1 className="brand-title">TalentHub</h1>
            
            <div className="form-card">
                <div className="card-header">
                    <h2>Create New User</h2>
                    <p>Fill in the details below to create a new user.</p>
                </div>

                <form className="register-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group full-width">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input type="text" placeholder="Enter full name" />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input type="email" placeholder="Enter email" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-wrapper">
                                <span className="country-code">
                                    <img src="https://flagcdn.com/w20/in.png" alt="IN" width="16" />
                                    <span>+91</span>
                                </span>
                                <input type="text" placeholder="Enter phone number" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <div className="custom-select" onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}>
                                <div className={`select-trigger ${role ? 'selected' : ''}`}>
                                    {role ? (
                                        <div className="selected-item">
                                            {roles.find(r => r.id === role).icon}
                                            <span>{roles.find(r => r.id === role).label}</span>
                                        </div>
                                    ) : 'Select role'}
                                    <ChevronDown size={18} className={`chevron ${isRoleDropdownOpen ? 'open' : ''}`} />
                                </div>
                                
                                {isRoleDropdownOpen && (
                                    <div className="select-options animate-fade-in">
                                        {roles.map((r) => (
                                            <div 
                                                key={r.id} 
                                                className="option"
                                                onClick={() => {
                                                    setRole(r.id);
                                                    setIsRoleDropdownOpen(false);
                                                }}
                                            >
                                                {r.icon}
                                                <span>{r.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <div className="input-wrapper">
                                <select className="native-select">
                                    <option value="" disabled selected>Select department</option>
                                    <option value="hr">Human Resources</option>
                                    <option value="it">Information Technology</option>
                                    <option value="sales">Sales</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                                <ChevronDown className="select-chevron" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter password" 
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm password</label>
                            <div className="input-wrapper">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Confirm password" 
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            <span className="checkmark"></span>
                            Remember Me
                        </label>
                    </div>

                    <button type="submit" className="btn-primary register-btn">
                        Register
                    </button>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
