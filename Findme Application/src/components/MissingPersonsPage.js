import React, { useState, useEffect } from 'react';
import './MissingPersonsPage.css'; // Import dedicated CSS

const MissingPersonsPage = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]); // State for filtered data
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [sortOption, setSortOption] = useState('report_id'); // State for sorting
  const [filterOption, setFilterOption] = useState(''); // State for filtering by gender
  const [leads, setLeads] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notifications

  // Fetch data from API endpoint for missing persons
  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/missingpersons');
        if (!response.ok) {
          throw new Error('Failed to fetch missing persons data');
        }
        const data = await response.json();
        setMissingPersons(data);
        setFilteredPersons(data); // Initialize filtered data
      } catch (error) {
        console.error('Error fetching missing persons:', error);
        setNotification({ message: 'Failed to fetch missing persons.', type: 'error' });
      }
    };

    fetchMissingPersons();
  }, []);

  // Handle notifications
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000); // 3 seconds
      return () => clearTimeout(timer); // Clean up timer
    }
  }, [notification]);

  // Combine logic for search, sort, and filter
  useEffect(() => {
    let updatedPersons = [...missingPersons]; // Clone the original data

    // Filter by gender
    if (filterOption) {
      updatedPersons = updatedPersons.filter((person) =>
        person.gender.toLowerCase() === filterOption.toLowerCase()
      );
    }

    // Search by name
    if (searchQuery) {
      updatedPersons = updatedPersons.filter((person) =>
        `${person.first_name || ''} ${person.second_name || ''} ${person.last_name || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Sort data
    updatedPersons.sort((a, b) => {
      if (sortOption === 'report_id') {
        return a.report_id.localeCompare(b.report_id);
      } else if (sortOption === 'date_of_disappearance') {
        return new Date(a.date_of_disappearance) - new Date(b.date_of_disappearance);
      } else if (sortOption === 'age') {
        return a.age_years - b.age_years;
      }
      return 0;
    });

    setFilteredPersons(updatedPersons);
  }, [missingPersons, searchQuery, sortOption, filterOption]);

  // Handle lead submission for a specific report
  const handleLeadSubmit = async (reportId) => {
    const leadMessage = leads[reportId];
    if (leadMessage) {
      try {
        const response = await fetch(`http://localhost:8000/api/leads/${reportId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lead: leadMessage }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit lead');
        }

        const data = await response.json();
        setNotification({ message: data.message, type: 'success' });
        setLeads((prevLeads) => ({ ...prevLeads, [reportId]: '' })); // Clear input after submission
      } catch (error) {
        console.error('Error submitting lead:', error);
        setNotification({ message: `Failed to submit lead for Report ID ${reportId}.`, type: 'error' });
      }
    } else {
      setNotification({ message: 'Please provide a valid lead before submitting.', type: 'warning' });
    }
  };

  return (
    <div className="missing-persons-page">
      <header className="page-header">
        <h1>Missing Persons</h1>
        {notification.message && (
          <div className={`notification ${notification.type}`}>{notification.message}</div>
        )}
        <div className="search-sort-filter">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Sort Dropdown */}
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="report_id">Sort by Report ID</option>
            <option value="date_of_disappearance">Sort by Date of Disappearance</option>
            <option value="age">Sort by Age</option>
          </select>

          {/* Filter Dropdown */}
          <select onChange={(e) => setFilterOption(e.target.value)} value={filterOption}>
            <option value="">Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </header>
      <div className="case-container">
        {filteredPersons.map((person) => (
          <div key={person.report_id} className="case-card">
            <h2>{`Report ID: ${person.report_id}`}</h2>
            <p>{`Name: ${person.first_name} ${person.second_name || ''} ${person.last_name}`}</p>
            <p>{`Gender: ${person.gender}`}</p>
            <p>{`Age: ${person.age_years} Years, ${person.age_months} Months`}</p>
            <p>{`Residence Location: ${person.residence_location}`}</p>
            <p>{`Last Seen Location: ${person.last_seen_location}`}</p>
            <p>{`Date of Disappearance: ${person.date_of_disappearance}`}</p>
            <p>{`Time Reported: ${person.time_reported}`}</p>
            <div className="photo-container">
              <img src={`data:image/jpeg;base64,${person.passport_photo}`} alt="Passport of the missing person" />
              <img src={`data:image/jpeg;base64,${person.full_body_photo1}`} alt="Full body view 1" />
              <img src={`data:image/jpeg;base64,${person.full_body_photo2}`} alt="Full body view 2" />
            </div>
            <div className="lead-input">
              <textarea
                value={leads[person.report_id] || ''}
                placeholder="Provide a lead"
                onChange={(e) => setLeads({ ...leads, [person.report_id]: e.target.value })}
              />
              <button onClick={() => handleLeadSubmit(person.report_id)}>Submit Lead</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissingPersonsPage;
