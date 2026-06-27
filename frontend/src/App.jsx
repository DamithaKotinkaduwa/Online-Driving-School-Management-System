import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import InstructorListing from './pages/Instructors/InstructorListing';
import Bookings from './pages/Bookings/Bookings';
import Quizzes from './pages/Quizzes/Quizzes';
import AdminUsers from './pages/Admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/instructors" element={<InstructorListing />} />
            <Route path="/schedule" element={<Bookings />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/progress" element={<div>Progress coming soon</div>} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/reports" element={<div>Reports coming soon</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
