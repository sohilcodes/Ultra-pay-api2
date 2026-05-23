import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import UserDashboard from './pages/UserDashboard';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('up_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem('up_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('up_user');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginPage onLogin={login} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/login" element={!user ? <LoginPage onLogin={login} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/register" element={!user ? <RegisterPage onLogin={login} /> : <Navigate to="/dashboard" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminPanel user={user} onLogout={logout} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user && user.role !== 'admin' ? <UserDashboard user={user} onLogout={logout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
