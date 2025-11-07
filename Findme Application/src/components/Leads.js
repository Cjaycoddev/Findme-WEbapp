import React, { useState, useEffect } from 'react';
import './Leads.css'; // Add relevant CSS styling

const Leads = () => {
  const [leads, setLeads] = useState([]);

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/leads/');
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, []);

  // Mark a lead as read
  const markAsRead = async (leadId) => {
    try {
      const response = await fetch('http://localhost:8000/api/leads/mark-read/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lead_id: leadId }),
      });

      if (response.ok) {
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === leadId ? { ...lead, is_read: true } : lead
          )
        );
      }
    } catch (error) {
      console.error('Error marking lead as read:', error);
    }
  };

  return (
    <div className="police-dashboard">
      <h1>Police Dashboard: View Leads</h1>
      <table className="leads-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Lead Message</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.report_id}</td>
              <td>{lead.lead_message}</td>
              <td>{new Date(lead.created_at).toLocaleString()}</td>
              <td>{lead.is_read ? 'Read' : 'Unread'}</td>
              <td>
                {!lead.is_read && (
                  <button onClick={() => markAsRead(lead.id)}>Mark as Read</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;
