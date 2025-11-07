import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CitizenLoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CitizenLoginPage = () => {
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
  
    // Proceed only if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Send login request to the backend
        const response = await axios.post('http://localhost:8000/api/login/', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
  
        // If login is successful
        if (response.data.success) {
          alert(response.data.success); // Show success message
          navigate('/CitizenHomeWidget'); // Navigate to the dashboard
        } else {
          // If the backend returns an error, display it specifically
          setErrors({ form: response.data.error });
          alert('Login failed: ' + response.data.error); // Display backend-specific error
        }
      } catch (error) {
        console.error('Error during login:', error);
  
        // Check if the error response contains a message from the backend
        if (error.response && error.response.data && error.response.data.error) {
          setErrors({ form: error.response.data.error });
          alert('Login failed: ' + error.response.data.error); // Display backend error message
        } else {
          setErrors({ form: 'An unexpected error occurred. Please try again.' });
          alert('Login failed: An unexpected error occurred. Please try again.'); // General fallback error
        }
      }
    }
  };
  


  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Citizen Log In</h1>
      </header>
      <form className="login-form" onSubmit={handleSubmit}>
        {errors.form && <div className="citizen-error">{errors.form}</div>}
        <div className="citizen-form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="citizen-error">{errors.email}</div>}
        </div>
        <div className="password-container citizen-form-group">
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
            className="toggle-password"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && <div className="citizen-error">{errors.password}</div>}
        </div>
        <div className="checkboxx-container citizen-form-group">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label>Remember me</label>
        </div>
        <button type="submit" className="login-button">Log In</button>
        <div className="links-container">
          <a href="/reset" className="reset-link">Forgot Password?</a>
          <br />
          <a href="/register" className="signup-link">Don't have an account? Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default CitizenLoginPage;
