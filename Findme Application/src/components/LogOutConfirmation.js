import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogOutConfirmation.css';

const LogOutConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logout-confirmation">
      <img src="/Findme logo.png" alt="Logo" className="logout-logo" /> 
      <h2 className="tagline">Reuniting families, restoring hope</h2>
      <div className="circle">
        <span className="tick">✔</span>
      </div>
      <h3 className="logged-out-message">You have been logged out</h3>
      <h4 className="thank-you-message">Thank You</h4>
      <div className="footer">
        <p>All rights reserved &copy; Jonah Kimani</p>
      </div>
    </div>
  );
};

export default LogOutConfirmation;
