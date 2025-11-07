import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8000/api/admin-login/', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,  // Ensure cookies are sent and received
        });

        if (response.data.success) {
          // Store CSRF token for future requests
          axios.defaults.headers.common['X-CSRFToken'] = response.data.csrf_token;
          alert('Login successful');  // Success alert
          navigate('/AdminHomeWidget');  // Navigate to AdminHomeWidget on successful login
        } else {
          setErrors({ form: response.data.error });
          alert('Login failed: ' + response.data.error);  // Error alert
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrors({ form: '' });
        alert('Login failed: Please try again.');  // Error alert
      }
    }
  };

  return (
    <div className="admin-login-page">
      <header className="admin-login-header">
        <h1>Admin Log In</h1>
      </header>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        {errors.form && <div className="admin-errzoor">{errors.form}</div>}
        <div className="admin-form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="admin-errzoor">{errors.email}</div>}
        </div>
        <div className="admin-password-container admin-form-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="admin-toggle-password"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && <div className="admin-errzoor">{errors.password}</div>}
        </div>
        <div className="admin-checkbox-container admin-form-group">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label>Remember me</label>
        </div>
        <button type="submit" className="admin-login-button">Log In</button>
        <div className="admin-links-container">
          <span> Keep your Password safe and do not disclose to anyone </span>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;
