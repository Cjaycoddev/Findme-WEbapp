import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/UserloginPage');
  };

  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  return (
    <div className="landing-page">
      <header className="hheader">
        <h2 className="line">Welcome to the Missing Person Finder</h2>
        <p>Your journey to finding missing persons starts here.</p>
        <button className="cta-button" onClick={handleLoginClick}>Login</button>
        <button className="cta-button" onClick={handleRegisterClick}>Register</button>
      </header>
    </div>
  );
};

export default LandingPage;
