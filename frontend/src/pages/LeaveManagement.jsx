import React, { useState, useEffect } from 'react';
import './Attendance.css'; // Reusing styles for consistency or can create LeaveManagement.css
import { useNotification } from '../context/NotificationContext';

export default function LeaveManagement({ userData }) {
  const { showNotification } = useNotification();
  const role = userData?.role || 'Employee';
  const [dbLeaves, setDbLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual', start: '', end: '', reason: '' });

  const fetchLeaves = async () => {
    setLoading(true);
    const endpoint = (role === 'Admin' || role === 'HR') ? "/api/leave/all" : "/api/leave/my-leaves";
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        const sorted = data.sort((a, b) => b.id - a.id);
        setDbLeaves(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [role]);

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

  const LeaveTable = ({ data, showActions = true }) => (
    <table className="att-table">
      <thead>
        <tr>
          {showActions && <th>Employee</th>}
          <th>Type</th>
          <th>Start</th>
          <th>End</th>
          <th>Reason</th>
          <th>Status</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((req, i) => (
          <tr key={i}>
            {showActions && (
              <td>
                <div className="emp-name-cell">
                   <img src={`https://ui-avatars.com/api/?name=${req.employee?.firstName || 'User'}&background=random`} alt="avatar" className="emp-avatar" />
                   <span style={{textTransform: 'capitalize'}}>{req.employee?.firstName} {req.employee?.lastName}</span>
                </div>
              </td>
            )}
            <td style={{color: '#475569'}}>{req.type}</td>
            <td style={{color: '#64748b'}}>{req.startDate ? new Date(req.startDate).toLocaleDateString('en-GB') : "--"}</td>
            <td style={{color: '#64748b'}}>{req.endDate ? new Date(req.endDate).toLocaleDateString('en-GB') : "--"}</td>
            <td style={{color: '#475569'}}>{req.reason}</td>
            <td>
               <span className={`status-badge status-${req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'warning' : 'info'}`}>{req.status}</span>
            </td>
            {showActions && (
              <td>
                {req.status === 'PENDING' ? (
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button className="btn-sm" style={{background: '#dcfce7', color: '#166534', border: 'none'}} onClick={() => handleLeaveAction(req.id, 'approve')}>Approve</button>
                    <button className="btn-sm" style={{background: '#fee2e2', color: '#991b1b', border: 'none'}} onClick={() => handleLeaveAction(req.id, 'reject')}>Reject</button>
                  </div>
                ) : (
                  <span style={{fontSize: '12px', color: '#94a3b8'}}>Processed</span>
                )}
              </td>
            )}
          </tr>
        ))}
        {data.length === 0 && !loading && <tr><td colSpan={showActions ? 7 : 5} style={{textAlign:'center', padding: '24px', color:'#94a3b8'}}>No leave requests found</td></tr>}
        {loading && <tr><td colSpan={showActions ? 7 : 5} style={{textAlign:'center', padding: '24px', color:'#94a3b8'}}>Loading requests...</td></tr>}
      </tbody>
    </table>
  );

  return (
    <div className="attendance-page">
      {showLeaveModal && (
        <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="modal-box" style={{background: 'white', padding: '32px', borderRadius: '16px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
            <h2 style={{marginTop: 0, marginBottom: '24px'}}>Request Leave</h2>
            <div className="modal-field" style={{marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <label style={{fontSize: '14px', fontWeight: 600, color: '#475569'}}>Leave Type</label>
              <select value={leaveForm.type} onChange={e => setLeaveForm({...leaveForm, type: e.target.value})} style={{padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                 <option>Casual</option><option>Sick</option><option>Unpaid</option>
              </select>
            </div>
            <div className="modal-field" style={{flexDirection: 'row', gap: '16px', display: 'flex', marginBottom: '16px'}}>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '8px'}}><label style={{fontSize: '14px', fontWeight: 600, color: '#475569'}}>From</label><input type="date" value={leaveForm.start} onChange={e => setLeaveForm({...leaveForm, start: e.target.value})} style={{padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0'}} /></div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '8px'}}><label style={{fontSize: '14px', fontWeight: 600, color: '#475569'}}>To</label><input type="date" value={leaveForm.end} onChange={e => setLeaveForm({...leaveForm, end: e.target.value})} style={{padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0'}} /></div>
            </div>
            <div className="modal-field" style={{marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px'}}><label style={{fontSize: '14px', fontWeight: 600, color: '#475569'}}>Reason</label><textarea rows="3" value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} style={{padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'none'}}></textarea></div>
            <div className="modal-actions" style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
              <button onClick={() => setShowLeaveModal(false)} style={{padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer'}}>Cancel</button>
              <button className="btn-primary" onClick={submitLeave} style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer'}}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

      <div className="att-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <h1 className="att-title" style={{margin: 0, fontSize: '1.5rem', fontWeight: 700}}>Leave Management</h1>
        {role === 'Employee' && <button className="btn-primary" onClick={() => setShowLeaveModal(true)} style={{padding: '10px 24px', borderRadius: '10px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(59,130,246,0.3)'}}>+ New Request</button>}
      </div>

      <div className="att-card" style={{background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div className="att-tabs" style={{borderBottom: '1px solid #f1f5f9', padding: '0 24px'}}>
          <div className="att-tab active" style={{padding: '16px 0', color: '#3b82f6', borderBottom: '2px solid #3b82f6', fontWeight: 600, fontSize: '0.9rem'}}>Leave History & Requests</div>
        </div>
        <div style={{padding: '24px'}}>
            <LeaveTable data={dbLeaves} showActions={role !== 'Employee'} />
        </div>
      </div>
    </div>
  );
}
