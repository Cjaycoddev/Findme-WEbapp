import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [title, setTitle] = useState(''); // State for the title

  const handleSend = async () => {
    if (title.trim() === '') {
      alert('Please enter a title.');
      return;
    }
    if (feedback.trim() === '') {
      alert('Please enter your feedback.');
      return;
    }

    try {
      // Replace with your actual endpoint for sending feedback
      const response = await axios.post('http://localhost:8000/api/submit-feedback/', {
        title, // Send the title
        feedback,
      });
      if (response.status === 200) {
        alert('Feedback sent successfully!');
        setFeedback(''); // Reset feedback input field
        setTitle(''); // Reset title input field
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Failed to send feedback. Please try again.');
    }
  };

  if (!isOpen) {
    return null; // Don't render if the modal is not open
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Submit Your Feedback</h2>
        {/* Title input field */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here..."
          className="modal-input"
        />
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          className="modal-textarea"
        ></textarea>
        <div className="modal-buttons">
          <button onClick={handleSend} className="modal-send-btn">Send</button>
          <button onClick={onClose} className="modal-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
