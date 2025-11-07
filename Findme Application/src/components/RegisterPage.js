import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import the eye icons from react-icons
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    nationalId: '',
    email: '',
    password: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);  // Add this state variable
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateField = (name, value) => {
    let error = '';
    const nameRegex = /^[a-zA-Z]+$/;
    const idRegex = /^\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case 'firstName':
        if (!value) {
          error = 'First Name is required';
        } else if (!nameRegex.test(value)) {
          error = 'First Name should contain only letters';
        }
        break;
      case 'secondName':
        if (!value) {
          error = 'Second Name is required';
        }else if (!nameRegex.test(value)) {
          error = 'Second Name should contain only letters';
        }
        break;
      case 'nationalId':
        if (!value) {
          error = 'National ID number is required';
        } else if (!idRegex.test(value)) {
          error = 'National ID number should be an 8-digit integer';
        }
        break;
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Email is not valid';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValid = Object.values(errors).every((error) => error === '') && formData.termsAccepted;

    if (formValid) {
      setIsSubmitting(true);

      try {
        const response = await axios.post('http://localhost:8000/api/register/', {
          first_name: formData.firstName,
          second_name: formData.secondName,
          national_id: formData.nationalId,
          email: formData.email,
          password: formData.password,
        });
        if (response.data.success) {
          alert('Registration successful');
          navigate('/CitizenHomeWidget');
      } else if (response.data.error) {
          alert(response.data.error); // Display the specific error message
      }
  } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error); // Display the server-provided error message
      } else {
          alert('Registration failed. Please try again.');
      }
  } finally {
      setIsSubmitting(false);
  }
} else {
  if (!formData.termsAccepted) {
      setErrors((prevErrors) => ({
          ...prevErrors,
          termsAccepted: 'You must accept the terms and conditions',
      }));
  }
}
};

  return (
    <div className="register-page">
      <header className="register-header">
        <h1>Sign Up</h1>
      </header>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.firstName && <span className="errror">{errors.firstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="secondName"
            placeholder="Second Name*"
            value={formData.secondName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.secondName && <span className="errror">{errors.secondName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="nationalId"
            placeholder="National ID number*"
            value={formData.nationalId}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.nationalId && <span className="errror">{errors.nationalId}</span>}
        </div>
        <div className="input-container">
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <span className="errror">{errors.email}</span>}
        </div>
        <div className="input-container password-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password*"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            title="Strong passwords include a mix of uppercase, lowercase letters, numbers, and special characters"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && <span className="errror">{errors.password}</span>}
        </div>
        <p>*Indicates required field.</p>
        <div className="cblabel">
          <div className="cb">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
          </div>
          <div className="cbl">
            <label>
              By signing up, you agree to our
              <a href="/terms" target="_blank" className="terms-link"> terms and conditions </a>
              and
              <a href="/privacy" target="_blank" className="privacy-link"> privacy policy</a>.
            </label>
          </div>
        </div>
        {errors.termsAccepted && <span className="errror">{errors.termsAccepted}</span>}
        <button type="submit" className="signup-button" disabled={isSubmitting}>Create Account</button>
      </form>
    </div>
  );
};

export default RegisterPage;
