import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationModal.css';

const NotificationModal = ({ isOpen, onClose }) => {
  const [messageType, setMessageType] = useState('predefined');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [predefinedMessages, setPredefinedMessages] = useState([]);
  const [predefinedMessageId, setPredefinedMessageId] = useState('');

  // List of counties in Kenya
  const counties = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Nyeri",
    "Machakos", "Meru", "Isiolo", "Garissa", "Wajir", "Mandera", "Marsabit",
    "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
    "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Narok", "Kajiado",
    "Kericho", "Bomet", "Kakamega", "Bungoma", "Vihiga", "Busia", "Siaya",
    "Homabay", "Migori", "Kisii", "Nyamira", "Kitui", "Makueni", "Taita-Taveta",
    "Kilifi", "Kwale", "Tana River", "Lamu", "Nyandarua",
  ];

  useEffect(() => {
    // Fetch predefined messages when the modal opens
    const fetchPredefinedMessages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-predefined-messages/');
        setPredefinedMessages(response.data);
      } catch (error) {
        console.error('Error fetching predefined messages:', error);
        alert('Failed to load predefined messages.');
      }
    };

    if (isOpen) {
      fetchPredefinedMessages();
    }
  }, [isOpen]);

  const getCookie = (name) => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1];
    return cookieValue || null;
  };
  
  const csrfToken = getCookie('csrftoken');

  const handleSendNotification = async () => {
    const endpoint = selectedCounty
      ? 'http://localhost:8000/api/send-notification-by-county/'
      : 'http://localhost:8000/api/send-notification-all/';

    const messageToSend = messageType === 'custom'
      ? customMessage
      : predefinedMessages.find(msg => msg.message_id === parseInt(predefinedMessageId)).message_text;

    if (!messageToSend) {
      alert('Please select or enter a message.');
      return;
    }

    try {
      const response = await axios.post(
        endpoint,
        {
          county: selectedCounty || null,  // Include county if selected
          message: messageToSend,         // Notification message
        },
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true, // Send cookies with the request
        }
      );  

      if (response.status === 200) {
        alert('Notification sent successfully!');
        setCustomMessage('');
        setPredefinedMessageId('');
        setSelectedCounty('');
        onClose();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="unique-modal-overlay">
      <div className="unique-modal-content">
        <h2 className="unique-modal-header">Send Notifications</h2>

        <label className="unique-modal-label" htmlFor="county">Select County (Optional):</label>
        <select
          id="county"
          className="unique-modal-select"
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          size={6} // Limit visible options to six
        >
          <option value="">All Counties</option>
          {counties.map((county, index) => (
            <option key={index} value={county}>
              {county}
            </option>
          ))}
        </select>

        <label className="unique-modal-label" htmlFor="messageType">Select a Message Type:</label>
        <select
          id="messageType"
          className="unique-modal-select"
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
        >
          <option value="predefined">Predefined Message</option>
          <option value="custom">Custom Message</option>
        </select>

        {messageType === 'predefined' && (
          <>
            <label className="unique-modal-label" htmlFor="predefinedMessage">Select a Predefined Message:</label>
            <select
              id="predefinedMessage"
              className="unique-modal-select"
              value={predefinedMessageId}
              onChange={(e) => setPredefinedMessageId(e.target.value)}
            >
              <option value="" disabled>Select a message</option>
              {predefinedMessages.map((msg) => (
                <option key={msg.message_id} value={msg.message_id}>{msg.message_text}</option>
              ))}
            </select>
          </>
        )}

        {messageType === 'custom' && (
          <textarea
            className="unique-modal-textarea"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter your custom message here..."
          ></textarea>
        )}

        <div className="unique-modal-buttons">
          <button onClick={handleSendNotification} className="unique-modal-send-btn">Send Notification</button>
          <button onClick={onClose} className="unique-modal-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
