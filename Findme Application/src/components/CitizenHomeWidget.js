import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitizenHomeWidget.css';
import FeedbackModal from './FeedbackModal';
import { FaBars, FaUser, FaSignOutAlt, FaTelegram, FaLinkedin, FaBell, FaClipboardList, FaFacebook, FaTwitter } from 'react-icons/fa';

const CitizenHomeWidget = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // State for user info
  const [newUnidentifiedCount, setNewUnidentifiedCount] = useState(0); // New unidentified persons cases count
  const [newMissingCount, setNewMissingCount] = useState(0); // New missing persons cases count
  const navigate = useNavigate();

  // Open/Close feedback modal
  const openFeedbackModal = () => setIsFeedbackModalOpen(true);
  const closeFeedbackModal = () => setIsFeedbackModalOpen(false);

  // Open/Close menus
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  // Close menus when clicking outside
  const handleOutsideClick = (e) => {
    if (
      !e.target.closest('.home-widget-sidebar') &&
      !e.target.closest('.home-widget-profile-menu') &&
      !e.target.closest('.home-widget-menu-icon') &&
      !e.target.closest('.notification-icon') &&
      !e.target.closest('.home-widget-profile-icon')
    ) {
      setMenuOpen(false);
      setProfileOpen(false);
    }
  };

  // Navigate to specific pages
  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Fetch user info, notifications, and new cases count
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-user-info/', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data); // Set user info state
        } else {
          const error = await response.json();
          alert(`Error fetching user info: ${error.error}`);
        }
      } catch (error) {
        alert('An error occurred while fetching user info.');
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-notifications/', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data); // Set notifications state
        } else {
          const error = await response.json();
          alert(`Error fetching notifications: ${error.error}`);
        }
      } catch (error) {
        alert('An error occurred while fetching notifications.');
      }
    };

    const fetchNewUnidentifiedCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-new-case-count/', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          setNewUnidentifiedCount(data.new_case_count); // Update new unidentified cases count
        } else {
          const error = await response.json();
          alert(`Error fetching new unidentified cases count: ${error.error}`);
        }
      } catch (error) {
        alert('An error occurred while fetching new unidentified cases count.');
      }
    };

    const fetchNewMissingCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-new-missing-case-count/', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          setNewMissingCount(data.new_case_count); // Update new missing cases count
        } else {
          const error = await response.json();
          alert(`Error fetching new missing cases count: ${error.error}`);
        }
      } catch (error) {
        alert('An error occurred while fetching new missing cases count.');
      }
    };

    fetchUserInfo();
    fetchNotifications();
    fetchNewUnidentifiedCount();
    fetchNewMissingCount();
  }, []);

  // Handle viewing missing cases
  const handleViewMissingCases = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/update-viewed-missing-cases/', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included in the request
      });
      if (response.ok) {
        setNewMissingCount(0); // Reset new cases count after viewing
        handleNavigate('/missing-persons'); // Navigate to missing persons cases
      } else {
        const error = await response.json();
        alert(`Error updating viewed missing cases: ${error.error}`);
      }
    } catch (error) {
      alert('An error occurred while updating viewed missing cases.');
    }
  };

  // Handle viewing unidentified cases
  const handleViewUnidentifiedCases = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/update-viewed-cases/', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included in the request
      });
      if (response.ok) {
        setNewUnidentifiedCount(0); // Reset new unidentified cases count after viewing
        handleNavigate('/unidentified-persons'); // Navigate to unidentified cases
      } else {
        const error = await response.json();
        alert(`Error updating viewed unidentified cases: ${error.error}`);
      }
    } catch (error) {
      alert('An error occurred while updating viewed unidentified cases.');
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  return (
    <div className="homee-widgett-containerrr" onClick={handleOutsideClick}>
      <div className="home-widget-container">
        <div className="home-widget-header">
          <FaBars className="home-widget-menu-icon" onClick={toggleMenu} />
          <div className="notification-container" onClick={() => handleNavigate('/notifications')}>
            <FaBell className="notification-icon" />
            {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </div>
          <div className="home-widget-logo" />
          <FaUser className="home-widget-profile-icon" onClick={toggleProfile} />
        </div>

        <div className={`home-widget-sidebar ${menuOpen ? 'open' : ''}`}>
          <button className="sidebar-button" title="View Missing Persons Cases" onClick={handleViewMissingCases}>
            <FaClipboardList /> View Missing Persons Cases
            {newMissingCount > 0 && <span className="notification-dot-sidebar">{newMissingCount} new</span>}
          </button>
          <button className="sidebar-button" title="View Unidentified Persons Cases" onClick={handleViewUnidentifiedCases}>
            <FaClipboardList /> View Unidentified Persons Cases
            {newUnidentifiedCount > 0 && <span className="notification-dot-sidebar">{newUnidentifiedCount} new</span>}
          </button>
          <button className="sidebar-button" title="Receive notifications and messages" onClick={() => handleNavigate('/notifications')}>
            <FaBell /> Notifications
            {unreadCount > 0 && <span className="notification-dot-sidebar">{unreadCount}</span>}
          </button>
          <button className="sidebar-button" title="Report a missing person" onClick={() => handleNavigate('/report-missing-person')}><FaClipboardList /> Report Missing Person</button>
          <button className="sidebar-button" title="Report an unidentified person" onClick={() => handleNavigate('/report')}><FaClipboardList /> Report Unidentified Person</button>
          <button onClick={openFeedbackModal} className="sidebar-button" title="Send feedback about the app"><FaClipboardList /> Send Feedback</button>
          <FeedbackModal isOpen={isFeedbackModalOpen} onClose={closeFeedbackModal} />
          <button className="sidebar-button" title="Help and FAQs" onClick={() => handleNavigate('/help')}><FaClipboardList /> Help & FAQs</button>
          <button className="sidebar-button" onClick={toggleMenu} title="Hide Sidebar">←</button>
        </div>

        <div className={`home-widget-profile-menu ${profileOpen ? 'open' : ''}`}>
          <button className="profile-button" onClick={toggleProfile} title="Close Profile">→</button>
          <button
            className="logout-button"
            title="Log Out"
            onClick={() => handleNavigate('/logout-confirmation')}
          >
            <FaSignOutAlt /> Log Out
          </button>

          <div className="profile-info">
          {userInfo ? (
            <p>
              User ID: {userInfo.user_id}<br />
              First Name: {userInfo.first_name}<br />
              Second Name: {userInfo.second_name}<br />
              Email: {userInfo.email}<br />
              National ID: {userInfo.national_id}
            </p>
          ) : (
            <p>Loading profile...</p>
          )}
          </div>
        </div>

        <h2 className="home-widget-title">Welcome to FindMe</h2>
        <p className="home-widget-description">Your one-stop solution for reporting and finding missing persons and unidentified individuals.</p>

        <footer className="home-widget-footer">
          <div className="footer-column">
            <h4>Contact Information</h4>
            <p>Kenya Police Hotline: +254 999 / +254 112</p>
            <p>Emergency Services: +254 911</p>
            <p>Address: Vigilance House, Harambee Avenue, Nairobi, Kenya</p>
            <p>Email: info@kenyapolice.go.ke</p>
            <p>Website: <a href="http://www.kenyapolice.go.ke" target="_blank" rel="noopener noreferrer">www.kenyapolice.go.ke</a></p>
          </div>
          <div className="footer-column">
            <h4>Policies and Terms</h4>
            <a href="http://www.kenyapolice.go.ke" target="_blank" rel="noopener noreferrer">Privacy Policy</a><br/>
            <a href="/Terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a><br/>
            <a href="/help" target="_blank" rel="noopener noreferrer">Help & FAQs</a>
          </div>
          <div className="footer-column">
            <h4>Social Media</h4>
            <a href="https://www.facebook.com/NPSCKenya2013" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a><br/>
            <a href="https://x.com/NPSOfficial_KE?t=WFH8nZx5Y2p1cb2yEhFduA&s=09" target="_blank" rel="noopener noreferrer"><FaTwitter /> Twitter</a><br/>
            <a href="https://www.addtoany.com/add_to/telegram?linkurl=https%3A%2F%2Fwww.nationalpolice.go.ke%2Fnpshome&linkname=NPSHome&linknote=" target="_blank" rel="noopener noreferrer"><FaTelegram /> Telegram</a><br/>
            <a href="https://www.addtoany.com/add_to/linkedin?linkurl=https%3A%2F%2Fwww.nationalpolice.go.ke%2Fnpshome&linkname=NPSHome&linknote=" target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a><br/>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CitizenHomeWidget;
