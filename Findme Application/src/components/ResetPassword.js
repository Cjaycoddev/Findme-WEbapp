import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
    setMessage("");
  };

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      setMessage("Email field cannot be empty.");
      return;
    }

    if (!isEmailValid) {
      setMessage("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/reset/",
        { email }
      );
      setMessage(response.data.message);
      navigate("/password-update", { state: { email } });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <header className="reset-header">
        <h1>RECOVER YOUR PASSWORD</h1>
        <p>Enter your email to receive an OTP for password reset.</p>
      </header>
      <form className="reset-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        {message && <div className="alert">{message}</div>}
        <button
          type="button"
          className="request-otp-button"
          onClick={handleRequestOtp}
          disabled={!isEmailValid || loading}
        >
          {loading ? "Requesting OTP..." : "Request OTP"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
