import React, { useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = ({ allowedRoles }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Instructor', 'Student'] },
    { name: 'Instructors', path: '/instructors', roles: ['Student', 'Admin'] },
    { name: 'My Schedule', path: '/schedule', roles: ['Instructor'] },
    { name: 'Bookings', path: '/bookings', roles: ['Student', 'Admin'] },
    { name: 'Quizzes', path: '/quizzes', roles: ['Student', 'Admin'] },
    { name: 'Progress', path: '/progress', roles: ['Student'] },
    { name: 'Users', path: '/admin/users', roles: ['Admin'] },
    { name: 'Reports', path: '/admin/reports', roles: ['Admin'] },
  ];

  const filteredLinks = navLinks.filter(link => link.roles.includes(user.role));

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>DriveMaster</h2>
        </div>
        <nav className="sidebar-nav">
          {filteredLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`nav-link ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="main-header">
          <h1>{filteredLinks.find(link => location.pathname.startsWith(link.path))?.name || 'Dashboard'}</h1>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
