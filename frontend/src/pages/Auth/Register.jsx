import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student', // Default role
    phone: '',
    licenseType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { password, phone, licenseType, role } = formData;

    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least 1 uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least 1 lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least 1 number.';
    }
    if (!/^\d{10}$/.test(phone)) {
      return 'Phone number must contain exactly 10 digits (numbers only, no spaces or hyphens).';
    }
    if (role === 'Student' && !licenseType) {
      return 'Please select a license type.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      <Card className="auth-card animate-fade-in glass">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join the best driving school management platform</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label className="input-label">I am a...</label>
            <select 
              name="role" 
              className="input-field"
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <Input 
            label="Full Name" 
            name="name"
            type="text" 
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input 
            label="Email Address" 
            name="email"
            type="email" 
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input 
            label="Password" 
            name="password"
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className="input-hint">Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number.</p>
          
          <Input 
            label="Phone Number" 
            name="phone"
            type="tel" 
            placeholder="1234567890"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <p className="input-hint">Must contain 10 digits. Numbers only (no spaces or hyphens).</p>

          {formData.role === 'Student' && (
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label className="input-label">License Type</label>
              <select 
                name="licenseType" 
                className="input-field"
                value={formData.licenseType} 
                onChange={handleChange}
                required
              >
                <option value="">Select License Type</option>
                <option value="Light Vehicle">Light Vehicle</option>
                <option value="Heavy Vehicle">Heavy Vehicle</option>
              </select>
            </div>
          )}

          <div className="auth-actions">
            <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
              Create Account
            </Button>
          </div>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
