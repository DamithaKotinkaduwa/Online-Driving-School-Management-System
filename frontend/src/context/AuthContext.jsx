import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// ── Sample users (no backend needed) ──────────────────────────────────────────
const MOCK_USERS = [
  { id: '1', name: 'Admin User',       email: 'admin@drive.com',      password: 'admin123',      role: 'Admin',      token: 'mock-admin-token' },
  { id: '2', name: 'Sarah Johnson',    email: 'instructor@drive.com', password: 'instructor123', role: 'Instructor', token: 'mock-instructor-token' },
  { id: '3', name: 'John Student',     email: 'student@drive.com',    password: 'student123',    role: 'Student',    token: 'mock-student-token' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (e) { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const found = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Invalid email or password' };
    }
    const { password: _pw, ...userData } = found;
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user',  JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const register = async (formData) => {
    const exists = MOCK_USERS.find(u => u.email === formData.email);
    if (exists) return { success: false, message: 'Email already in use.' };
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      token: 'mock-token-' + Date.now(),
    };
    MOCK_USERS.push({ ...newUser, password: formData.password });
    localStorage.setItem('token', newUser.token);
    localStorage.setItem('user',  JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
