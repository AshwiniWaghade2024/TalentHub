import React, { useState } from "react";
import "./Employee.css";

function Employee({ userData, onProfileUpdate }) {
    const userRole = userData?.role || 'Employee';
    
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        username: userData?.email || '',
        firstName: userData?.firstName || (userData?.email ? userData.email.split('@')[0] : 'User'),
        lastName: userData?.lastName || 'User',
        phone: userData?.phone || '+1 (555) 123-4567'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");
        try {
            const response = await fetch("http://localhost:8080/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setMessage("Profile updated successfully!");
                setIsEditing(false);
                if (onProfileUpdate) {
                    onProfileUpdate(form);
                }
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (err) {
            setMessage("Connection error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-page" style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ color: '#1e293b', margin: 0, fontSize: '1.8rem' }}>My Profile</h1>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                        Edit Profile
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={loading} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>

            {message && (
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: message.includes('Failed') ? '#fef2f2' : '#f0fdf4', color: message.includes('Failed') ? '#991b1b' : '#166534', marginBottom: '16px', fontSize: '0.9rem' }}>
                    {message}
                </div>
            )}

            <div className="profile-card" style={{ 
                background: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                padding: '32px',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto',
                border: '1px solid #e2e8f0'
            }}>

                <img
                    className="profile-img"
                    src={`https://ui-avatars.com/api/?name=${form.firstName}&background=3b82f6&color=fff&size=120`}
                    alt="profile"
                    style={{ borderRadius: '50%', marginBottom: '16px', border: '4px solid #eff6ff', display: 'inline-block' }}
                />

                {!isEditing ? (
                    <>
                        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '4px', textTransform: 'capitalize' }}>{form.firstName} {form.lastName}</h2>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '24px' }}>{userRole}</p>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                    </div>
                )}

                <div className="profile-info" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '24px', 
                    textAlign: 'left',
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid #e2e8f0'
                }}>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Email / Username</label>
                        {!isEditing ? (
                            <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>{form.username}</p>
                        ) : (
                            <input type="text" name="username" value={form.username} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Phone</label>
                        {!isEditing ? (
                            <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>{form.phone}</p>
                        ) : (
                            <input type="text" name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Department</label>
                        <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>Engineering</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Joining Date</label>
                        <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>01-Oct 2024</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Employee;