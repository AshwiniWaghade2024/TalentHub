import React from 'react';
import './Performance.css';

export default function Performance({ userData }) {
  const role = userData?.role || 'Employee';

  const perfData = [
    { empId: "E001", reviewerImg: "https://i.pravatar.cc/150?img=11", reviewerName: "John Admin", reviewerId: "D106", kpi: "92%", feedback: "Outstanding performance, exceeded expectations.", ratingStars: 5, ratingNum: "5.0", promo: "Yes", promoColor: "success" },
    { empId: "E002", reviewerImg: "https://i.pravatar.cc/150?img=12", reviewerName: "Michael Brown", reviewerId: "D106", kpi: "85%", feedback: "Great job, minor improvements needed.", ratingStars: 4, ratingNum: "4.4", promo: "Maybe", promoColor: "warning" },
    { empId: "E003", reviewerImg: "https://i.pravatar.cc/150?img=12", reviewerName: "Michael Brown", reviewerId: "D106", kpi: "85%", feedback: "High attention directed improvement.", ratingStars: 4, ratingNum: "4.5", promo: "Yes", promoColor: "success" },
    { empId: "E004", reviewerImg: "https://i.pravatar.cc/150?img=5", reviewerName: "Raj Sharma", reviewerId: "D004", kpi: "82%", feedback: "Challenging timeframe, strong improvements.", ratingStars: 4, ratingNum: "4.4", promo: "Maybe", promoColor: "warning" },
    { empId: "E005", reviewerImg: "https://i.pravatar.cc/150?img=9", reviewerName: "Lisa Wong", reviewerId: "D106", kpi: "82%", feedback: "Positive work. Staff strong expectations.", ratingStars: 4, ratingNum: "4.3", promo: "Yes", promoColor: "success" },
    { empId: "E006", reviewerImg: "https://i.pravatar.cc/150?img=14", reviewerName: "David Kim", reviewerId: "D007", kpi: "71%", feedback: "Very strategic, speedy year. In job-match.", ratingStars: 3, ratingNum: "3.4", promo: "No", promoColor: "danger" },
    { empId: "E007", reviewerImg: "https://i.pravatar.cc/150?img=15", reviewerName: "James Lee", reviewerId: "D008", kpi: "69%", feedback: "Smartification. Multiple challenges met.", ratingStars: 3, ratingNum: "4.2", promo: "Yes", promoColor: "success" },
    { empId: "E008", reviewerImg: "https://i.pravatar.cc/150?img=15", reviewerName: "James Lee", reviewerId: "D006", kpi: "63%", feedback: "Overachieving timeline, promotion advised.", ratingStars: 4, ratingNum: "5.2", promo: "No", promoColor: "danger" },
  ];

  if (role === 'Employee') {
    return (
      <div className="perf-page">
        <div className="pf-header">
           <h1 className="pf-title">My Performance Reviews</h1>
        </div>
        <div className="pf-card" style={{padding: '40px', textAlign: 'center', color: '#64748b'}}>
          <div style={{fontSize: '3rem', marginBottom: '16px'}}>🔒</div>
          <h2>Review In Progress</h2>
          <p>Your performance review for this cycle has not been published yet. Please check back later.</p>
        </div>
      </div>
    );
  }

  const renderStars = (count) => {
     let stars = [];
     for(let i=0; i<5; i++) {
        stars.push(<span key={i} style={{color: i < count ? '#facc15' : '#cbd5e1', fontSize: '1.1rem'}}>★</span>);
     }
     return stars;
  };

  return (
    <div className="perf-page">
      <div className="pf-header">
        <h1 className="pf-title">Performance Review</h1>
        <button className="pf-btn-primary">+ Start New Review</button>
      </div>

      <div className="pf-card">
        <div className="pf-toolbar">
          <select className="pf-select"><option>Review Cycle v</option></select>
          <div className="pf-search-wrapper">
             <span className="pf-icon-search">🔍</span>
             <input type="text" className="pf-search" placeholder="Search by employee or reviewer ID" />
          </div>
          <select className="pf-select"><option>All Departments v</option></select>
          <div style={{flex: 1}}></div>
          <button className="pf-btn-outline">Y Filter v</button>
        </div>

        <table className="pf-table">
          <thead>
            <tr>
              <th>Employee ID ⇕</th>
              <th>Reviewer ID ⇕</th>
              <th>KPI Score ⇕</th>
              <th>Feedback Comments</th>
              <th>Rating ⇕</th>
              <th>Rating ⇕</th>
              <th>Promotion Recomm</th>
            </tr>
          </thead>
          <tbody>
            {perfData.map((row, i) => (
              <tr key={i}>
                <td style={{color: '#3b82f6', fontWeight: 600}}>{row.empId}</td>
                <td>
                  <div className="emp-name-cell" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <img src={row.reviewerImg} alt={row.reviewerName} className="pf-avatar" />
                    <span style={{lineHeight: 1.2, fontWeight: 600, color: '#1e293b'}}>
                      {row.reviewerName}<br/>
                      <span style={{fontWeight: 400, color: '#64748b', fontSize: '13px'}}>{row.reviewerId}</span>
                    </span>
                  </div>
                </td>
                <td style={{fontWeight: 500}}>{row.kpi}</td>
                <td style={{color: '#475569', fontSize: '0.9rem'}}>{row.feedback}</td>
                <td><div style={{display: 'flex', gap: '2px'}}>{renderStars(row.ratingStars)}</div></td>
                <td style={{fontWeight: 600, color: '#475569'}}>{row.ratingNum} <span style={{color: '#facc15'}}>★</span></td>
                <td>
                  <span className={`pf-badge pf-badge-${row.promoColor}`}>
                    {row.promoColor === 'success' && '✓'} 
                    {row.promoColor === 'warning' && '◯'} 
                    {row.promoColor === 'danger' && '✕'} 
                    {' '}{row.promo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pf-footer">
          <span style={{color: '#64748b', fontSize: '0.95rem'}}>Showing 1 to 8 of 36 entries</span>
          <div className="pf-pagination">
            <button className="pf-page-btn">Previous</button>
            <button className="pf-page-num active">1</button>
            <button className="pf-page-num">2</button>
            <button className="pf-page-num">3</button>
            <button className="pf-page-num">4</button>
            <span style={{color: '#94a3b8', padding: '0 4px'}}>...</span>
            <button className="pf-page-btn" style={{background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px'}}>Next v</button>
          </div>
        </div>
      </div>

      <div className="pf-bottom-cards">
        <div className="pf-card pf-info-card">
           <div className="pf-info-icon" style={{color: '#3b82f6'}}>👥</div>
           <div className="pf-info-content">
              <h3>360° Feedback</h3>
              <p>Gather input from managers, colleagues, and direct reports.</p>
           </div>
           <div className="pf-info-arrow">&gt;</div>
        </div>
        <div className="pf-card pf-info-card">
           <div className="pf-info-icon" style={{color: '#3b82f6'}}>📅</div>
           <div className="pf-info-content">
              <h3>Review Cycles</h3>
              <p>Automate and track quarterly, yearly employee review cycles.</p>
           </div>
           <div className="pf-info-arrow">&gt;</div>
        </div>
      </div>
    </div>
  );
}
