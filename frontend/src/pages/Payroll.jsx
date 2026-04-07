import React, { useState, useEffect } from 'react';
import './Payroll.css';
import { useNotification } from '../context/NotificationContext';

export default function Payroll({ userData }) {
  const { showNotification } = useNotification();
  const role = userData?.role || 'Employee';
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('History'); // 'History' or 'Process'

  const fetchSalaries = async () => {
    setLoading(true);
    const endpoint = (role === 'Admin' || role === 'HR') ? "/api/payroll/all-history" : "/api/payroll/my-history";
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) setSalaries(data.sort((a, b) => b.id - a.id));
    } catch (err) { console.error("Fetch salaries failed:", err); }
    finally { setLoading(false); }
  };

  const fetchEmployees = async () => {
    if (role !== 'HR' && role !== 'Admin') return;
    try {
      const response = await fetch("http://localhost:8080/api/hr/employees", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) setEmployees(data);
    } catch (err) { console.error("Fetch employees failed:", err); }
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, [role]);

  const handleRunPayroll = async (empId) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    try {
      const response = await fetch(`http://localhost:8080/api/payroll/calculate/${empId}?month=${month}&year=${year}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        showNotification("Payroll processed successfully!", "success");
        fetchSalaries();
      } else {
        const data = await response.json();
        showNotification("Error: " + (data.message || "Failed to process"), "error");
      }
    } catch (err) { showNotification("Action failed", "error"); }
  };

  const handleSalaryUpdate = async (empId, newSalary) => {
    try {
      const response = await fetch(`http://localhost:8080/api/hr/employee/${empId}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ basicSalary: parseFloat(newSalary) })
      });
      if (response.ok) {
        showNotification("Salary updated!", "success");
        fetchEmployees();
      } else {
        showNotification("Update failed", "error");
      }
    } catch (err) { showNotification("Action failed", "error"); }
  };

  const downloadPayslip = async (salaryId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/payroll/download-payslip/${salaryId}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `payslip_${salaryId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            showNotification("Download failed", "error");
        }
    } catch (err) { showNotification("Connection failed", "error"); }
  };

  return (
    <div className="payroll-page">
      <div className="pr-header">
        <h1 className="pr-title">{role === 'Employee' ? 'My Payroll' : 'Payroll Management'}</h1>
      </div>
      <div className="pr-card">
         <div className="att-tabs">
            <div className={`att-tab ${activeTab === 'History' ? 'active' : ''}`} onClick={() => setActiveTab('History')}>Salary History</div>
            {(role === 'Admin' || role === 'HR') && <div className={`att-tab ${activeTab === 'Process' ? 'active' : ''}`} onClick={() => setActiveTab('Process')}>Process Payroll</div>}
         </div>
         
         <div style={{padding: '24px'}}>
            {activeTab === 'History' ? (
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Month/Year</th>
                    <th>Basic Salary</th>
                    <th>PF/ESI Ded.</th>
                    <th>Net Salary</th>
                    <th>Pay Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((s, i) => (
                    <tr key={i}>
                      <td>{s.employee.id}</td>
                      <td>{s.employee.firstName} {s.employee.lastName}</td>
                      <td>{s.month}/{s.year}</td>
                      <td>Rs. {s.basicSalary}</td>
                      <td style={{color: '#991b1b'}}>-Rs. {s.pfDeduction + s.esiDeduction}</td>
                      <td style={{fontWeight: 700}}>Rs. {s.netSalary}</td>
                      <td>{new Date(s.payDate).toLocaleDateString('en-GB')}</td>
                      <td><button className="pr-btn-view" onClick={() => downloadPayslip(s.id)}>📄 Payslip</button></td>
                    </tr>
                  ))}
                  {salaries.length === 0 && !loading && <tr><td colSpan="8" style={{textAlign:'center', padding:'20px', color:'#94a3b8'}}>No salary history found</td></tr>}
                  {loading && <tr><td colSpan="8" style={{textAlign:'center', padding:'20px', color:'#94a3b8'}}>Loading records...</td></tr>}
                </tbody>
              </table>
            ) : (
                <table className="pr-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Basic Salary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e, i) => (
                    <tr key={i}>
                      <td>{e.id}</td>
                      <td>{e.firstName} {e.lastName}</td>
                      <td>{e.email}</td>
                      <td>
                        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                            <input 
                                type="number" 
                                className="pr-search" 
                                style={{width: '120px', padding: '6px'}} 
                                defaultValue={e.basicSalary || 0}
                                onBlur={(event) => handleSalaryUpdate(e.id, event.target.value)}
                            />
                            <span style={{fontSize: '12px', color: '#64748b'}}>OnBlur Save</span>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="pr-btn-primary" 
                          onClick={() => handleRunPayroll(e.id)}
                          disabled={userData?.email === e.email}
                          title={userData?.email === e.email ? "You cannot run your own payroll" : ""}
                          style={userData?.email === e.email ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(1)' } : {}}
                        >
                          ⚡ Run Payroll
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
         </div>
      </div>
    </div>
  );
}
