import React, { useState } from 'react';
import './Dashboard.css';
import Attendance from './Attendance';
import Payroll from './Payroll';
import Performance from './Performance';

// SVG Icons
const HomeIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const DashIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const UserGroupIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const DollarIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const ChartIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const BellIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;

// Profile Mock Data
const profiles = {
  Admin: { name: "John Admin", role: "Admin", img: "https://i.pravatar.cc/150?u=1" },
  HR: { name: "Sarah HR", role: "HR Head 2024", img: "https://i.pravatar.cc/150?u=2" },
  Employee: { name: "Alex Employee", role: "Software Engineer", img: "https://i.pravatar.cc/150?u=3" }
};

const AdminDashboard = () => (
  <>
    <div className="admin-grid">
      <div className="dash-card">
        <div className="stat-label" style={{marginBottom: "auto"}}>Active Employees</div>
        <div className="stat-value">198</div>
        <div className="stat-label">Sept 26</div>
      </div>
      <div className="dash-card">
        <div className="stat-label" style={{marginBottom: "auto"}}>Pending Leaves</div>
        <div className="stat-value orange">12</div>
        <div className="stat-label">Sept 26</div>
      </div>
    </div>
    <div className="dash-card" style={{marginBottom: "24px"}}>
      <div className="card-title">Generate Payroll</div>
      <svg className="svg-chart" viewBox="0 0 500 100" preserveAspectRatio="none">
        <path d="M0 80 Q 50 20, 100 60 T 200 40 T 300 10 T 400 50 T 500 20" fill="none" stroke="#3b82f6" strokeWidth="3" />
        <circle cx="100" cy="60" r="5" fill="#3b82f6" />
        <circle cx="200" cy="40" r="5" fill="#3b82f6" />
        <circle cx="300" cy="10" r="5" fill="#3b82f6" />
        <circle cx="400" cy="50" r="5" fill="#3b82f6" />
        <circle cx="500" cy="20" r="5" fill="#3b82f6" />
      </svg>
    </div>
    <div className="dash-card">
      <div className="card-title">Attrition Rate <span style={{color: "#10b981"}}>8.5%</span></div>
      <div style={{display: 'flex', gap: '12px', alignItems: 'flex-end', height: '100px', paddingTop: '16px'}}>
        <div style={{width: '15%', height: '40%', background: '#e2e8f0', borderRadius: '4px'}}></div>
        <div style={{width: '15%', height: '60%', background: '#f59e0b', borderRadius: '4px'}}></div>
        <div style={{width: '15%', height: '80%', background: '#3b82f6', borderRadius: '4px'}}></div>
        <div style={{width: '15%', height: '50%', background: '#10b981', borderRadius: '4px'}}></div>
        <div style={{width: '15%', height: '70%', background: '#10b981', borderRadius: '4px'}}></div>
      </div>
    </div>
  </>
);

