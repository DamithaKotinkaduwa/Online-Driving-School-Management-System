import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Placeholder Pages
const Home = () => (
  <div className="container flex-center" style={{height: '100vh', flexDirection: 'column', gap: '20px'}}>
    <h1>Welcome to Driving School</h1>
    <div style={{display: 'flex', gap: '10px'}}>
      <a href="/login" className="btn btn-primary">Login</a>
      <a href="/register" className="btn btn-outline">Register</a>
    </div>
  </div>
);
const Dashboard = () => <div className="container flex-center" style={{height: '100vh'}}><h2>Dashboard Placeholder</h2></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
