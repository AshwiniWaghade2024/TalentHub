import Register from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import Employee from "./pages/Employee";
import './App.css';

function App() {
  const [view, setView] = useState("login");
  const [userData, setUserData] = useState({ role: "", email: "" });

  const handleLogin = (role, email) => {
    setUserData({ role: role || "Employee", email: email || "Employee" });
    setView("dashboard");
  }

  return (
    <div className="App">
      {view === 'login' && <Login onLogin={handleLogin} goToRegister={() => setView('register')} />}
      {view === 'register' && <Register goToLogin={() => setView('login')} />}
      {view === 'dashboard' && <Dashboard userData={userData} onLogout={() => setView('login')} />}
    </div>
  )
}

export default App;