const HRDashboard = () => (
  <>
    <div className="hr-grid">
      <div className="dash-card">
        <div className="card-title">New Joiners</div>
        <div className="user-list">
          <div className="user-item">
            <img src="https://i.pravatar.cc/150?img=5" className="user-avatar" alt="user" />
            <div className="user-details"><div className="user-name">Ella White</div><div className="user-sub">Andrew12 | 2024</div></div>
          </div>
          <div className="user-item">
            <img src="https://i.pravatar.cc/150?img=11" className="user-avatar" alt="user" />
            <div className="user-details"><div className="user-name">Andrew Blake</div><div className="user-sub">Software Engineer</div></div>
            <div className="status-badge status-blue">23rd</div>
          </div>
        </div>
      </div>
      <div className="dash-card">
        <div className="card-title">Attendance Alerts</div>
        <div className="user-list">
          <div className="user-item">
            <img src="https://i.pravatar.cc/150?img=4" className="user-avatar" alt="user" />
            <div className="user-details"><div className="user-name">Samantha Green</div><div className="user-sub">Finance | 2024</div></div>
            <div className="status-badge status-blue">Late</div>
          </div>
          <div className="user-item">
            <img src="https://i.pravatar.cc/150?img=15" className="user-avatar" alt="user" />
            <div className="user-details"><div className="user-name">Ryan Patel</div><div className="user-sub">HR Manager</div></div>
            <div className="status-badge status-orange">Absent</div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="hr-grid">
      <div className="dash-card">
        <div className="card-title">Leave Requests</div>
        <div className="user-list">
          <div className="user-item">
             <div className="user-details"><div className="user-name">Lisa Wong</div><div className="user-sub">Annual Leave (2003) | 01-May 2022</div></div>
             <div className="status-badge status-green">Approved</div>
          </div>
          <div className="user-item">
             <div className="user-details"><div className="user-name">Daniel Smith</div><div className="user-sub">Sick Leave (8m) 2024</div></div>
             <div className="status-badge status-red">Canceled</div>
          </div>
        </div>
      </div>
      <div className="dash-card">
        <div className="card-title">Performance Review Status</div>
        <div className="user-list">
          <div className="user-item">
            <img src="https://i.pravatar.cc/150?img=9" className="user-avatar" alt="user" />
            <div className="user-details"><div className="user-name">Emma Watson</div><div className="user-sub">Q2 review</div></div>
            <div className="status-badge status-orange">Pending</div>
          </div>
          <div className="user-item">
            <img src="https://i.pravatar.cc/150?img=12" className="user-avatar" alt="user" />
            <div className="user-details"><div className="user-name">Raj Sharma</div><div className="user-sub">Excellent</div></div>
            <div className="status-badge status-green">Score 98</div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const EmployeeDashboard = ({ data, markAttendance }) => (
  <>
    <div className="emp-grid-top">
      <div className="dash-card">
        <div className="card-title" style={{marginBottom: "8px"}}>Attendance {data.checkIn ? <span className="status-badge status-green">Present</span> : <span className="status-badge status-orange">Pending</span>}</div>
        <div className="stat-label">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', margin: '16px 0'}}>
           <div><div className="time-display">{data.checkIn || "--:--"}</div><div className="time-sub">Check-In</div></div>
           <div><div className="time-display">{data.checkOut || "--:--"}</div><div className="time-sub">Check-Out</div></div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {!data.checkIn ? (
             <button className="btn-primary" onClick={() => markAttendance('in')}>Mark Check-In</button>
          ) : !data.checkOut ? (
             <button className="btn-primary" style={{background: '#f59e0b'}} onClick={() => markAttendance('out')}>Mark Check-Out</button>
          ) : (
             <div style={{fontWeight: 600}}>Completed for today</div>
          )}
        </div>
      </div>
      <div className="dash-card">
        <div className="card-title">Leave Balance</div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px'}}>
          <svg width="60" height="40" viewBox="0 0 60 40"><path d="M0 40 L20 10 L40 30 L60 0 L60 40 Z" fill="#dcfce7"/><path d="M0 40 L20 10 L40 30 L60 0" fill="none" stroke="#10b981" strokeWidth="3"/></svg>
          <div>
            <div className="time-display" style={{fontSize: '2rem'}}>{data.leaveBalance - data.leavesTaken}/{data.leaveBalance}</div>
            <div className="time-sub">Days Remaining</div>
          </div>
        </div>
      </div>
      <div className="dash-card">
        <div className="card-title">Salary Slip</div>
        <div className="salary-amount">₹ {data.salary.toFixed(2)}</div>
        <div style={{marginTop: "auto", height: "6px", background: "#e2e8f0", borderRadius: "3px", width: "100%"}}></div>
      </div>
    </div>
    
    <div className="emp-grid-bottom">
      <div className="dash-card">
        <div className="card-title">Recent Activities</div>
        <div className="user-list">
          {data.activities.length === 0 ? (
             <div style={{color: '#64748b', fontSize: '0.9rem', padding: '12px 0'}}>No recent activities to display.</div>
          ) : (
             data.activities.map((act, i) => (
                <div className="user-item" key={i}>
                  <div className="user-details"><div className="user-name">{act.title}</div><div className="user-sub">{act.date}</div></div>
                  <div className="status-badge status-blue">{act.status}</div>
                </div>
             ))
          )}
        </div>
      </div>
    </div>
  </>
);

export default function Dashboard({ userData, onLogout }) {
  const role = userData?.role || 'Employee';
  const email = userData?.email || 'User';

  const [activeTab, setActiveTab] = useState('Home');

  // Calculate total days in current month
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const [empData, setEmpData] = useState({
    checkIn: null, checkOut: null, leaveBalance: daysInMonth, leavesTaken: 0, salary: 0, activities: []
  });

  const markAttendance = (type) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (type === 'in') {
      setEmpData({ ...empData, checkIn: time, activities: [{ title: 'Checked In', date: time, status: 'Recorded' }, ...empData.activities]});
    } else {
      setEmpData({ ...empData, checkOut: time, activities: [{ title: 'Checked Out', date: time, status: 'Recorded' }, ...empData.activities]});
    }
  };

  return (
    <div className="dashboard-container">

      <div className="dash-sidebar">
        <div className="sidebar-logo">TalentHub</div>
        <ul className="sidebar-nav">
          <li className={activeTab === 'Home' ? 'active' : ''} onClick={() => setActiveTab('Home')}><HomeIcon/> Home</li>
          <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}><DashIcon/> Dashboard</li>
          <li><UserGroupIcon/> Employers</li>
          <li className={activeTab === 'Attendance' ? 'active' : ''} onClick={() => setActiveTab('Attendance')}><ClockIcon/> Attendance</li>
          <li className={activeTab === 'Payroll' ? 'active' : ''} onClick={() => setActiveTab('Payroll')}><DollarIcon/> Payroll</li>
          <li className={activeTab === 'Performance' ? 'active' : ''} onClick={() => setActiveTab('Performance')}><ChartIcon/> Performance</li>
          <li><SettingsIcon/> Reports</li>
          <div className="bot-settings">
            <li><SettingsIcon/> Settings</li>
          </div>
        </ul>
      </div>

      <div className="dash-main">
        <div className="dash-header">
          <div className="dash-header-left">
            <DashIcon /> {role === 'Admin' ? 'Dashboard' : `${role} Dashboard`}
          </div>
          <div className="dash-header-right">
            {onLogout && <button className="icon-btn" onClick={onLogout} title="Logout" style={{background: 'transparent', color: '#64748b', fontSize: '13px', width: 'auto', padding: '0 8px', fontWeight: '500'}}>Logout</button>}
            <button className="icon-btn"><BellIcon /></button>
            <div className="dash-profile">
              <div className="dash-profile-info" style={{alignItems: 'flex-end'}}>
                <span className="dash-profile-name" style={{textTransform: 'capitalize'}}>{email.split('@')[0]}</span>
                <span className="dash-profile-role">{role} Access</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-content">
          {activeTab !== 'Attendance' && activeTab !== 'Payroll' && activeTab !== 'Performance' && (
            <div className="dash-page-header">
              <div>
                <h1 className="dash-title">{activeTab === 'Home' ? 'Home' : (role === 'Admin' ? 'Dashboard' : `${role === 'HR' ? 'HR' : 'Employee'} Dashboard`)}</h1>
              </div>
              {activeTab === 'Dashboard' && role === 'Admin' && <button className="btn-primary">Generate Payroll &gt;</button>}
            </div>
          )}

          {activeTab === 'Home' && (
             <div>
               <div className="dash-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
                 <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'white' }}>Welcome back, <span style={{textTransform: 'capitalize'}}>{email.split('@')[0]}</span>! 👋</h2>
                 <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>You are logged in as an <strong>{role}</strong>. Access your tools and stay updated on your team's progress.</p>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                 <div className="dash-card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }} onClick={() => setActiveTab('Dashboard')} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                   <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
                   <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>View Dashboard</h3>
                   <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Access your real-time analytics and charts.</p>
                 </div>
                 <div className="dash-card">
                   <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📝</div>
                   <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Company Policies</h3>
                   <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Review the updated handbook for 2026.</p>
                 </div>
                 <div className="dash-card">
                   <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗣️</div>
                   <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Announcements</h3>
                   <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Town hall meeting scheduled for Friday.</p>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'Dashboard' && (
             <>
               {role === 'Admin' && <AdminDashboard />}
               {role === 'HR' && <HRDashboard />}
               {role === 'Employee' && <EmployeeDashboard data={empData} markAttendance={markAttendance} />}
             </>
          )}

          {activeTab === 'Attendance' && <Attendance userData={userData} />}
          {activeTab === 'Payroll' && <Payroll userData={userData} />}
          {activeTab === 'Performance' && <Performance userData={userData} />}
          
        </div>
      </div>
    </div>
  );
}
