import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const navigate = useNavigate();

    // Fetch notifications from the backend
    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/get-notifications/', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched notifications:', data);
                setNotifications(data); // Update the state with fetched notifications
            } else {
                console.error('Failed to fetch notifications.');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Reset unread counter
    const resetUnreadCounter = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/reset-unread-counter/', {}, { withCredentials: true });
            if (response.data.success) {
                console.log(`Reset unread counter for ${response.data.updated_count} notifications.`);
            }
        } catch (error) {
            console.error('Error resetting unread counter:', error);
        }
    };

    // Fetch notifications and reset unread counter on page load
    useEffect(() => {
        fetchNotifications();
        resetUnreadCounter();
    }, []);

    // Clear selection when notifications update
    useEffect(() => {
        setSelectedNotifications([]);
    }, [notifications]);

    // Toggle selection of individual notifications
    const toggleSelection = (id) => {
        setSelectedNotifications((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id) // Remove deselected
                : [...prevSelected, id] // Add selected
        );
    };

    // Toggle selection of all notifications
    const toggleSelectAll = () => {
        if (selectedNotifications.length === notifications.length) {
            setSelectedNotifications([]); // Deselect all
        } else {
            setSelectedNotifications(notifications.map((notif) => notif.id)); // Select all using primary key (id)
        }
    };

    // Delete selected notifications
    const deleteSelectedNotifications = async () => {
        if (selectedNotifications.length === 0) {
            alert('No notifications selected for deletion.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8000/api/delete-notifications/',
                { notification_ids: selectedNotifications }, // Send primary keys and user-specific IDs
                { withCredentials: true }
            );

            if (response.data.success) {
                // Remove deleted notifications from local state
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notif) => !selectedNotifications.includes(notif.id))
                );
                setSelectedNotifications([]); // Clear selection
                alert(response.data.message || 'Deleted notifications successfully.');
            } else {
                alert('Failed to delete notifications.');
            }
        } catch (error) {
            console.error('Error deleting notifications:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="notifications-page-container">
            <h1 className="page-heading">Notifications From Police</h1>
            {notifications.length === 0 ? (
                <p>No notifications available</p>
            ) : (
                <div className="notifications-actions-container">
                    <div className="notifications-actions">
                        <input
                            type="checkbox"
                            checked={selectedNotifications.length === notifications.length}
                            onChange={toggleSelectAll}
                            className="select-all-checkbox"
                        />
                        <button
                            className={selectedNotifications.length ? 'delete-button-highlighted' : 'delete-button'}
                            onClick={deleteSelectedNotifications}
                            disabled={!selectedNotifications.length}
                        >
                            Delete Selected
                        </button>
                    </div>
                    <table className="notifications-table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Message</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((notification) => (
                                <tr key={notification.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.includes(notification.id)}
                                            onChange={() => toggleSelection(notification.id)}
                                        />
                                    </td>
                                    <td>{notification.notification__message || notification.message}</td>
                                    <td>{new Date(notification.notification__date_sent || notification.date_sent).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button className="notifications-back-button" onClick={() => navigate('/CitizenHomeWidget')}>
                Back to Home
            </button>
        </div>
    );
};

export default NotificationsPage;
