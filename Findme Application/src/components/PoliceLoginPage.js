import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PoliceLoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PoliceLoginPage = () => {
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

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;Secure;HttpOnly`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:8000/api/police_login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          if (formData.rememberMe) {
            setCookie('authToken', data.token, 7); // Set token for 7 days
            setCookie('user_email', formData.email, 7); // Set email for 7 days
          } else {
            setCookie('authToken', data.token, 1); // Set token for 1 day
            setCookie('user_email', formData.email, 1); // Set email for 1 day
          }
          alert('Login successful');
          navigate('/PoliceHomeWidget');
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Server error during login');
      }
    } else {
      if (validationErrors.email) alert(validationErrors.email);
      if (validationErrors.password) alert(validationErrors.password);
    }
  };

  return (
    <div className="police-login-page">
      <header className="police-login-header">
        <h1>Police Log In</h1>
      </header>
      <form className="police-login-form" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="police-errooor">{errors.email}</div>}
        </div>
        <div className="police-password-container admin-form-group">
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
            className="police-toggle-password"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && <div className="police-errooor">{errors.password}</div>}
        </div>
        <div className="police-checkbox-container police-form-group">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label>Remember me</label>
        </div>
        <button type="submit" className="police-login-button">
          Log In
        </button>
      </form>
    </div>
  );
};

export default PoliceLoginPage;
