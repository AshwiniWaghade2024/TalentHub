import React, { useState, useEffect } from 'react';
import './Attendance.css';
import { useNotification } from '../context/NotificationContext';

export default function Attendance({ userData }) {
  const { showNotification } = useNotification();
  const role = userData?.role || 'Employee';
  const email = userData?.email || 'User';
  const name = email.split('@')[0];

  const [dbAttendance, setDbAttendance] = useState([]);
  const [dbLeaves, setDbLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    setLoading(true);
    const endpoint = (role === 'Admin' || role === 'HR') ? "/api/attendance/all" : "/api/attendance/my-history";
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        setDbAttendance(data.sort((a,b) => b.id - a.id));
      }
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    const endpoint = (role === 'Admin' || role === 'HR') ? "/api/leave/all" : "/api/leave/my-leaves";
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        setDbLeaves(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchLeaves();
  }, [role]);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual', start: '', end: '', reason: '' });

  const submitLeave = async () => {
    if(!leaveForm.start || !leaveForm.end || !leaveForm.reason) return showNotification('Please fill all fields', 'info');
    
    const payload = {
      startDate: leaveForm.start,
      endDate: leaveForm.end,
      reason: leaveForm.reason,
      type: leaveForm.type
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leave/request`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message, "success");
        fetchLeaves();
        setShowLeaveModal(false);
        setLeaveForm({ type: 'Casual', start: '', end: '', reason: '' });
      } else {
        showNotification(data.message, "error");
      }
    } catch (err) {
      showNotification("Submission failed", "error");
    }
  };

  const handleLeaveAction = async (id, action) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/leave/${action}/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message, "success");
        fetchLeaves();
      } else {
        showNotification(data.message, "error");
      }
    } catch (err) {
      showNotification("Action failed", "error");
    }
  };

  const AttendanceTable = ({ data, showActions = true }) => (
    <table className="att-table">
      <thead>
        <tr>
          {showActions && <th>Employee</th>}
          <th>Date</th>
          <th>Check-In Time</th>
          <th>Check-Out Time</th>
          <th>Status</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((record, i) => (
          <tr key={i}>
            {showActions && (
              <td>
                <div className="emp-name-cell">
                  <img src={`https://ui-avatars.com/api/?name=${record.employee?.firstName || 'User'}&background=random`} alt="avatar" className="emp-avatar" />
                  <span>{record.employee?.firstName} {record.employee?.lastName}</span>
                </div>
              </td>
            )}
            <td style={{fontWeight: 500, color: '#1e293b'}}>{new Date(record.date).toLocaleDateString('en-GB')}</td>
            <td style={{color: '#475569', fontWeight: 500}}>{record.checkInTime || "--:--"}</td>
            <td style={{color: '#475569', fontWeight: 500}}>{record.checkOutTime || "--:--"}</td>
            <td>
              <span className={`status-badge status-success`}>Present</span>
            </td>
            {showActions && (
              <td>
                 <button className="btn-sm btn-delete" style={{background: '#fee2e2', color: '#b91c1c'}}>Delete</button>
              </td>
            )}
          </tr>
        ))}
        {data.length === 0 && !loading && <tr><td colSpan={showActions ? 6 : 4} style={{textAlign:'center', padding: '24px', color:'#94a3b8'}}>No records found</td></tr>}
        {loading && <tr><td colSpan={showActions ? 6 : 4} style={{textAlign:'center', padding: '24px', color:'#94a3b8'}}>Loading records...</td></tr>}
      </tbody>
    </table>
  );
  return (
    <div className="attendance-page">
      <div className="att-header">
        <h1 className="att-title">Attendance & History</h1>
        <button onClick={fetchAttendance} style={{ background: 'none', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Refresh History</button>
      </div>
      <div className="att-card">
        <div className="att-tabs">
          <div className="att-tab active">Recent History</div>
          <div className="att-tab-spacer"></div>
        </div>
        <div style={{padding: '24px 0'}}>
             <AttendanceTable data={dbAttendance} showActions={role !== 'Employee'} />
        </div>
      </div>
    </div>
  );
}
