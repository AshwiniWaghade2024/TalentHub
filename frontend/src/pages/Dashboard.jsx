import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Attendance from './Attendance';
import Payroll from './Payroll';
import Performance from './Performance';
import LeaveManagement from './LeaveManagement';
import Employee from './Employee';
import { useNotification } from '../context/NotificationContext';

// SVG Icons
const HomeIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const DashIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const UserGroupIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const DollarIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const ChartIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const BellIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const UserPlusIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line></svg>;
const CalendarIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;

const AdminDashboard = () => {
  const { showNotification } = useNotification();
  const [stats, setStats] = useState({ totalEmployees: 0, totalHR: 0, pendingLeaves: 0, totalPayroll: 0 });
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const resp = await fetch("http://localhost:8080/api/admin/stats", {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await resp.json();
            if (resp.ok) setStats(data);
        } catch (e) { console.error("Stats fail", e); }
    };
    fetchStats();
  }, []);

  const handlePost = () => {
    if(!announcement.trim()) return;
    showNotification("Broadcast sent: " + announcement, "success");
    setAnnouncement("");
  };

  return (
    <div className="admin-grid-container">
      <div className="admin-stats-row">
        <div className="dash-card">
           <div className="stat-label" style={{color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px'}}>Active Staff</div>
           <div className="stat-value" style={{fontSize: '2rem', fontWeight: 700, color: '#1e293b'}}>{stats.totalEmployees}</div>
           <div style={{fontSize:'12px', color:'#94a3b8', marginTop: '4px'}}>Total Employees</div>
        </div>
        <div className="dash-card">
           <div className="stat-label" style={{color: '#475569', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px'}}>HR Team</div>
           <div className="stat-value" style={{fontSize: '2rem', fontWeight: 700, color: '#3b82f6'}}>{stats.totalHR}</div>
           <div style={{fontSize:'12px', color:'#94a3b8', marginTop: '4px'}}>Active Admins</div>
        </div>
        <div className="stat-card dash-card" style={{borderLeft: '4px solid #f59e0b'}}>
           <div className="stat-label" style={{color: '#475569', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px'}}>Pending Leaves</div>
           <div className="stat-value" style={{fontSize: '2rem', fontWeight: 700, color: '#f59e0b'}}>{stats.pendingLeaves}</div>
           <div style={{fontSize:'12px', color:'#94a3b8', marginTop: '4px'}}>Awaiting Approval</div>
        </div>
        <div className="stat-card dash-card" style={{borderLeft: '4px solid #10b981'}}>
           <div className="stat-label" style={{color: '#475569', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px'}}>Monthly Payroll</div>
           <div className="stat-value" style={{fontSize: '2rem', fontWeight: 700, color: '#10b981'}}>₹{stats.totalPayroll.toLocaleString()}</div>
           <div style={{fontSize:'12px', color:'#94a3b8', marginTop: '4px'}}>Net Expenditure</div>
        </div>
      </div>

      <div className="dash-card announcement-card" style={{marginTop: '32px', padding: '32px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
            <div style={{background: '#eff6ff', padding: '10px', borderRadius: '12px'}}><BellIcon /></div>
            <div>
               <div className="card-title" style={{margin: 0, fontSize: '1.2rem'}}>Broadcast Announcement</div>
               <p className="card-subtitle" style={{margin: 0, color: '#64748b'}}>Send a system-wide notice to all registered users.</p>
            </div>
         </div>
         <textarea 
            placeholder="Type your announcement message here..." 
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            style={{
               width: '100%', 
               border: '1px solid #cbd5e1', 
               borderRadius: '12px', 
               padding: '18px', 
               marginTop: '8px', 
               minHeight: '140px', 
               fontSize: '1.05rem',
               fontWeight: 500,
               outline: 'none',
               resize: 'none',
               backgroundColor: '#ffffff',
               color: '#1e293b',
               boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
            }}
         />
         <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '16px'}}>
            <button className="btn-primary" onClick={handlePost} style={{padding: '12px 28px', borderRadius: '8px'}}>Post Broadcast</button>
         </div>
      </div>
    </div>
  );
};

const HRDashboard = () => {
    const [stats, setStats] = useState({ totalEmployees: 0, pendingLeaves: 0 });
    
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const resp = await fetch("http://localhost:8080/api/admin/stats", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await resp.json();
                if (resp.ok) setStats(data);
            } catch (e) { console.error("HR Stats fail", e); }
        };
        fetchStats();
    }, []);

    return (
        <div className="hr-grid-container">
            <div className="admin-stats-row">
                <div className="dash-card">
                   <div className="stat-label" style={{color: '#475569', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px'}}>Manageable Employees</div>
                   <div className="stat-value" style={{fontSize: '2rem', fontWeight: 700, color: '#1e293b'}}>{stats.totalEmployees}</div>
                   <div style={{fontSize:'12px', color:'#94a3b8', marginTop: '4px'}}>Total Active Staff Members</div>
                </div>
                <div className="stat-card dash-card" style={{borderLeft: '4px solid #f59e0b'}}>
                   <div className="stat-label" style={{color: '#475569', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px'}}>Leaves Pending</div>
                   <div className="stat-value" style={{fontSize: '2rem', fontWeight: 700, color: '#f59e0b'}}>{stats.pendingLeaves}</div>
                   <div style={{fontSize:'12px', color:'#94a3b8', marginTop: '4px'}}>Requests waiting for your action</div>
                </div>
            </div>
            
            <div className="dash-card" style={{marginTop: '24px'}}>
                <div className="card-title">Quick HR Actions</div>
                <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                    <p style={{color: '#64748b', fontSize: '0.9rem'}}>Use the sidebar to manage staff, process payroll, or approve leaves.</p>
                </div>
            </div>
        </div>
    );
};

const UserManagement = ({ role }) => {
  const { showNotification, confirm } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempPass, setTempPass] = useState("");
  const [users, setUsers] = useState([]);
  const [hrEmployees, pHrEmployees] = useState(null); // { hr: {}, list: [] }

  const fetchUsers = async () => {
    const ep = role === 'Admin' ? '/api/admin/hr-list' : '/api/hr/employees';
    try {
      const resp = await fetch(`http://localhost:8080${ep}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await resp.json();
      if (resp.ok) setUsers(data);
    } catch (e) { console.error("Fetch failed"); }
  };

  useEffect(() => { fetchUsers(); }, [role]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(""); setTempPass("");
    const endpoint = role === 'Admin' ? `/api/admin/create-hr?username=${email}&tempPassword=${password}` : `/api/hr/create-employee?tempPassword=${password}`;
    const body = role === 'HR' ? JSON.stringify({ email, firstName: email.split('@')[0], lastName: "User", basicSalary: 50000 }) : null;
    try {
      const resp = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" }, body
      });
      const data = await resp.json();
      if (resp.ok) {
        setMessage(data.message);
        const match = data.message.match(/Password: (.*)/);
        if (match) setTempPass(match[1]);
        setEmail(""); setPassword("");
        fetchUsers();
      } else setMessage("Error: " + data.message);
    } catch (err) { setMessage("Error: Connection failed."); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (id) => {
    if (!await confirm("Reset this employee's password to a new temporary one?")) return;
    try {
      const resp = await fetch(`http://localhost:8080/api/hr/employee/${id}/reset-password`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await resp.json();
      if (resp.ok) {
          showNotification(data.message, "success");
      } else showNotification(data.message, "error");
    } catch (e) { showNotification("Reset failed", "error"); }
  };

  const handleDelete = async (id) => {
    if (!await confirm("Delete this user?")) return;
    const ep = role === 'Admin' ? `/api/admin/delete-hr/${id}` : `/api/hr/employee/${id}`;
    try {
      const resp = await fetch(`http://localhost:8080${ep}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (resp.ok) {
          showNotification("User removed", "success");
          fetchUsers();
      }
    } catch (e) { showNotification("Delete failed", "error"); }
  };

  const showHRDetails = async (hr) => {
      try {
          const resp = await fetch(`http://localhost:8080/api/admin/hr/${hr.id}/employees`, {
              headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
          });
          const list = await resp.json();
          pHrEmployees({ hr, list });
      } catch (e) {
          showNotification("Failed to load details", "error");
      }
  };

  return (
    <div className="manage-users-container">
      <div className="dash-card manage-form-card">
        <div className="card-title">{role === 'Admin' ? 'Create New HR' : 'Create New Employee'}</div>
        <p className="card-subtitle">Register a new user in the system with temporary credentials.</p>
        {message && <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#166534', marginBottom: '16px', fontSize: '0.9rem' }}>{message}</div>}
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="e.g. john@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Temporary Password</label>
            <input type="text" placeholder="Keep empty to auto-generate" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Add User Account'}</button>
        </form>
        {tempPass && <div className="temp-pass-box">Temporary Password: <strong>{tempPass}</strong></div>}
      </div>

      <div className="dash-card manage-list-card">
        <div className="card-title">{role === 'Admin' ? 'Existing HR' : 'Existing Staff'}</div>
        <p className="card-subtitle">Manage and view details of all registered {role === 'Admin' ? 'HR accounts' : 'staff members'}.</p>
        <div className="table-container" style={{ marginTop: '24px' }}>
          <table className="att-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>#{u.id}</td>
                  <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {u.firstName ? `${u.firstName} ${u.lastName}` : (u.employee ? `${u.employee.firstName} ${u.employee.lastName}` : u.username)}
                      </div>
                      {u.username && u.firstName && <div style={{ fontSize: '12px', color: '#64748b' }}>@{u.username}</div>}
                  </td>
                  <td style={{ color: '#475569' }}>{u.email || u.username}</td>
                  <td>
                    <span className={`status-badge ${role === 'Admin' ? 'status-blue' : 'status-green'}`} style={{ fontSize: '11px' }}>
                      {u.role?.name === 'ROLE_ADMIN' ? 'Admin' : u.role?.name === 'ROLE_HR' ? 'HR' : u.role?.name === 'ROLE_EMPLOYEE' ? 'Employee' : (role === 'Admin' ? 'HR' : 'Employee')}
                    </span>
                  </td>
                  <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {role === 'Admin' && (
                          <button className="btn-sm" onClick={() => showHRDetails(u)} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>More Details</button>
                        )}
                        {role === 'HR' && (
                          <button className="btn-sm" onClick={() => handleResetPassword(u.id)} style={{ background: 'var(--accent-color)', color: 'white', border: 'none' }}>Reset Pwd</button>
                        )}
                        <button className="btn-sm btn-delete" onClick={() => handleDelete(u.id)}>Remove</button>
                      </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No records found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {hrEmployees && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-box" style={{ maxWidth: '700px', width: '90%' }}>
            <div className="card-title">Recruited by {hrEmployees.hr.username}</div>
            <p className="card-subtitle">List of all employees registered by this HR manager.</p>
            
            <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '20px' }}>
              <table className="att-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {hrEmployees.list.map(emp => (
                    <tr key={emp.id}>
                      <td>#{emp.id}</td>
                      <td style={{ fontWeight: 600 }}>{emp.firstName} {emp.lastName}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department?.name || '---'}</td>
                    </tr>
                  ))}
                  {hrEmployees.list.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No employees recruited yet</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="modal-actions" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => pHrEmployees(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeDashboard = ({ data, markAttendance }) => {
  const [showConfirm, setShowConfirm] = useState(null); // 'in' or 'out'

  return (
    <>
      <div className="emp-grid-top">
        <div className="dash-card">
          <div className="card-title" style={{ marginBottom: "8px" }}>Attendance {data.checkIn ? <span className="status-badge status-green">Present</span> : <span className="status-badge status-orange">Pending</span>}</div>
          <div className="stat-label">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
            <div><div className="time-display">{data.checkIn || "--:--"}</div><div className="time-sub">Check-In</div></div>
            <div><div className="time-display">{data.checkOut || "--:--"}</div><div className="time-sub">Check-Out</div></div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {!data.checkIn && (
               showConfirm === 'in' ? (
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Confirm?</span>
                    <button className="btn-primary" onClick={() => { markAttendance('in'); setShowConfirm(null); }} style={{ padding: '6px 12px' }}>Yes</button>
                    <button className="btn-outline" onClick={() => setShowConfirm(null)} style={{ padding: '6px 12px' }}>No</button>
                 </div>
               ) : <button className="btn-primary" onClick={() => setShowConfirm('in')}>Mark Check-In</button>
            )}
            {data.checkIn && !data.checkOut && (
               showConfirm === 'out' ? (
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>Confirm?</span>
                    <button className="btn-primary" onClick={() => { markAttendance('out'); setShowConfirm(null); }} style={{ padding: '6px 12px', background: '#f59e0b' }}>Yes</button>
                    <button className="btn-outline" onClick={() => setShowConfirm(null)} style={{ padding: '6px 12px' }}>No</button>
                 </div>
               ) : <button className="btn-primary" style={{ background: '#f59e0b' }} onClick={() => setShowConfirm('out')}>Mark Check-Out</button>
            )}
            {data.checkOut && <div style={{ fontWeight: 600, color: '#10b981' }}>Completed for today ✅</div>}
          </div>
        </div>
        <div className="dash-card">
            <div className="card-title">Leave Balance</div>
            <div className="time-display" style={{ fontSize: '2rem', marginTop: '12px' }}>31/31</div>
            <div className="time-sub">Days Remaining</div>
        </div>
        <div className="dash-card">
            <div className="card-title">Status</div>
            <div style={{ marginTop: '16px' }} className={`status-badge ${data.checkIn ? 'status-green' : 'status-orange'}`}>
                {data.checkIn ? 'Logged In' : 'Waiting for Check-in'}
            </div>
        </div>
      </div>
    </>
  );
};

export default function Dashboard({ userData, onLogout, onUpdateUserData }) {
  const { showNotification } = useNotification();
  const role = userData?.role || 'Employee';
  const email = userData?.email || 'User';
  const [activeTab, setActiveTab] = useState((role === 'Admin' || role === 'HR') ? 'Dashboard' : 'Home');
  const [empData, setEmpData] = useState({ checkIn: null, checkOut: null, activities: [] });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dismissedNotifs, setDismissedNotifs] = useState(() => {
    const saved = localStorage.getItem('dismissed_notifs');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const dismissNotif = (id) => {
    const next = [...dismissedNotifs, id];
    setDismissedNotifs(next);
    localStorage.setItem('dismissed_notifs', JSON.stringify(next));
  };

  const clearAllNotifs = () => {
    const ids = notifications.map(n => n.id);
    const next = [...new Set([...dismissedNotifs, ...ids])];
    setDismissedNotifs(next);
    localStorage.setItem('dismissed_notifs', JSON.stringify(next));
  };

  const filteredNotifs = notifications.filter(n => !dismissedNotifs.includes(n.id));

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !role) return;
      const headers = { "Authorization": `Bearer ${token}` };
      let list = [];

      if (role === 'HR' || role === 'Admin') {
        const resp = await fetch("http://localhost:8080/api/leave/all", { headers });
        if (resp.ok) {
          const data = await resp.json();
          data.filter(l => l.status === 'PENDING').slice(0, 5).forEach(l => {
            list.push({ id: `lv-${l.id}`, text: `${l.employee.firstName} requested ${l.type} leave`, time: 'Action needed', type: 'leave' });
          });
        }
      } else {
        const [respL, respP] = await Promise.all([
          fetch("http://localhost:8080/api/leave/my-leaves", { headers }),
          fetch("http://localhost:8080/api/payroll/my-history", { headers })
        ]);

        if (respL.ok) {
          const leaves = await respL.json();
          leaves.slice(0, 2).forEach(l => {
            if (l.status !== 'PENDING') {
              list.push({ id: `l-${l.id}`, text: `Leave for ${l.startDate} was ${l.status.toLowerCase()}`, type: 'leave' });
            }
          });
        }
        if (respP.ok) {
          const payroll = await respP.json();
          if (payroll.length > 0) {
            list.push({ id: `p-${payroll[0].id}`, text: `Payroll for ${payroll[0].month}/${payroll[0].year} has been processed`, type: 'payroll' });
          }
        }
      }
      setNotifications(list);
    } catch (e) { console.error("Notif fetch error", e); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [role]);

  const toggleNotifications = () => {
    if (!showNotifications) fetchNotifications();
    setShowNotifications(!showNotifications);
  };

  const handleProfileUpdate = (newData) => {
    if (onUpdateUserData) {
      onUpdateUserData(newData);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (showNotifications && !event.target.closest('.notif-dropdown') && !event.target.closest('.icon-btn')) {
            setShowNotifications(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Sidebar states
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 180) newWidth = 180;
      if (newWidth > 600) newWidth = 600;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (role === 'Employee') {
        const fetchTodayStatus = async () => {
            try {
                const resp = await fetch("http://localhost:8080/api/attendance/my-history", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                const history = await resp.json();
                if (history && history.length > 0) {
                    const latest = history[0];
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (latest.date === todayStr) {
                        setEmpData(prev => ({ ...prev, checkIn: latest.checkInTime, checkOut: latest.checkOutTime }));
                    }
                }
            } catch (err) { console.error("Status fetch failed"); }
        };
        fetchTodayStatus();
    }
  }, [role]);

  const markAttendance = async (type) => {
    const endpoint = type === 'in' ? '/api/attendance/check-in' : '/api/attendance/check-out';
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
        if (type === 'in') setEmpData({ ...empData, checkIn: time });
        else setEmpData({ ...empData, checkOut: time });
        showNotification(data.message, "success");
      } else showNotification(data.message, "error");
    } catch (err) { showNotification("Connection failed.", "error"); }
  };

  const themeClass = role === 'Admin' ? 'theme-admin' : role === 'HR' ? 'theme-hr' : '';

  return (
    <div className={`dashboard-container ${themeClass}`}>
      <div 
        className={`dash-sidebar ${!isSidebarOpen ? 'closed' : ''} ${isResizing ? 'resizing' : ''}`}
        style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '0px' }}
      >
        <div className="sidebar-logo">
          <span>TalentHub</span>
          <button className="icon-btn sidebar-toggle-inside" onClick={toggleSidebar}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
        </div>
        <ul className="sidebar-nav">
          {(role !== 'Admin' && role !== 'HR') && <li className={activeTab === 'Home' ? 'active' : ''} onClick={() => setActiveTab('Home')}><HomeIcon /> Home</li>}
          <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}><DashIcon /> Dashboard</li>
          {(role === 'Admin' || role === 'HR') && (
            <li className={activeTab === 'Manage' ? 'active' : ''} onClick={() => setActiveTab('Manage')}><UserPlusIcon /> {role === 'Admin' ? 'Manage HR' : 'Manage Staff'}</li>
          )}
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => setActiveTab('Profile')}><UserGroupIcon /> My Profile</li>
          <li className={activeTab === 'Attendance' ? 'active' : ''} onClick={() => setActiveTab('Attendance')}><ClockIcon /> Attendance</li>
          <li className={activeTab === 'Leave' ? 'active' : ''} onClick={() => setActiveTab('Leave')}><CalendarIcon /> Leave</li>
          <li className={activeTab === 'Payroll' ? 'active' : ''} onClick={() => setActiveTab('Payroll')}><DollarIcon /> Payroll</li>
          <li className={activeTab === 'Performance' ? 'active' : ''} onClick={() => setActiveTab('Performance')}><ChartIcon /> Performance</li>
        </ul>
        <div className="sidebar-resizer" onMouseDown={startResizing} />
      </div>

      <div className="dash-main">
        <div className="dash-header">
          <div className="dash-header-left">
            {!isSidebarOpen && (
              <button className="icon-btn toggle-sidebar-btn" onClick={toggleSidebar}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </button>
            )}
            <DashIcon /> {role} Dashboard
          </div>
          <div className="dash-header-right">
            {!showLogoutConfirm ? (
                <button className="icon-btn" onClick={() => setShowLogoutConfirm(true)} style={{ width: 'auto', padding: '0 8px' }}>Logout</button>
            ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px' }}>Exit?</span>
                    <button onClick={onLogout} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}>Yes</button>
                    <button onClick={() => setShowLogoutConfirm(false)} style={{ padding: '4px 8px', background: '#f1f5f9', border: 'none', borderRadius: '4px' }}>No</button>
                </div>
            )}
             <div style={{ position: 'relative' }}>
                <button className="icon-btn" onClick={toggleNotifications} title="Notifications">
                    <BellIcon />
                    {filteredNotifs.length > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#e11d48', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #1e293b' }}></span>}
                </button>
                {showNotifications && (
                    <div className="notif-dropdown">
                        <div className="notif-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span>Notifications</span>
                           {filteredNotifs.length > 0 && <button onClick={clearAllNotifs} style={{ fontSize: '11px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Clear All</button>}
                        </div>
                        <div className="notif-content">
                            {filteredNotifs.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>All caught up!</div>
                            ) : (
                                filteredNotifs.map(n => (
                                    <div key={n.id} className="notif-item" style={{ position: 'relative' }}>
                                        <div style={{ fontWeight: 500, fontSize: '13px', marginBottom: '4px' }}>{n.text}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{n.time || 'Status Update'}</div>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); dismissNotif(n.id); }} 
                                          style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px' }}
                                          title="Dismiss"
                                        >×</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="dash-profile"><span style={{ textTransform: 'capitalize' }}>{userData?.firstName || email.split('@')[0]}</span></div>
          </div>
        </div>

        <div className="dash-content">

          {activeTab === 'Home' && <div className="dash-card"><h2>Welcome back!</h2><p>Select a tool from the sidebar to get started.</p></div>}
          {activeTab === 'Dashboard' && (
             role === 'Admin' ? <AdminDashboard /> : role === 'HR' ? <HRDashboard /> : <EmployeeDashboard data={empData} markAttendance={markAttendance} />
          )}
          {activeTab === 'Attendance' && <Attendance userData={userData} />}
          {activeTab === 'Leave' && <LeaveManagement userData={userData} />}
          {activeTab === 'Profile' && <Employee userData={userData} onProfileUpdate={handleProfileUpdate} />}
          {activeTab === 'Manage' && <UserManagement role={role} />}
          {activeTab === 'Payroll' && <Payroll userData={userData} />}
          {activeTab === 'Performance' && <Performance userData={userData} />}
        </div>
      </div>
    </div>
  );
}
