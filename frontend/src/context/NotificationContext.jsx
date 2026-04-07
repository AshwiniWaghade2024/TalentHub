import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null); // { message, onConfirm, onCancel }

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, confirm }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="notification-container">
        {notifications.map((n) => (
          <div key={n.id} className={`notification-item ${n.type}`}>
            <div className="notification-content">
              {n.type === 'success' && <SuccessIcon />}
              {n.type === 'error' && <ErrorIcon />}
              {n.type === 'info' && <InfoIcon />}
              <span>{n.message}</span>
            </div>
            <button className="notification-close" onClick={() => setNotifications((prev) => prev.filter((notif) => notif.id !== n.id))}>
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-box confirm-box" style={{ maxWidth: '400px', animation: 'modalIn 0.2s ease-out' }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Confirmation Required</h3>
            <p style={{ color: '#475569', margin: '16px 0 24px', lineHeight: 1.5 }}>{confirmDialog.message}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={confirmDialog.onCancel} style={{ padding: '8px 16px' }}>Cancel</button>
              <button className="btn-primary" onClick={confirmDialog.onConfirm} style={{ padding: '8px 16px', background: '#3b82f6' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
