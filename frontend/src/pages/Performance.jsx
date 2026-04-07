import React, { useState, useEffect } from 'react';
import './Performance.css';
import { useNotification } from '../context/NotificationContext';

export default function Performance({ userData }) {
  const { showNotification } = useNotification();
  const role = userData?.role || 'Employee';
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    employeeId: '',
    kpi: '',
    rating: 5,
    feedbackText: '',
    promotionRecommendation: 'Yes'
  });

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'month', 'range'
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterRange, setFilterRange] = useState({ start: '', end: '' });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);

  const fetchReviews = async () => {
    setLoading(true);
    const endpoint = (role === 'Admin' || role === 'HR') ? "/api/feedback/all" : "/api/feedback/my-feedback";
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) setReviews(data);
    } catch (err) { console.error("Fetch reviews failed:", err); }
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
    fetchReviews();
    fetchEmployees();
  }, [role]);

  const handleSubmitReview = async () => {
    if (!newReview.employeeId || !newReview.feedbackText) return showNotification("Please fill details", "info");
    try {
      const response = await fetch(`http://localhost:8080/api/feedback/submit/${newReview.employeeId}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            kpi: newReview.kpi,
            rating: newReview.rating,
            feedbackText: newReview.feedbackText,
            promotionRecommendation: newReview.promotionRecommendation
        })
      });
      if (response.ok) {
        showNotification("Review submitted successfully!", "success");
        setShowModal(false);
        fetchReviews();
      } else {
        showNotification("Submission failed", "error");
      }
    } catch (err) { showNotification("Connection failed", "error"); }
  };

  const renderStars = (count) => {
     let stars = [];
     for(let i=1; i<=5; i++) {
        stars.push(<span key={i} style={{color: i <= count ? '#facc15' : '#cbd5e1', fontSize: '1.2rem'}}>★</span>);
     }
     return stars;
  };

  const filteredReviews = reviews.filter(res => {
    // Filter by name
    const fullName = `${res.employee?.firstName || ''} ${res.employee?.lastName || ''}`.toLowerCase();
    const matchesName = fullName.includes(searchTerm.toLowerCase());
    
    // Filter by date
    const reviewDate = new Date(res.feedbackDate);
    let matchesDate = true;
    
    if (filterType === 'month') {
      matchesDate = reviewDate.getFullYear() === parseInt(filterYear) && reviewDate.getMonth() === parseInt(filterMonth);
    } else if (filterType === 'range' && filterRange.start && filterRange.end) {
      const start = new Date(filterRange.start);
      const end = new Date(filterRange.end);
      // Set hours to 0 to compare dates accurately
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      matchesDate = reviewDate >= start && reviewDate <= end;
    }
    
    return matchesName && matchesDate;
  });

  return (
    <div className="perf-page">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{maxWidth: '500px'}}>
            <h2>New Performance Review</h2>
            <div className="modal-field">
              <label>Employee</label>
              <select value={newReview.employeeId} onChange={e => setNewReview({...newReview, employeeId: e.target.value})}>
                <option value="">Select Employee</option>
                {employees.filter(e => e.email !== userData?.email).map(e => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName} (#{e.id})</option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label>KPI Score (%)</label>
              <input type="text" placeholder="e.g. 95%" value={newReview.kpi} onChange={e => setNewReview({...newReview, kpi: e.target.value})} />
            </div>
            <div className="modal-field">
              <label>Rating (1-5 Stars)</label>
              <input type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})} />
            </div>
            <div className="modal-field">
              <label>Promotion Recommendation</label>
              <select value={newReview.promotionRecommendation} onChange={e => setNewReview({...newReview, promotionRecommendation: e.target.value})}>
                <option>Yes</option><option>Maybe</option><option>No</option>
              </select>
            </div>
            <div className="modal-field">
                <label>Feedback Comments</label>
                <textarea rows="4" value={newReview.feedbackText} onChange={e => setNewReview({...newReview, feedbackText: e.target.value})}></textarea>
            </div>
            <div className="modal-actions">
               <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
               <button className="btn-primary" onClick={handleSubmitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

      <div className="pf-header">
        <h1 className="pf-title">{role === 'Employee' ? 'My Performance Reviews' : 'Performance Review'}</h1>
        {(role === 'HR' || role === 'Admin') && <button className="pf-btn-primary" onClick={() => setShowModal(true)}>+ Start New Review</button>}
      </div>

      <div className="pf-card">
        <div className="pf-toolbar">
          <div className="pf-filter-group">
            <select 
              className="pf-select" 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">By Month</option>
              <option value="range">Date Range</option>
            </select>

            {filterType === 'month' && (
              <div className="pf-month-group">
                <select 
                  className="pf-select-small" 
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  {months.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
                </select>
                <select 
                  className="pf-select-small" 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            {filterType === 'range' && (
              <div className="pf-range-inputs">
                <input 
                  type="date" 
                  className="pf-date-input" 
                  value={filterRange.start}
                  onChange={(e) => setFilterRange({...filterRange, start: e.target.value})}
                />
                <span className="pf-range-sep">to</span>
                <input 
                  type="date" 
                  className="pf-date-input" 
                  value={filterRange.end}
                  onChange={(e) => setFilterRange({...filterRange, end: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="pf-search-wrapper">
             <span className="pf-icon-search">🔍</span>
             <input 
               type="text" 
               className="pf-search" 
               placeholder="Search by name..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div style={{flex: 1}}></div>
          <button className="pf-btn-outline" onClick={fetchReviews}>Refresh</button>
        </div>

        <table className="pf-table">
          <thead>
            <tr>
              <th>Employee ⇕</th>
              <th>Date ⇕</th>
              <th>KPI Score ⇕</th>
              <th>Feedback Comments</th>
              <th>Rating</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((row, i) => (
              <tr key={i}>
                <td>
                    <div className="emp-name-cell" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <img src={`https://ui-avatars.com/api/?name=${row.employee?.firstName || 'User'}&background=random`} className="pf-avatar" />
                        <span>{row.employee?.firstName} {row.employee?.lastName}</span>
                    </div>
                </td>
                <td style={{color: '#64748b'}}>{new Date(row.feedbackDate).toLocaleDateString('en-GB')}</td>
                <td style={{fontWeight: 600, color: '#1e293b'}}>{row.kpi || "--"}</td>
                <td style={{color: '#475569', fontSize: '0.9rem', maxWidth: '300px'}}>{row.feedbackText}</td>
                <td><div style={{display: 'flex', gap: '2px'}}>{renderStars(row.rating)}</div></td>
                <td>
                  <span className={`pf-badge pf-badge-${row.promotionRecommendation === 'Yes' ? 'success' : row.promotionRecommendation === 'Maybe' ? 'warning' : 'danger'}`}>
                    {row.promotionRecommendation}
                  </span>
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && !loading && <tr><td colSpan="6" style={{textAlign:'center', padding: '24px', color: '#94a3b8'}}>No performance reviews found matching your criteria</td></tr>}
            {loading && <tr><td colSpan="6" style={{textAlign:'center', padding: '24px', color: '#94a3b8'}}>Loading records...</td></tr>}
          </tbody>
        </table>
      </div>


    </div>
  );
}
