import React from 'react';
import './Payroll.css';

export default function Payroll({ userData }) {
  const role = userData?.role || 'Employee';

  const payrollData = [
    { id: "E001", img: "https://i.pravatar.cc/150?img=1", name: "Ella White", basic: "$5,000", hra: "$2,000", allow: "$500", ded: "$600", pf: "$600", tax: "$400", total: "$1,000", net: "$6,500" },
    { id: "E002", img: "https://i.pravatar.cc/150?img=5", name: "Samantha Green", basic: "$4,800", hra: "$1,800", allow: "$400", ded: "$400", pf: "$576", tax: "$384", total: "$960", net: "$6,040" },
    { id: "E003", img: "https://i.pravatar.cc/150?img=11", name: "Michael Brown", basic: "$4,500", hra: "$1,600", allow: "$400", ded: "$400", pf: "$540", tax: "$360", total: "$800", net: "$5,700" },
    { id: "E004", img: "https://i.pravatar.cc/150?img=15", name: "Raj Sharma", basic: "$5,200", hra: "$2,100", allow: "$500", ded: "$624", pf: "$416", tax: "$416", total: "$1,040", net: "$6,760" },
    { id: "E005", img: "https://i.pravatar.cc/150?img=20", name: "Lisa Wong", basic: "$5,000", hra: "$2,000", allow: "$500", ded: "$500", pf: "$600", tax: "$400", total: "$1,000", net: "$6,500" },
    { id: "E006", img: "https://i.pravatar.cc/150?img=33", name: "David Kim", basic: "$5,300", hra: "$2,100", allow: "$600", ded: "$636", pf: "$636", tax: "$424", total: "$1,060", net: "$6,940" },
  ];

  if (role === 'Employee') {
    return (
      <div className="payroll-page">
        <div className="pr-header">
           <h1 className="pr-title">My Payroll</h1>
        </div>
        <div className="pr-card" style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>
          <div style={{fontSize: '3rem', marginBottom: '16px'}}>🔒</div>
          <h2>Access Restricted</h2>
          <p>You do not have administrative privileges to manage global payroll.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payroll-page">
      <div className="pr-header">
        <h1 className="pr-title">Payroll</h1>
        <div className="pr-header-right">
          <button className="pr-btn-outline"><span style={{color: '#10b981', marginRight:'6px'}}>▣</span> Export Bank File</button>
          <button className="pr-btn-outline"><span style={{color: '#3b82f6', marginRight:'6px'}}>📄</span> Generate Payslips</button>
          <button className="pr-btn-primary"><span style={{marginRight:'6px'}}>⚡</span> Run Payroll</button>
        </div>
      </div>

      <div className="pr-card">
        <div className="pr-toolbar">
          <select className="pr-select"><option>Month v</option></select>
          <div className="pr-search-wrapper">
             <input type="text" className="pr-search" placeholder="Search by name or employee ID" />
             <span className="pr-icon-search">🔍</span>
          </div>
          <select className="pr-select"><option>All Departments</option></select>
          <div style={{flex: 1}}></div>
          <button className="pr-btn-outline">Y Filter v</button>
        </div>

        <table className="pr-table">
          <thead>
            <tr>
              <th>Employee ID ⇕</th>
              <th>Name</th>
              <th>Basic Salary ⇕</th>
              <th>HRA ⇕</th>
              <th>Allowances ⇕</th>
              <th>Deductions ⇕</th>
              <th>PF ⇕</th>
              <th>Tax ⇕</th>
              <th>Total ⇕</th>
              <th>Net Salary</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((emp, i) => (
              <tr key={i}>
                <td style={{color: '#475569', fontWeight: 500}}>{emp.id}</td>
                <td>
                  <div className="emp-name-cell" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <img src={emp.img} alt={emp.name} style={{width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover'}} />
                    <span style={{lineHeight: 1.2, fontWeight: 600}}>
                      {emp.name.split(' ')[0]}<br/>
                      <span style={{fontWeight: 400, color: '#64748b', fontSize: '13px'}}>{emp.name.split(' ')[1]}</span>
                    </span>
                  </div>
                </td>
                <td style={{fontWeight: 500}}>{emp.basic}</td>
                <td style={{color: '#64748b'}}>{emp.hra}</td>
                <td style={{color: '#64748b'}}>{emp.allow}</td>
                <td style={{color: '#64748b'}}>{emp.ded}</td>
                <td style={{color: '#64748b'}}>{emp.pf}</td>
                <td style={{color: '#64748b'}}>{emp.tax}</td>
                <td style={{fontWeight: 500, color: '#475569'}}>{emp.total}</td>
                <td style={{fontWeight: 600}}>{emp.net}</td>
                <td>
                  <button className="pr-btn-view">👁 View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pr-footer">
          <div className="pr-footer-totals">
            <span>Total Employees: <strong style={{color: '#1e293b'}}>36</strong></span>
            <span>Total Net Salary: <strong style={{color: '#1e293b'}}>$ 42,040</strong></span>
          </div>
          <div className="pr-pagination">
            <button className="pr-page-btn">Previous</button>
            <button className="pr-page-btn" style={{borderBottom: '2px solid #0f766e', fontWeight: 600, color: '#1e293b'}}>1</button>
            <button className="pr-page-btn">2</button>
            <button className="pr-page-btn">3</button>
            <button className="pr-page-btn">4</button>
            <span style={{color: '#94a3b8', padding: '0 4px'}}>...</span>
            <button className="pr-page-btn" style={{background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px'}}>Next v</button>
          </div>
        </div>

        <div className="pr-footer-sub">
          <span><span style={{color:'#10b981', marginRight: '6px'}}>✓</span> Auto salary calculation, PDF payslip-generation and bank export file download</span>
          <span>Rows per page: 10 v</span>
        </div>
      </div>
    </div>
  );
}
