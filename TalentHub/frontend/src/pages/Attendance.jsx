import React, { useState, useEffect } from 'react';
import './Attendance.css';

export default function Attendance({ userData }) {
  const role = userData?.role || 'Employee';
  const email = userData?.email || 'User';
  const name = email.split('@')[0];
  const dept = role === 'HR' ? 'HR' : 'Software Engineer'; // Generic default

  const [dbAttendance, setDbAttendance] = useState([]);
  const [dbLeaves, setDbLeaves] = useState([]);

  useEffect(() => {
    let savedAtt = JSON.parse(localStorage.getItem('th_attendance'));
    let savedLeaves = JSON.parse(localStorage.getItem('th_leaves'));

    // Seed mock database if completely empty for presentation purposes
    if (!savedAtt) {
      savedAtt = [
        { id: "H001", img: "https://i.pravatar.cc/150?img=1", name: "Alice Waters", role: "HR", dept: "HR", date: "28/04/2026", checkIn: "09:00", checkOut: "17:45", status: "Present", statusType: "success" },
        { id: "E001", img: "https://i.pravatar.cc/150?img=11", name: "Michael Brown", role: "Employee", dept: "Software Engineer", date: "28/04/2026", checkIn: "08:50", checkOut: "17:00", status: "WFH", statusType: "info" },
        { id: "E004", img: "https://i.pravatar.cc/150?img=15", name: "Raj Sharma", role: "Employee", dept: "Software Engineer", date: "28/04/2026", checkIn: "09:15", checkOut: "18:00", status: "Present", statusType: "success" },
        { id: "E005", img: "https://i.pravatar.cc/150?img=20", name: "Lisa Wong", role: "Employee", dept: "Tester", date: "28/04/2026", checkIn: "09:00", checkOut: "17:30", status: "Present", statusType: "success" },
      ];
      localStorage.setItem('th_attendance', JSON.stringify(savedAtt));
    }

    if (!savedLeaves) {
      savedLeaves = [
        { img: "https://i.pravatar.cc/150?img=5", name: "Bob Harris", role: "HR", dept: "HR", type: "Sick", start: "2026-04-29", end: "2026-04-30", reason: "Fever", status: "Pending" },
        { img: "https://i.pravatar.cc/150?img=11", name: "Michael Brown", role: "Employee", dept: "Software Engineer", type: "Sick", start: "2026-04-25", end: "2026-04-27", reason: "Viral fever", status: "Pending" },
        { img: "https://i.pravatar.cc/150?img=20", name: "Lisa Wong", role: "Employee", dept: "Tester", type: "Casual", start: "2026-04-27", end: "2026-04-30", reason: "Vacation trip", status: "Pending" }
      ];
      localStorage.setItem('th_leaves', JSON.stringify(savedLeaves));
    }

    setDbAttendance(savedAtt);
    setDbLeaves(savedLeaves);
  }, []);

  const saveAtt = (newRecords) => {
    localStorage.setItem('th_attendance', JSON.stringify(newRecords));
    setDbAttendance(newRecords);
  };
  
  const saveLeaves = (newRecords) => {
    localStorage.setItem('th_leaves', JSON.stringify(newRecords));
    setDbLeaves(newRecords);
  };

  // Helper grouping function
  const groupByDept = (arr) => {
    return arr.reduce((acc, curr) => {
      const d = curr.dept || 'Other';
      if(!acc[d]) acc[d] = [];
      acc[d].push(curr);
      return acc;
    }, {});
  };

  // Modals Data State
  const [showAttModal, setShowAttModal] = useState(false);
  const [attForm, setAttForm] = useState({ date: '', checkIn: '', checkOut: '' });

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual', start: '', end: '', reason: '' });

  const submitAttendance = () => {
    if(!attForm.date || !attForm.checkIn || !attForm.checkOut) return alert('Please fill all fields');
    
    const d = new Date(attForm.date);
    const dateStr = d.toLocaleDateString('en-GB'); // Outputs DD/MM/YYYY

    const newRecord = {
      id: `E${Math.floor(Math.random() * 1000)}`,
      img: "https://i.pravatar.cc/150?img=12",
      name: name,
      email: email,
      role: role,
      dept: dept,
      date: dateStr,
      checkIn: attForm.checkIn,
      checkOut: attForm.checkOut,
      status: "Present",
      statusType: "success"
    };

    saveAtt([newRecord, ...dbAttendance]);
    setShowAttModal(false);
    setAttForm({ date: '', checkIn: '', checkOut: '' });
  };

  const submitLeave = () => {
    if(!leaveForm.start || !leaveForm.end || !leaveForm.reason) return alert('Please fill all fields');

    const newRecord = {
      img: "https://i.pravatar.cc/150?img=12",
      name: name,
      email: email,
      role: role,
      dept: dept,
      type: leaveForm.type,
      start: leaveForm.start,
      end: leaveForm.end,
      reason: leaveForm.reason,
      status: "Pending"
    };

    saveLeaves([newRecord, ...dbLeaves]);
    setShowLeaveModal(false);
    setLeaveForm({ type: 'Casual', start: '', end: '', reason: '' });
  };


  const AttendanceTable = ({ data, showActions = true }) => (
    <table className="att-table">
      <thead>
        <tr>
          {showActions && <th>Employee ID</th>}
          <th>{showActions ? 'Name' : 'Date'}</th>
          {showActions && <th>Date</th>}
          <th>Check-In Time</th>
          <th>Check-Out Time</th>
          <th>Status</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((emp, i) => (
          <tr key={i}>
            {showActions && <td style={{fontWeight: 500, color: '#475569'}}>{emp.id}</td>}
            {showActions ? (
              <td>
                <div className="emp-name-cell">
                  <img src={emp.img} alt={emp.name} className="emp-avatar" />
                  <span style={{lineHeight: 1.2, textTransform: 'capitalize'}}>
                    {emp.name.split(' ')[0]}<br/>
                    {emp.name.split(' ')[1] && <span style={{fontWeight: 400, color: '#64748b', fontSize: '13px'}}>{emp.name.split(' ')[1]}</span>}
                  </span>
                </div>
              </td>
            ) : (
                <td style={{fontWeight: 500, color: '#1e293b'}}>{emp.date}</td>
            )}
            {showActions && <td style={{color: '#64748b'}}>{emp.date}</td>}
            <td style={{color: '#475569', fontWeight: 500}}>{emp.checkIn}</td>
            <td style={{color: '#475569', fontWeight: 500}}>{emp.checkOut}</td>
            <td>
              <span className={`status-badge status-${emp.statusType}`}>{emp.status}</span>
            </td>
            {showActions && (
              <td>
                <div className="action-buttons">
                  <button className="btn-sm btn-upload">✓ Upload</button>
                  <button className="btn-sm btn-edit">Edit</button>
                  <button className="btn-sm btn-delete" onClick={() => saveAtt(dbAttendance.filter(a => a !== emp))}>Delete</button>
                </div>
              </td>
            )}
          </tr>
        ))}
        {data.length === 0 && <tr><td colSpan={showActions ? 7 : 4} style={{textAlign:'center', padding: '24px', color:'#94a3b8'}}>No records found</td></tr>}
      </tbody>
    </table>
  );

  const LeaveTable = ({ data, showActions = true }) => (
    <table className="att-table">
      <thead>
        <tr>
          {showActions && <th>Employee</th>}
          <th>Leave Type</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Reason</th>
          <th>Approval Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((req, i) => (
          <tr key={i}>
            {showActions && (
              <td>
                <div className="emp-name-cell">
                  <img src={req.img} alt={req.name} className="emp-avatar" />
                  <span style={{textTransform: 'capitalize'}}>{req.name}</span>
                </div>
              </td>
            )}
            <td style={{color: '#475569'}}>{req.type}</td>
            <td style={{color: '#64748b'}}>{new Date(req.start).toLocaleDateString('en-GB')}</td>
            <td style={{color: '#64748b'}}>{new Date(req.end).toLocaleDateString('en-GB')}</td>
            <td style={{color: '#475569'}}>{req.reason}</td>
            <td>
              {showActions ? (
                <div className="action-buttons">
                  <button className="btn-sm btn-approve" onClick={() => { let n = [...dbLeaves]; req.status = 'Approved'; saveLeaves(n); }}>Approve</button>
                  <button className="btn-sm btn-reject" onClick={() => { let n = [...dbLeaves]; req.status = 'Rejected'; saveLeaves(n); }}>Reject</button>
                </div>
              ) : (
                <span className={`status-badge status-${req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'warning' : 'info'}`}>{req.status}</span>
              )}
            </td>
          </tr>
        ))}
        {data.length === 0 && <tr><td colSpan={showActions ? 6 : 5} style={{textAlign:'center', padding: '24px', color:'#94a3b8'}}>No leave requests found</td></tr>}
      </tbody>
    </table>
  );

  return (
    <div className="attendance-page">

      {/* ATTENDANCE MODAL */}
      {showAttModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Log Attendance</h2>
            <div className="modal-field">
              <label>Date</label>
              <input type="date" value={attForm.date} onChange={e => setAttForm({...attForm, date: e.target.value})} />
            </div>
            <div className="modal-field" style={{flexDirection: 'row', gap: '16px'}}>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <label style={{marginBottom: 8}}>Check-In Time</label>
                <input type="time" value={attForm.checkIn} onChange={e => setAttForm({...attForm, checkIn: e.target.value})} />
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <label style={{marginBottom: 8}}>Check-Out Time</label>
                <input type="time" value={attForm.checkOut} onChange={e => setAttForm({...attForm, checkOut: e.target.value})} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowAttModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={submitAttendance} style={{padding: '10px 24px', borderRadius: '8px'}}>Save Attendance</button>
            </div>
          </div>
        </div>
      )}

      {/* LEAVE MODAL */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Request Leave</h2>
            <div className="modal-field">
              <label>Leave Type</label>
              <select value={leaveForm.type} onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}>
                 <option>Casual</option>
                 <option>Sick</option>
                 <option>Unpaid</option>
                 <option>Other</option>
              </select>
            </div>
            <div className="modal-field" style={{flexDirection: 'row', gap: '16px'}}>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <label style={{marginBottom: 8}}>From Date</label>
                <input type="date" value={leaveForm.start} onChange={e => setLeaveForm({...leaveForm, start: e.target.value})} />
              </div>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <label style={{marginBottom: 8}}>To Date</label>
                <input type="date" value={leaveForm.end} onChange={e => setLeaveForm({...leaveForm, end: e.target.value})} />
              </div>
            </div>
            <div className="modal-field">
              <label>Reason</label>
              <textarea rows="3" value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}></textarea>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowLeaveModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={submitLeave} style={{padding: '10px 24px', borderRadius: '8px'}}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

      <div className="att-header">
        <h1 className="att-title">Attendance & Leave Management</h1>
        {(role === 'Admin' || role === 'HR') && (
          <div className="att-header-right">
            <span className="sync-text">Biometric Sync: <strong style={{color: '#10b981'}}>ACTIVE</strong></span>
            <button className="btn-primary" style={{padding: '10px 20px', borderRadius: '8px'}}>Sync Now &gt;</button>
          </div>
        )}
      </div>

      <div className="att-card">
        <div className="att-tabs">
          <div className="att-tab active">Attendance</div>
          <div className="att-tab-spacer"></div>
          {role === 'Employee' && <button className="btn-primary" onClick={() => setShowAttModal(true)} style={{padding: '8px 24px', borderRadius: '8px', marginRight: '16px'}}>+ Log Attendance</button>}
          {(role === 'Admin' || role === 'HR') && <button className="btn-outline">Y Filter v</button>}
        </div>

        {/* ... ADMIN VIEW ... */}
        {role === 'Admin' && (
          <div style={{padding: '24px 0'}}>
            <h3 style={{margin: '0 24px 16px', color: '#1e293b'}}>HR Attendance</h3>
            <AttendanceTable data={dbAttendance.filter(a => a.role === 'HR')} />
            <h3 style={{margin: '32px 24px 16px', color: '#1e293b'}}>Employee Attendance</h3>
            {Object.entries(groupByDept(dbAttendance.filter(a => a.role === 'Employee'))).map(([d, items]) => (
              <div key={d} style={{marginBottom: '16px'}}>
                 <h4 style={{margin: '0 24px 8px', color: '#475569', fontSize: '1rem'}}>❖ {d}</h4>
                 <AttendanceTable data={items} />
              </div>
            ))}
          </div>
        )}

        {/* ... HR VIEW ... */}
        {role === 'HR' && (
          <div style={{padding: '24px 0'}}>
            <h3 style={{margin: '0 24px 16px', color: '#1e293b'}}>Employee Attendance by Department</h3>
            {Object.entries(groupByDept(dbAttendance.filter(a => a.role === 'Employee'))).map(([d, items]) => (
              <div key={d} style={{marginBottom: '24px'}}>
                 <h4 style={{margin: '0 24px 8px', color: '#475569', fontSize: '1rem', background: '#f1f5f9', padding: '8px 12px', borderRadius: '6px', display: 'inline-block'}}>Department: {d}</h4>
                 <AttendanceTable data={items} />
              </div>
            ))}
          </div>
        )}

        {/* ... EMPLOYEE VIEW ... */}
        {role === 'Employee' && (
          <div style={{padding: '24px 0'}}>
            <h3 style={{margin: '0 24px 16px', color: '#1e293b'}}>My Attendance History</h3>
            <AttendanceTable data={dbAttendance.filter(a => a.email === email)} showActions={false} />
          </div>
        )}
      </div>

      <div className="att-card" style={{marginTop: '24px'}}>
        <div className="att-toolbar">
          <h2 style={{fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0, paddingRight: '16px'}}>{role === 'Employee' ? 'My Leave Requests' : 'Leave Requests'}</h2>
          {(role === 'Admin' || role === 'HR') && (
            <>
              <select className="att-select" style={{width: '140px'}}><option>Pending</option></select>
              <input type="text" className="att-input" placeholder="Start Date         📅" />
              <input type="text" className="att-input" placeholder="End Date           📅" />
              <button className="btn-primary" style={{padding: '8px 24px', borderRadius: '8px'}}>Search</button>
            </>
          )}
          <div className="att-tab-spacer"></div>
          {role === 'Employee' && <button className="btn-primary" onClick={() => setShowLeaveModal(true)} style={{padding: '8px 24px', borderRadius: '8px'}}>+ Request Leave</button>}
        </div>

        {/* ... ADMIN LEAVES ... */}
        {role === 'Admin' && (
          <div style={{paddingBottom: '24px'}}>
            <h3 style={{margin: '16px 24px 12px', color: '#1e293b', fontSize: '0.95rem'}}>HR Leaves</h3>
            <LeaveTable data={dbLeaves.filter(a => a.role === 'HR')} />
            <h3 style={{margin: '24px 24px 12px', color: '#1e293b', fontSize: '0.95rem'}}>Employee Leaves</h3>
            {Object.entries(groupByDept(dbLeaves.filter(a => a.role === 'Employee'))).map(([d, items]) => (
              <div key={d}>
                 <h4 style={{margin: '16px 24px 8px', color: '#475569', fontSize: '0.9rem'}}>— {d}</h4>
                 <LeaveTable data={items} />
              </div>
            ))}
          </div>
        )}

        {/* ... HR LEAVES ... */}
        {role === 'HR' && (
          <div style={{paddingBottom: '24px'}}>
            {Object.entries(groupByDept(dbLeaves.filter(a => a.role === 'Employee'))).map(([d, items]) => (
              <div key={d} style={{marginBottom: '16px'}}>
                 <h4 style={{margin: '16px 24px 8px', color: '#475569', fontSize: '0.9rem', background: '#f1f5f9', padding: '6px 12px', display: 'inline-block', borderRadius: '4px'}}>Dept: {d}</h4>
                 <LeaveTable data={items} />
              </div>
            ))}
          </div>
        )}

        {/* ... EMPLOYEE LEAVES ... */}
        {role === 'Employee' && (
          <div style={{paddingBottom: '24px'}}>
            <LeaveTable data={dbLeaves.filter(a => a.email === email)} showActions={false} />
          </div>
        )}
      </div>
    </div>
  );
}
