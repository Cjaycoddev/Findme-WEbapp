import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHomeWidget.css';
import { FaBars, FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';

const AdminHomeWidget = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0); // Unread feedback count
  const [totalUsers, setTotalUsers] = useState(0); // Total users count
  const [activeSessions, setActiveSessions] = useState(0); // Active sessions count
  const [adminInfo, setAdminInfo] = useState(null); // Admin user profile state
  const [error, setError] = useState(null); // Error state for profile

  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  useEffect(() => {
    const fetchFeedbackCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/unread-feedback-count/', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setFeedbackCount(data.unread_count);
        }
      } catch (error) {
        console.error('Failed to fetch feedback count:', error);
      }
    };

    const fetchTotalUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/total-users-count/', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setTotalUsers(data.total_users_count);
        }
      } catch (error) {
        console.error('Failed to fetch total users:', error);
      }
    };

    const fetchActiveSessions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/active-sessions-count/', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setActiveSessions(data.active_sessions_count);
        }
      } catch (error) {
        console.error('Failed to fetch active sessions:', error);
      }
    };

    const fetchAdminProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin-profile/', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setAdminInfo(data);
        } else {
          setError('Failed to fetch admin profile');
        }
      } catch (err) {
        setError('An error occurred while fetching profile');
      }
    };

    // Fetch all data
    fetchFeedbackCount();
    fetchTotalUsers();
    fetchActiveSessions();
    fetchAdminProfile();
  }, []);

  return (
    <div className="addmin-widget-container">
      <div className="addmin-widget-header">
        <FaBars className="addmin-widget-menu-icon" onClick={toggleMenu} />
        <h2>Admin Dashboard</h2>
        <FaUser className="addmin-widget-profile-icon" onClick={toggleProfile} />
      </div>

      <div className={`addmin-widget-sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="addmin-sidebar-button" title="User Management" onClick={() => handleNavigate('/AdminHomeWidget/users')}>
          <FaUser /> User Management
        </button>
        <button className="addmin-sidebar-button" title="Check Feedbacks" onClick={() => handleNavigate('/AdminHomeWidget/feedbacks')}>
          <FaBell /> Check Feedbacks
          {feedbackCount > 0 && <span className="feedback-notification">{feedbackCount}</span>}
        </button>
        <button className="addmin-sidebar-button" onClick={toggleMenu} title="Hide Sidebar">←</button>
      </div>

      <div className={`addmin-widget-profile-menu ${profileOpen ? 'open' : ''}`}>
        <button className="addmin-profile-button" onClick={toggleProfile} title="Close Profile">→</button>
        <button className="addmin-profile-button" title="View Profile">
          {adminInfo ? (
            <div className="profilee-info">
              <p><strong>Profile info</strong></p>
              <p>User ID: {adminInfo.user_id}</p>
              <p>Email: {adminInfo.email}</p>
            </div>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <p>Loading profile...</p>
          )}
        </button>
        <button
          className="logout-button"
          title="Log Out"
          onClick={() => handleNavigate('/logout-confirmation')}
        >
          <FaSignOutAlt /> Log Out
        </button>

      </div>

      <div className="addmin-widget-content">
        <h3>Welcome, Admin</h3>
        <div className="addmin-widget-overview">
          <div className="addmin-overview-card">
            <h4>Total Users</h4>
            <p>{totalUsers}</p>
          </div>
          <div className="addmin-overview-card">
            <h4>Active Sessions</h4>
            <p>{activeSessions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeWidget;