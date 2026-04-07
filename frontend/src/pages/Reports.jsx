import React from 'react';
import './Reports.css';

export default function Reports() {
  const lineData = [10, 15, 20, 25, 30, 36];
  const maxLine = 40;
  const linePoints = lineData.map((val, i) => `${i * 20},${50 - (val/maxLine * 50)}`).join(' ');
  const polygonPoints = `0,50 ${linePoints} 100,50`;

  const attBars = [
    { label: 'Mon', val: '90%', height: '60%' },
    { label: 'Tue', val: '90%', height: '60%' },
    { label: 'Wed', val: '50%', height: '35%' },
    { label: 'Thu', val: '55%', height: '40%' },
    { label: 'Fri', val: '88%', height: '80%' },
    { label: 'Sat', val: '84%', height: '75%', color: 'orange' },
  ];

  const attritionBars = [
    { label: 'Oct', val: '60%', height: '40%' },
    { label: 'Nov', val: '70%', height: '50%' },
    { label: 'Dec', val: '10%', height: '10%' },
    { label: 'Jan', val: '20%', height: '15%' },
    { label: 'Feb', val: '20%', height: '15%' },
    { label: 'Mar', val: '95%', height: '85%' },
    { label: 'Apr', val: '88%', height: '75%' },
  ];

  return (
    <div className="reports-page">
      <div className="rep-header">
        <div className="rep-title-group">
          <h1 className="rep-title">Reports & Analytics</h1>
          <p className="rep-subtitle">Generate and analyze employee reports.</p>
        </div>
        <div className="rep-header-actions">
           <button className="rep-btn-outline"><span style={{color:'#3b82f6'}}>+</span> Export Excel / PDF</button>
           <button className="rep-btn-fill"><span style={{color:'#64748b', fontSize:'14px'}}>📅</span> Month v</button>
        </div>
      </div>

      <div className="rep-toolbar">
         <select className="rep-select"><option>Month</option></select>
         <select className="rep-select"><option>Export</option></select>
      </div>

      <div className="rep-grid">
        
        {/* CARD 1: Employee Count */}
        <div className="rep-card">
           <div className="rep-card-header">
              <div className="rep-card-title-group">
                 <div className="rep-card-icon icon-blue">👥</div>
                 <h2 className="rep-card-title">Employee Count</h2>
              </div>
              <div className="rep-card-exports">
                 <button className="rep-btn-export ex">▣ Excel</button>
                 <button className="rep-btn-export pd">📄 PDF</button>
              </div>
           </div>
           <div className="rep-metric-label">Total Employees</div>
           <div className="rep-metric-value">36</div>
           <div className="rep-chart-area">
              <svg className="line-chart-svg" viewBox="0 0 100 50" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                       <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 <polygon points={polygonPoints} fill="url(#blueGrad)" />
                 <polyline points={linePoints} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                 {lineData.map((val, i) => (
                    <circle key={i} cx={i * 20} cy={50 - (val/maxLine * 50)} r="2" fill={i === 5 ? '#10b981' : '#3b82f6'} />
                 ))}
              </svg>
              <div style={{position: 'absolute', right: '-4px', top: '-10px', fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold'}}>32</div>
              <div className="x-axis-labels">
                <span className="x-label">Oct</span>
                <span className="x-label">Nov</span>
                <span className="x-label">Dec</span>
                <span className="x-label">Jan</span>
                <span className="x-label">Feb</span>
                <span className="x-label">Mar</span>
              </div>
           </div>
        </div>

        {/* CARD 2: Attendance Report */}
        <div className="rep-card">
           <div className="rep-card-header">
              <div className="rep-card-title-group">
                 <div className="rep-card-icon icon-purple">📈</div>
                 <h2 className="rep-card-title">Attendance Report</h2>
              </div>
              <div className="rep-card-exports">
                 <button className="rep-btn-export ex">▣ Excel</button>
                 <button className="rep-btn-export pd">📄 PDF</button>
              </div>
           </div>
           <div className="rep-metric-label">Overall Attendance Rate</div>
           <div className="rep-metric-value">92%</div>
           <div className="rep-chart-area">
              <div className="bar-chart-container" style={{padding: '0 5%'}}>
                 {attBars.map((b, i) => (
                   <div className="bar-group" key={i}>
                      <span className="bar-value">{b.val}</span>
                      <div className={`bar-column ${b.color || ''}`} style={{height: b.height}}></div>
                   </div>
                 ))}
              </div>
              <div className="x-axis-labels" style={{justifyContent: 'space-around', padding: '0 5%'}}>
                 {attBars.map((b, i) => <span key={i} className="x-label">{b.label}</span>)}
              </div>
           </div>
        </div>

        {/* CARD 3: Payroll Summary */}
        <div className="rep-card">
           <div className="rep-card-header">
              <div className="rep-card-title-group">
                 <div className="rep-card-icon icon-teal">💰</div>
                 <h2 className="rep-card-title">Payroll Summary</h2>
              </div>
              <div className="rep-card-exports">
                 <button className="rep-btn-export ex">▣ Excel</button>
                 <button className="rep-btn-export pd">📄 PDF</button>
              </div>
           </div>
           <div className="rep-metric-label">Total Payroll Cost</div>
           <div className="rep-metric-value">$56,300</div>
           
           <div className="rep-chart-area" style={{alignItems: 'center', minHeight: '180px'}}>
             <div className="donut-container">
               <div className="donut-legend">
                  <div className="legend-item"><div className="legend-name"><div className="legend-dot" style={{background:'#6ee7b7'}}></div>Basic Salary</div> <span>Salary</span></div>
                  <div className="legend-item"><div className="legend-name"><div className="legend-dot" style={{background:'#fcd34d'}}></div>HRA</div> <span>24.4%</span></div>
                  <div className="legend-item"><div className="legend-name"><div className="legend-dot" style={{background:'#a78bfa'}}></div>Allowances</div> <span>8.9%</span></div>
                  <div className="legend-item"><div className="legend-name"><div className="legend-dot" style={{background:'#3b82f6'}}></div>Deductions</div> <span>5.6%</span></div>
               </div>
               <div className="donut-ring" style={{
                 background: `conic-gradient(
                   #3b82f6 0% 64.1%, 
                   #fcd34d 64.1% 88.5%, 
                   #6ee7b7 88.5% 94.1%, 
                   #a78bfa 94.1% 100%
                 )`
               }}>
                  <div className="donut-inner">
                     <span style={{fontSize: '0.8rem', color: '#64748b'}}>Basic Sal</span>
                     <span style={{fontWeight: 700, color: '#1e293b', fontSize:'1.2rem'}}>64.1%</span>
                  </div>
               </div>
             </div>
           </div>
        </div>

        {/* CARD 4: Attrition Rate */}
        <div className="rep-card">
           <div className="rep-card-header">
              <div className="rep-card-title-group">
                 <div className="rep-card-icon icon-red">📉</div>
                 <h2 className="rep-card-title">Attrition Rate</h2>
              </div>
              <div className="rep-card-exports">
                 <button className="rep-btn-export ex">▣ Excel</button>
                 <button className="rep-btn-export pd">📄 PDF</button>
              </div>
           </div>
           <div className="rep-metric-label">Monthly Attrition Rate</div>
           <div className="rep-metric-value">8%</div>
           <div className="rep-chart-area">
              <div className="bar-chart-container" style={{padding: '0 2%'}}>
                 {attritionBars.map((b, i) => (
                   <div className="bar-group" key={i}>
                      <span className="bar-value">{b.val}</span>
                      <div className="bar-column col-orange" style={{height: b.height}}></div>
                   </div>
                 ))}
              </div>
              <div className="x-axis-labels" style={{justifyContent: 'space-around', padding: '0 2%'}}>
                 {attritionBars.map((b, i) => <span key={i} className="x-label">{b.label}</span>)}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
