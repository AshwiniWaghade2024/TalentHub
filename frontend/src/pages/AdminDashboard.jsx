import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  CreditCard, 
  Trophy, 
  FileText, 
  Settings, 
  Bell, 
  ChevronRight, 
  ChevronLeft,
  TrendingUp, 
  Cloud, 
  Layers,
  LayoutDashboard,
  LogOut,
  Search,
  Plus,
  Mail,
  Key,
  Edit2,
  Trash2,
  DollarSign,
  UserCheck
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('HR Management');

  const hrUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', status: 'Active' },
    { id: 2, name: 'Michael Smith', email: 'michael.smith@company.com', status: 'Active' },
    { id: 3, name: 'Emma Davis', email: 'emma.davis@company.com', status: 'Pending' },
    { id: 4, name: 'David Lee', email: 'david.lee@company.com', status: 'Active' },
    { id: 5, name: 'Laura Wilson', email: 'laura.wilson@company.com', status: 'Pending' },
  ];

  const employees = [
    { id: 1, name: 'Sarah Johnson', dept: 'HR', role: 'HR Manager', email: 'sarah.johnson@compy.company.com', status: 'Active' },
    { id: 2, name: 'Michael Smith', dept: 'IT', role: 'Software Engineer', email: 'michael.smith@compy.company.com', status: 'Active' },
    { id: 3, name: 'Emma Davis', dept: 'Marketing', role: 'Marketing Specialist', email: 'emma.davis@company.company.com', status: 'Pending' },
    { id: 4, name: 'David Lee', dept: 'HR', role: 'HR Specialist', email: 'david.leee@companny.company.com', status: 'Active' },
    { id: 5, name: 'Laura Wilson', dept: 'Sales', role: 'Sales Associate', email: 'laura.wilson@company.company.com', status: 'Pending' },
  ];

  const hrPayroll = [
    { id: 1, name: 'Sarah Johnson', role: 'HR Manager', salary: 8500, deductions: 1100, net: 7400 },
    { id: 2, name: 'David Lee', role: 'HR Specialist', salary: 7200, deductions: 900, net: 6300 },
  ];

  const employeePayroll = [
    { id: 1, name: 'Michael Smith', role: 'Software Engineer', salary: 9000, deductions: 1500, net: 7500 },
    { id: 2, name: 'Emma Davis', role: 'Marketing Specialist', salary: 7600, deductions: 1000, net: 6600 },
    { id: 3, name: 'Laura Wilson', role: 'Sales Associate', salary: 10900, deductions: 1900, net: 9000 },
  ];

  const attendanceData = [
    { id: 1, name: 'Sarah Johnson', role: 'HR Manager', type: 'HR', status: 'Present', timeIn: '08:50 AM' },
    { id: 2, name: 'Michael Smith', role: 'Software Engineer', type: 'Employee', status: 'Present', timeIn: '09:05 AM' },
    { id: 3, name: 'Emma Davis', role: 'Marketing', type: 'Employee', status: 'On Leave', timeIn: '-' },
    { id: 4, name: 'David Lee', role: 'HR Specialist', type: 'HR', status: 'Absent', timeIn: '-' },
    { id: 5, name: 'Laura Wilson', role: 'Sales Associate', type: 'Employee', status: 'Present', timeIn: '08:55 AM' },
  ];

  const leaveRequests = [
    { id: 1, name: 'Diksha', date: '2026-04-02', status: 'Pending', type: 'Employee' },
    { id: 2, name: 'Ashwini', date: '2026-04-05', status: 'Approved', type: 'HR' },
    { id: 3, name: 'Emma Davis', date: '2026-04-06', status: 'Pending', type: 'Employee' }
  ];

  const totalPayout = [...hrPayroll, ...employeePayroll].reduce((s, r) => s + r.salary, 0);
  const totalDeductions = [...hrPayroll, ...employeePayroll].reduce((s, r) => s + r.deductions, 0);
  const totalNet = [...hrPayroll, ...employeePayroll].reduce((s, r) => s + r.net, 0);

  const chartData = [
    { month: 'Jan', hr: 15, emp: 22 },
    { month: 'Feb', hr: 18, emp: 25 },
    { month: 'Mar', hr: 12, emp: 20 },
    { month: 'Apr', hr: 20, emp: 28 },
    { month: 'May', hr: 16, emp: 23 },
    { month: 'Jun', hr: 22, emp: 30 },
  ];

  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <h1>TalentHub</h1>
        </div>
        
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'HR Management' ? 'active' : ''}`}
            onClick={() => setActiveTab('HR Management')}
          >
            <Users size={20} />
            <span>HR Management</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'Employee Directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('Employee Directory')}
          >
            <Users size={20} />
            <span>Employee Directory</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'Attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('Attendance')}
          >
            <Clock size={20} />
            <span>Attendance & Leaves</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'Payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('Payroll')}
          >
            <DollarSign size={20} />
            <span>Payroll</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('Settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-title">
            {activeTab === 'HR Management' ? (
              <h2>Create HR User</h2>
            ) : activeTab === 'Employee Directory' ? (
              <h2>Employee Directory</h2>
            ) : (
              <div className="header-search">
                <Search size={20} className="text-slate-400" />
                <input type="text" placeholder="Search anything..." />
              </div>
            )}
          </div>
          
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div className="user-profile">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
                alt="Profile" 
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">Admin</span>
              </div>
              <ChevronRight size={16} className="rotate-90" />
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          {activeTab === 'HR Management' && (
            <div className="hr-management-view">
              {/* Create HR User Form */}
              <div className="form-section glass-card">
                <div className="form-group-full">
                  <label>Email</label>
                  <div className="input-with-icon">
                    <input type="email" placeholder="Enter email address" />
                  </div>
                </div>
                
                <div className="form-actions-inline">
                  <button className="btn-secondary">Generate Temporary Password</button>
                </div>
                
                <div className="form-buttons">
                  <button className="btn-primary">Create User</button>
                  <button className="btn-outline">Cancel</button>
                </div>
              </div>

              {/* HR Users Table */}
              <div className="table-section glass-card">
                <div className="table-header">
                  <h3>HR Users</h3>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hrUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`status-badge ${user.status.toLowerCase()}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="action-btn edit"><Edit2 size={16} /></button>
                              <button className="action-btn delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="pagination">
                  <button className="pagination-btn"><ChevronLeft size={18} /> Previous</button>
                  <div className="page-info">
                    <span className="current-page">1 of 2</span>
                  </div>
                  <button className="pagination-btn active">Next <ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Employee Directory' && (
            <div className="employee-directory-view animate-fade-in">
              {/* Filters & Search */}
              <div className="directory-controls glass-card">
                <div className="controls-row">
                  <div className="filter-group">
                    <label>Department</label>
                    <div className="select-wrapper">
                      <select>
                        <option>All Departments</option>
                        <option>HR</option>
                        <option>IT</option>
                        <option>Marketing</option>
                        <option>Sales</option>
                      </select>
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                  <div className="filter-group">
                    <label>Role</label>
                    <div className="select-wrapper">
                      <select>
                        <option>All Roles</option>
                        <option>Manager</option>
                        <option>Engineer</option>
                        <option>Specialist</option>
                        <option>Associate</option>
                      </select>
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="search-row">
                  <div className="search-input-group icon-only">
                    <Search size={20} className="text-slate-400" />
                    <input type="text" placeholder="Search employees..." />
                  </div>
                </div>
              </div>

              {/* Employees Table */}
              <div className="table-section glass-card">
                <div className="table-container">
                  <table className="data-table directory-table">
                    <thead>
                      <tr>
                        <th>Profile Picture</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => (
                        <tr key={emp.id}>
                          <td className="profile-pic-cell">
                            <div className="profile-avatar">
                              <Users size={20} className="text-slate-400" />
                            </div>
                          </td>
                          <td className="font-semibold">{emp.name}</td>
                          <td>{emp.dept}</td>
                          <td>{emp.role}</td>
                          <td>{emp.email}</td>
                          <td>
                            <div className="status-cell">
                              <span className={`status-badge ${emp.status.toLowerCase()}`}>
                                {emp.status}
                              </span>
                              <span className="text-slate-400 text-xs ml-2">{emp.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="pagination">
                  <button className="pagination-btn"><ChevronLeft size={18} /> Previous</button>
                  <div className="page-info">
                    <span className="current-page">1 of 2</span>
                  </div>
                  <button className="pagination-btn active">Next <ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Attendance' && (
            <div className="attendance-view animate-fade-in">
              {/* Overall Attendance Stats */}
              <div className="dashboard-grid-3">
                <div className="stat-card glass-card">
                  <div className="stat-info">
                    <label>Total Present Today</label>
                    <h3>{attendanceData.filter(a => a.status === 'Present').length}</h3>
                  </div>
                  <div className="stat-icon green">
                    <UserCheck size={24} />
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-info">
                    <label>Total Absent Today</label>
                    <h3>{attendanceData.filter(a => a.status === 'Absent').length}</h3>
                  </div>
                  <div className="stat-icon red">
                    <Users size={24} />
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-info">
                    <label>On Leave Today</label>
                    <h3>{attendanceData.filter(a => a.status === 'On Leave').length}</h3>
                  </div>
                  <div className="stat-icon orange">
                    <Clock size={24} />
                  </div>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="table-section glass-card mt-6">
                <div className="table-header flex justify-between items-center mb-4">
                  <h3>Today's Attendance (HR & Employees)</h3>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Staff Type</th>
                        <th>Status</th>
                        <th>Time In</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map(record => (
                        <tr key={record.id}>
                          <td className="font-semibold">{record.name}</td>
                          <td>{record.role}</td>
                          <td>
                            <span className={`status-badge ${record.type === 'HR' ? 'active' : 'pending'}`}>
                              {record.type}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${
                              record.status === 'Present' ? 'active' : 
                              record.status === 'Absent' ? 'red' : 'pending'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="text-slate-400">{record.timeIn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Leave Requests Table */}
              <div className="table-section glass-card mt-6">
                <div className="table-header mb-4">
                  <h3>Leave Requests</h3>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Staff Type</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map(leave => (
                        <tr key={leave.id}>
                          <td className="font-semibold">{leave.name}</td>
                          <td>
                            <span className={`status-badge ${leave.type === 'HR' ? 'active' : 'pending'}`}>
                              {leave.type}
                            </span>
                          </td>
                          <td>{leave.date}</td>
                          <td>
                            <span className={`status-badge ${leave.status.toLowerCase()}`}>
                              {leave.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions justify-center gap-2">
                              {leave.status === 'Pending' ? (
                                <>
                                  <button className="btn-primary text-xs py-1 px-3">Approve</button>
                                  <button className="btn-outline text-xs py-1 px-3">Reject</button>
                                </>
                              ) : (
                                <span className="text-slate-400 text-sm">Actioned</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Payroll' && (
            <div className="payroll-view animate-fade-in">
              {/* Header */}
              <div className="payroll-header">
                <div>
                  <h2 className="payroll-title">Payroll Summary</h2>
                  <p className="payroll-subtitle">April 2024 &nbsp;<span className="payroll-period">Period 2.008</span></p>
                </div>
                <button className="btn-run-payroll">Run Payroll</button>
              </div>

              {/* Summary Cards */}
              <div className="payroll-cards">
                <div className="payroll-card blue">
                  <p className="payroll-card-label">Total Payout</p>
                  <h3 className="payroll-card-value">${totalPayout.toLocaleString()}</h3>
                </div>
                <div className="payroll-card red">
                  <p className="payroll-card-label">Total Deductions</p>
                  <h3 className="payroll-card-value">${totalDeductions.toLocaleString()}</h3>
                </div>
                <div className="payroll-card green">
                  <p className="payroll-card-label">Net Salary</p>
                  <h3 className="payroll-card-value">${totalNet.toLocaleString()}</h3>
                </div>
              </div>

              {/* HR Staff Payroll Table */}
              <div className="payroll-table-section glass-card">
                <div className="payroll-table-header">
                  <h3>HR Staff</h3>
                  <div className="payroll-pagination-mini">
                    <button className="pag-mini-btn"><ChevronLeft size={14} /></button>
                    <span>1</span>
                    <button className="pag-mini-btn"><ChevronRight size={14} /></button>
                  </div>
                </div>
                <div className="table-container">
                  <table className="data-table payroll-data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Salary</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hrPayroll.map(p => (
                        <tr key={p.id}>
                          <td className="font-semibold">{p.name}</td>
                          <td className="text-slate-400">{p.role}</td>
                          <td>${p.salary.toLocaleString()}</td>
                          <td>${p.deductions.toLocaleString()}</td>
                          <td className="net-salary">${p.net.toLocaleString()}</td>
                          <td>
                            <div className="payroll-actions">
                              <button className="btn-payslip">Generate Payslip</button>
                              <button className="action-btn edit"><FileText size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Employees Payroll Table */}
              <div className="payroll-table-section glass-card">
                <div className="payroll-table-header">
                  <h3>Employees</h3>
                  <div className="payroll-pagination-mini">
                    <button className="pag-mini-btn"><ChevronLeft size={14} /></button>
                    <span>1</span>
                    <button className="pag-mini-btn"><ChevronRight size={14} /></button>
                  </div>
                </div>
                <div className="table-container">
                  <table className="data-table payroll-data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Salary</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeePayroll.map(p => (
                        <tr key={p.id}>
                          <td className="font-semibold">{p.name}</td>
                          <td className="text-slate-400">{p.role}</td>
                          <td>${p.salary.toLocaleString()}</td>
                          <td>${p.deductions.toLocaleString()}</td>
                          <td className="net-salary">${p.net.toLocaleString()}</td>
                          <td>
                            <div className="payroll-actions">
                              <button className="btn-payslip">Generate Payslip</button>
                              <button className="action-btn edit"><FileText size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payroll Bar Chart */}
              <div className="payroll-chart-card glass-card">
                <div className="chart-header">
                  <h3>Monthly Payroll Overview</h3>
                  <div className="chart-legend">
                    <span className="legend-dot blue"></span><span>HR Staff</span>
                    <span className="legend-dot red" style={{marginLeft:'1rem'}}></span><span>Employees</span>
                  </div>
                </div>
                <div className="payroll-bar-chart">
                  {chartData.map(d => {
                    const maxVal = 30;
                    return (
                      <div key={d.month} className="bar-group">
                        <div className="bar-pair">
                          <div className="bar-col hr-bar" style={{height: `${(d.hr/maxVal)*120}px`}} title={`HR: ${d.hr}k`}></div>
                          <div className="bar-col emp-bar" style={{height: `${(d.emp/maxVal)*120}px`}} title={`Emp: ${d.emp}k`}></div>
                        </div>
                        <span className="bar-label">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="settings-view animate-fade-in">
              {/* Page Title */}
              <h2 className="settings-page-title">Settings</h2>

              {/* Profile Settings */}
              <div className="settings-section glass-card">
                <h3 className="settings-section-title">Profile Settings</h3>
                <div className="settings-profile-row">
                  <div className="settings-field">
                    <label>Name</label>
                    <input type="text" defaultValue="James Admin" />
                  </div>
                  <div className="settings-field">
                    <label>Email</label>
                    <input type="email" defaultValue="james.admin@company.com" />
                  </div>
                </div>

                {/* Change Password */}
                <div className="change-password-card">
                  <h4>Change Password</h4>
                  <div className="password-fields">
                    <div className="settings-field">
                      <label>Current Password</label>
                      <input type="password" placeholder="Current Password" />
                    </div>
                    <div className="settings-field">
                      <label>New Password</label>
                      <input type="password" placeholder="New Password" />
                    </div>
                    <div className="settings-field">
                      <label>Confirm Password</label>
                      <input type="password" placeholder="Confirm New Password" />
                    </div>
                  </div>
                  <div className="settings-actions">
                    <button className="btn-primary">Update Password</button>
                    <button className="btn-outline">Cancel</button>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div className="settings-section glass-card">
                <h3 className="settings-section-title">System Settings</h3>
                <div className="system-settings-grid">
                  {/* Notification Preferences */}
                  <div className="system-setting-card">
                    <div className="system-setting-header">
                      <Bell size={20} className="system-setting-icon" />
                      <span className="system-setting-label">Notification Preferences</span>
                    </div>
                    <p className="system-setting-desc">Would you like to receive email notifications?</p>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                      <span className="toggle-text">Enabled</span>
                    </label>
                  </div>

                  {/* Theme Selection */}
                  <div className="system-setting-card">
                    <div className="system-setting-header">
                      <Settings size={20} className="system-setting-icon" />
                      <span className="system-setting-label">Theme Selection</span>
                    </div>
                    <div className="theme-btn-group">
                      <button className="theme-btn">Light</button>
                      <button className="theme-btn active">Dark</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Dashboard' && (
            <div className="default-dashboard-view animate-fade-in">
              {/* Header with Title and Buttons */}
              <div className="content-header">
                <h2>Admin Dashboard</h2>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-primary">Generate Payslip</button>
                  <button className="btn-primary">Approve Leave</button>
                </div>
              </div>

              {/* 4 Top Cards */}
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
                <div className="stat-card glass-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                  <label style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Total Employees</label>
                  <h3 style={{ fontSize: '2.5rem', margin: 0 }} className="text-blue">12</h3>
                </div>
                <div className="stat-card glass-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                  <label style={{ fontSize: '1rem', margin: 0 }}>Active Employees</label>
                  <h3 style={{ fontSize: '2.5rem', margin: 0 }} className="text-blue">10</h3>
                </div>
                <div className="stat-card glass-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                  <label style={{ fontSize: '1rem', margin: 0 }}>Inactive Employees</label>
                  <h3 style={{ fontSize: '2.5rem', margin: 0 }} className="text-blue">2</h3>
                </div>
                <div className="stat-card glass-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                  <label style={{ fontSize: '1rem', margin: 0 }}>Departments</label>
                  <h3 style={{ fontSize: '2.5rem', margin: 0 }} className="text-blue">5</h3>
                </div>
              </div>

              {/* Attendance Today Section */}
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Attendance Today</h3>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div className="stat-card glass-card" style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <label style={{ fontSize: '1rem', margin: 0 }}>Present</label>
                    <h3 style={{ fontSize: '2rem', margin: 0 }} className="text-blue">9</h3>
                  </div>
                  <div className="stat-card glass-card" style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <label style={{ fontSize: '1rem', margin: 0 }}>Absent</label>
                    <h3 style={{ fontSize: '2rem', margin: 0 }} className="text-blue">1</h3>
                  </div>
                  <div className="stat-card glass-card" style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <label style={{ fontSize: '1rem', margin: 0 }}>On Leave</label>
                    <h3 style={{ fontSize: '2rem', margin: 0 }} className="text-blue">2</h3>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
                {/* Department Distribution */}
                <div className="chart-card glass-card">
                  <div className="chart-header" style={{ marginBottom: '1rem' }}>
                    <h3>Department Distribution</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '16px', height: '6px', background: '#3b82f6' }}></div> Engineering</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '16px', height: '6px', background: '#ec4899' }}></div> HR</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '16px', height: '6px', background: '#eab308' }}></div> Sales</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '16px', height: '6px', background: '#14b8a6' }}></div> Marketing</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                    <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: 'conic-gradient(#ec4899 0% 15%, #eab308 15% 25%, #3b82f6 25% 70%, #14b8a6 70% 100%)' }}></div>
                  </div>
                </div>

                {/* Employee Growth */}
                <div className="chart-card glass-card">
                  <div className="chart-header border-b-none" style={{ marginBottom: '1.5rem' }}>
                    <h3>Employee Growth</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div style={{ width: '24px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></div>
                      Employees
                    </div>
                  </div>
                  
                  <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'flex-end', paddingLeft: '30px', borderLeft: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <span style={{ position: 'absolute', left: '-25px', top: '0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>3.0</span>
                    <span style={{ position: 'absolute', left: '-25px', top: '25%', fontSize: '0.75rem', color: 'var(--text-muted)' }}>2.5</span>
                    <span style={{ position: 'absolute', left: '-25px', top: '50%', fontSize: '0.75rem', color: 'var(--text-muted)' }}>2.0</span>
                    <span style={{ position: 'absolute', left: '-25px', top: '75%', fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.5</span>
                    <span style={{ position: 'absolute', left: '-25px', bottom: '0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.0</span>
                    
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                      <path d="M0,25 L100,25 M0,50 L100,50 M0,75 L100,75" fill="none" stroke="var(--border-color)" strokeWidth="1" />
                      <path d="M0,100 L20,33 L40,33 L60,33 L80,33 L100,0" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                      <circle cx="20" cy="33" r="1.5" fill="#3b82f6" />
                      <circle cx="40" cy="33" r="1.5" fill="#3b82f6" />
                      <circle cx="60" cy="33" r="1.5" fill="#3b82f6" />
                      <circle cx="80" cy="33" r="1.5" fill="#3b82f6" />
                      <circle cx="100" cy="0" r="1.5" fill="#3b82f6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Leave Requests Table */}
              <div className="table-section glass-card" style={{ marginBottom: '1.5rem' }}>
                <div className="table-header">
                  <h3>Leave Requests</h3>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-semibold">Diksha</td>
                        <td>2026-04-02</td>
                        <td>Pending</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Ashwini</td>
                        <td>2026-04-05</td>
                        <td>Approved</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Activities</h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '2', color: 'var(--text-secondary)' }}>
                  <li>Employee Vedant added to Engineering</li>
                  <li>Employee Gaurav added to</li>
                  <li>Employee Vina added to</li>
                  <li>Employee Yugandhara added to</li>
                  <li>Employee dggb added to</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        <footer className="portal-footer">
          <p>Portal version 1.0.2 - {new Date().toLocaleDateString()}</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
