import React, { useState, useEffect } from 'react';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedbackIds, setSelectedFeedbackIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/feedbacks/', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Handle selecting/deselecting all feedbacks
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFeedbackIds([]); // Clear all selections
    } else {
      setSelectedFeedbackIds(feedbacks.map((feedback) => feedback.id)); // Select all feedbacks
    }
    setSelectAll(!selectAll);
  };

  // Handle individual checkbox changes
  const handleCheckboxChange = (id) => {
    setSelectedFeedbackIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((feedbackId) => feedbackId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Update the "Select All" checkbox state
  useEffect(() => {
    setSelectAll(selectedFeedbackIds.length === feedbacks.length && feedbacks.length > 0);
  }, [selectedFeedbackIds, feedbacks]);

  // Handle deleting selected feedbacks
  const handleDelete = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/delete-feedbacks/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedFeedbackIds }),
      });

      if (response.ok) {
        alert('Selected feedbacks deleted successfully!');
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.filter((feedback) => !selectedFeedbackIds.includes(feedback.id))
        );
        setSelectedFeedbackIds([]); // Clear selected feedbacks
      } else {
        console.error('Failed to delete feedbacks');
      }
    } catch (error) {
      console.error('Error deleting feedbacks:', error);
    }
  };


  

  return (
    <div className="feedback-page-container">
      <h2>Feedback Messages</h2>
      {feedbacks.length > 0 ? (
        <>
          <div className="feedback-controls">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="select-all-checkbox"
            />
            <label>Select All</label>
            <button
              onClick={handleDelete}
              className="delete-feedback-button"
              disabled={selectedFeedbackIds.length === 0}
            >
              Delete Selected
            </button>
          </div>
          <ul className="feedback-list">
            {feedbacks.map((feedback) => (
              <li key={feedback.id} className="feedback-item">
                <input
                  type="checkbox"
                  checked={selectedFeedbackIds.includes(feedback.id)}
                  onChange={() => handleCheckboxChange(feedback.id)}
                  className="feedback-checkbox"
                />
                <div className="feedback-content">
                  <p><strong>{feedback.title || 'No Title'}</strong></p>
                  <p>{feedback.message}</p>
                  <p className="feedback-timestamp">
                    {new Date(feedback.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No feedback messages to display.</p>
      )}
    </div>
  );
};

export default FeedbackPage;
