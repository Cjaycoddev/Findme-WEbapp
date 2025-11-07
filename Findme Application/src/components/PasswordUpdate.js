import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import './PasswordUpdate.css';

const PasswordUpdate = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // Get email from previous page

  // Password validation function
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(newPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email not provided. Please request OTP again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!validatePassword()) {
      setMessage('Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/verify_otp/', {
        email,
        otp_code: otp,
        new_password: newPassword,
      });

      setMessage(response.data.message);

      if (response.data.message === "Password updated successfully") {
        setTimeout(() => navigate('/CitizenLoginPage'), 2000);
      }
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password update failed.');
    }
  };

  return (
    <div className="password-update-page">
      <header className="update-header">
        <h1>Password Update</h1>
      </header>
      <form className="update-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          pattern="\d{6}"
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        </div>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        </div>
        <button type="submit" className="update-button">Update Password</button>
      </form>
      {message && <p className="error">{message}</p>}
    </div>
  );
};

export default PasswordUpdate;
