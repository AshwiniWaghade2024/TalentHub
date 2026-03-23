import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, UserCircle, Users, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('admin');
    const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);

    return (
        <div className="register-container animate-fade-in">
            <h1 className="brand-title">TalentHub</h1>
            
            <div className="form-card login-card">
                <div className="card-header">
                    <h2>Login to TalentHub</h2>
                </div>

                <form className="register-form" onSubmit={(e) => {
                    e.preventDefault();
                    navigate('/dashboard');
                }}>
                    <div className="form-group full-width">
                        <label>Email / Username</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input type="text" placeholder="Email / Username" />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
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

                    <div className="form-group full-width">
                        <label>Role</label>
                        <div className="input-wrapper">
                            <select 
                                className="native-select" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="admin">Admin</option>
                                <option value="hr">HR</option>
                                <option value="employee">Employee</option>
                            </select>
                            <ChevronDown className="select-chevron" size={18} />
                        </div>
                    </div>

                    <div className="captcha-container">
                        <div className={`captcha-box ${isCaptchaChecked ? 'checked' : ''}`} onClick={() => setIsCaptchaChecked(!isCaptchaChecked)}>
                            <div className="captcha-check">
                                {isCaptchaChecked ? <CheckCircle2 size={24} className="text-green-500" /> : <div className="check-box-empty"></div>}
                            </div>
                            <span>I'm not a robot</span>
                            <div className="captcha-brand">
                                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" width="24" />
                                <div className="captcha-links">
                                    <span>PRIVACY - TERMS</span>
                                    <span>Terms - Terms</span>
                                </div>
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
                        Login
                    </button>

                    <div className="forgot-password">
                        <a href="#">Forgot Password?</a>
                    </div>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Create Account</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
