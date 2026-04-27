import Register from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import { useState, useEffect } from "react";
import './App.css';
import { useNotification } from './context/NotificationContext';

function App() {
  const { showNotification } = useNotification();
  // Load initial state from localStorage
  const [view, setView] = useState(localStorage.getItem("token") ? "dashboard" : "login");
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem("userData");
    return savedData ? JSON.parse(savedData) : { role: "", email: "", firstName: "", lastName: "" };
  });

  const handleLogin = (role, email, mustChangePassword, firstName, lastName) => {
    const userObj = { 
      role: role || "Employee", 
      email: email || "User", 
      firstName: firstName || "", 
      lastName: lastName || "" 
    };
    setUserData(userObj);
    localStorage.setItem("userData", JSON.stringify(userObj));

    if (mustChangePassword) {
      setView("changePassword");
    } else {
      setView("dashboard");
    }
  }

  const handleUpdateUserData = (newData) => {
    const updated = { ...userData, ...newData };
    setUserData(updated);
    localStorage.setItem("userData", JSON.stringify(updated));
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserData({ role: "", email: "" });
    setView("login");
  }

  const handlePasswordChanged = () => {
    showNotification("Password updated! Please log in with your new password.", "success");
    handleLogout();
  }

  return (
    <div className="App">
      {view === 'login' && <Login onLogin={handleLogin} goToRegister={() => setView('register')} />}
      {view === 'register' && <Register goToLogin={() => setView('login')} />}
      {view === 'changePassword' && <ChangePassword onPasswordChanged={handlePasswordChanged} onCancel={handleLogout} />}
      {view === 'dashboard' && <Dashboard userData={userData} onLogout={handleLogout} onUpdateUserData={handleUpdateUserData} />}
    </div>
  )
}

export default App;
