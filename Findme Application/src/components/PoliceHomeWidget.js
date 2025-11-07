import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PoliceHomeWidget.css';
import NotificationModal from './NotificationModal'; // Import the modal
import { FaBars, FaUser, FaSignOutAlt, FaChartBar, FaClipboardList } from 'react-icons/fa';

const PoliceHomeWidget = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // Modal state
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // Unread leads count
  const [newUnidentifiedCount, setNewUnidentifiedCount] = useState(0); // New unidentified cases count
  const [newMissingCount, setNewMissingCount] = useState(0); // New missing persons count
  const [newPossibleMatchesCount, setNewPossibleMatchesCount] = useState(0); // New possible matches count

  const navigate = useNavigate();

  // Toggle Handlers
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  // Handle outside click to close menus
  const handleOutsideClick = (e) => {
    if (
      !e.target.closest('.home-widget-sidebar') &&
      !e.target.closest('.home-widget-profile-menu') &&
      !e.target.closest('.home-widget-menu-icon') &&
      !e.target.closest('.home-widget-profile-icon')
    ) {
      setMenuOpen(false);
      setProfileOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

   useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/get_police_profile/', {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
          });
  
          if (response.ok) {
            const data = await response.json();
            setUserInfo({
              email: data.email,
              user_id: data.user_id,
            });
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to fetch user info');
          }
        } catch (err) {
          setError('An error occurred while fetching profile info');
        }
      };
  
      fetchUserInfo();
    }, []);

  // Modal Handlers
  const openNotificationModal = () => setIsNotificationModalOpen(true);
  const closeNotificationModal = () => setIsNotificationModalOpen(false);



  useEffect(() => {
    const fetchNewPossibleMatchesCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-new-possible-matches-count/', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });
  
        if (response.ok) {
          const data = await response.json();
          setNewPossibleMatchesCount(data.new_matches_count); // Set count of new possible matches
        } else {
          console.error('Failed to fetch new possible matches count.');
        }
      } catch (err) {
        console.error('An error occurred while fetching new possible matches count:', err);
      }
    };
  
    fetchNewPossibleMatchesCount();
  }, []);

  const handleViewPossibleMatches = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/mark-possible-matches-as-viewed/', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
      });
  
      if (response.ok) {
        setNewPossibleMatchesCount(0); // Reset badge count after viewing
        handleNavigate('/matches'); // Navigate to the possible matches page
      } else {
        console.error('Failed to mark matches as viewed.');
      }
    } catch (err) {
      console.error('An error occurred while marking matches as viewed:', err);
    }
  };
  
  // Fetch unread leads count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/leads/unread-count/');
        if (!response.ok) {
          throw new Error('Failed to fetch unread leads count');
        }
        const data = await response.json();
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error('Error fetching unread leads count:', error);
      }
    };

    fetchUnreadCount();
  }, []);

  // Fetch new missing persons cases count
  useEffect(() => {
    const fetchNewMissingCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-new-missing-case-count/', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          setNewMissingCount(data.new_case_count); // Set count of new missing persons cases
        } else {
          const errorData = await response.json();
          console.error('Error fetching new missing cases count:', errorData.error);
        }
      } catch (err) {
        console.error('An error occurred while fetching new missing cases count:', err);
      }
    };

    fetchNewMissingCount();
  }, []);

  // Fetch new unidentified cases count
  useEffect(() => {
    const fetchNewUnidentifiedCount = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/get-new-case-count/', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          setNewUnidentifiedCount(data.new_case_count); // Set count of new unidentified cases
        } else {
          const errorData = await response.json();
          console.error('Error fetching new unidentified cases count:', errorData.error);
        }
      } catch (err) {
        console.error('An error occurred while fetching new unidentified cases count:', err);
      }
    };

    fetchNewUnidentifiedCount();
  }, []);

  // Mark missing persons cases as viewed and navigate
  const handleViewMissingCases = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/update-viewed-missing-cases/', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included for authentication
      });

      if (response.ok) {
        setNewMissingCount(0); // Reset count after viewing
        handleNavigate('/PoliceHomeWidget/ViewCases'); // Navigate to missing persons cases page
      } else {
        const errorData = await response.json();
        console.error('Error updating viewed missing cases:', errorData.error);
      }
    } catch (err) {
      console.error('An error occurred while updating viewed missing cases:', err);
    }
  };

  // Mark unidentified persons cases as viewed and navigate
  const handleViewUnidentifiedCases = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/update-viewed-cases/', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are included for authentication
      });

      if (response.ok) {
        setNewUnidentifiedCount(0); // Reset count after viewing
        handleNavigate('/PoliceHomeWidget/ViewUPcases'); // Navigate to unidentified cases page
      } else {
        const errorData = await response.json();
        console.error('Error updating viewed unidentified cases:', errorData.error);
      }
    } catch (err) {
      console.error('An error occurred while updating viewed unidentified cases:', err);
    }
  };

  return (
    <div className="home-widget-containerr" onClick={handleOutsideClick}>
      <div className="home-widget-header">
        <FaBars className="home-widget-menu-icon" onClick={toggleMenu} />
        <div className="home-widget-logo" />
        <FaUser className="home-widget-profile-icon" onClick={toggleProfile} />
      </div>

      {/* Sidebar */}
      <div className={`home-widget-sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="sidebar-button" title="Missing person Cases" onClick={handleViewMissingCases}>
          <FaClipboardList /> View Missing Person Cases
          {newMissingCount > 0 && <span className="notification-badge">{newMissingCount} new</span>}
        </button>
        <button className="sidebar-button" title="Unidentified person Cases" onClick={handleViewUnidentifiedCases}>
          <FaClipboardList /> View Unidentified Person Cases
          {newUnidentifiedCount > 0 && <span className="notification-badge">{newUnidentifiedCount} new</span>}
        </button>
        <button className="sidebar-button" title="View Charts and Analytics" onClick={() => handleNavigate('/PoliceHomeWidget/Analytics')}>
          <FaChartBar /> View Charts and Analytics
        </button>
        <button className="sidebar-button" title="View Reports" onClick={() => handleNavigate('/PoliceHomeWidget/Reports')}>
          <FaChartBar /> View Reports
        </button>
        <button onClick={openNotificationModal} className="sidebar-button" title="Notify Users">
          <FaClipboardList /> Notify Users
        </button>
        <NotificationModal isOpen={isNotificationModalOpen} onClose={closeNotificationModal} />

        <button className="sidebar-button" title="Report Missing Person" onClick={() => handleNavigate('/report-missing-person')}>
          <FaClipboardList /> Report Missing Person
        </button>
        <button className="sidebar-button" title="Report Unidentified Person" onClick={() => handleNavigate('/report')}>
          <FaClipboardList /> Report Unidentified Person
        </button>

        {/* View Case Leads with Notification Badge */}
        <button className="sidebar-button" title="View Case Leads" onClick={() => handleNavigate('/leads')}>
          <FaClipboardList /> View Case Leads
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>
        <button className="sidebar-button" title="View Possible Matches" onClick={handleViewPossibleMatches}>
          <FaClipboardList /> View Possible Matches
          {newPossibleMatchesCount > 0 && <span className="notification-badge">{newPossibleMatchesCount}</span>}
        </button>


        <button className="sidebar-button" onClick={toggleMenu} title="Hide Sidebar">
          ←
        </button>
      </div>

      {/* Profile Menu */}
      <div className={`home-widget-profile-menu ${profileOpen ? 'open' : ''}`}>
        <button className="profile-button" onClick={toggleProfile} title="Close Profile">→</button>
        <button
          className="logout-button"
          title="Log Out"
          onClick={() => handleNavigate('/logout-confirmation')}
        >
          <FaSignOutAlt /> Log Out
        </button>

        <div className="profilee-info">
          {userInfo ? (
            <p>
              User ID: {userInfo.user_id}<br />
              Email: {userInfo.email}
            </p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <h2 className="home-widget-title">Welcome to FindMe</h2>
      <p className="home-widget-description">Your one-stop solution for reporting and finding missing persons and unidentified individuals.</p>
    </div>
  );
};

export default PoliceHomeWidget;
