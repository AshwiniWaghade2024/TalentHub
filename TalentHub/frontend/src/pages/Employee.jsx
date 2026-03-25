import React from "react";
import "./Employee.css";

function Employee({ userData }) {

    // Fallback if userData is empty or missing
    const user = userData || { email: "employee@talenthub.com", role: "Software Engineer" };
    const name = user.email ? user.email.split('@')[0] : "Employee";

    return (

        <div className="employee-page" style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>

            <h1 style={{ color: '#1e293b', marginBottom: '24px', fontSize: '1.8rem' }}>My Profile</h1>

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
                    src={`https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff&size=120`}
                    alt="profile"
                    style={{ borderRadius: '50%', marginBottom: '16px', border: '4px solid #eff6ff', display: 'inline-block' }}
                />

                <h2 style={{ color: '#0f172a', fontSize: '1.5rem', marginBottom: '4px', textTransform: 'capitalize' }}>{name}</h2>
                <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '24px' }}>{user.role || 'Software Engineer'}</p>

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
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Email</label>
                        <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>{user.email || 'N/A'}</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Phone</label>
                        <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>+1 (555) 123-4567</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Department</label>
                        <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>Engineering</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Joining Date</label>
                        <p style={{ color: '#1e293b', fontWeight: '500', margin: 0 }}>01-Oct 2024</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px', fontWeight: '500' }}>Salary</label>
                        <p style={{ color: '#10b981', fontWeight: '600', margin: 0 }}>₹1,20,000 / month</p>
                    </div>

                </div>

            </div>

        </div>

    )

}

export default Employee;