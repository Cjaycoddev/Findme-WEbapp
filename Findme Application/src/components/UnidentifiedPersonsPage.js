import React, { useState, useEffect } from 'react';
import './UnidentifiedPersonsPage.css'; // Import dedicated CSS

const UnidentifiedPersonsPage = () => {
  const [unidentifiedPersons, setUnidentifiedPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]); // State for filtered data
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [sortOption, setSortOption] = useState('report_id'); // State for sorting
  const [filterOption, setFilterOption] = useState(''); // State for filtering
  const [leads, setLeads] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notifications

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000); // 3 seconds
      return () => clearTimeout(timer); // Clean up timer
    }
  }, [notification]);

  // Fetch data from API endpoint for unidentified persons
  useEffect(() => {
    const fetchUnidentifiedPersons = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/unidentifiedpersons');
        if (!response.ok) {
          throw new Error('Failed to fetch unidentified persons data');
        }
        const data = await response.json();
        setUnidentifiedPersons(data);
        setFilteredPersons(data); // Initialize filtered data
      } catch (error) {
        console.error('Error fetching unidentified persons:', error);
        setNotification({ message: 'Failed to fetch unidentified persons.', type: 'error' });
      }
    };

    fetchUnidentifiedPersons();
  }, []);

  // Combine search, sort, and filter logic into a single useEffect
  useEffect(() => {
    let updatedPersons = unidentifiedPersons;

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
    updatedPersons = [...updatedPersons].sort((a, b) => {
      if (sortOption === 'report_id') {
        return a.report_id.localeCompare(b.report_id);
      } else if (sortOption === 'date_found') {
        return new Date(a.date_found) - new Date(b.date_found);
      } else if (sortOption === 'age') {
        return a.age_years - b.age_years;
      }
      return 0;
    });

    setFilteredPersons(updatedPersons);
  }, [searchQuery, sortOption, filterOption, unidentifiedPersons]);

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
        setLeads((prevLeads) => ({ ...prevLeads, [reportId]: '' }));
      } catch (error) {
        console.error('Error submitting lead:', error);
        setNotification({ message: `Failed to submit lead for Report ID ${reportId}.`, type: 'error' });
      }
    } else {
      setNotification({ message: 'Please provide a valid lead before submitting.', type: 'warning' });
    }
  };

  return (
    <div className="unidentified-persons">
      <header className="unidentified-header">
        <h1>Unidentified Persons</h1>
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <div className="search-sort-filter">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="report_id">Sort by Report ID</option>
            <option value="date_found">Sort by Date Found</option>
            <option value="age">Sort by Age</option>
          </select>
          <select onChange={(e) => setFilterOption(e.target.value)} value={filterOption}>
            <option value="">Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </header>
      <div className="unidentified-case-container">
        {filteredPersons.map((person) => (
          <div key={person.report_id} className="unidentified-case-card">
            <h2>{`Report ID: ${person.report_id}`}</h2>
            <p>{`Name: ${person.first_name || 'Unknown'} ${person.second_name || 'Unknown'} ${person.last_name || 'Unknown'}`}</p>
            <p>{`Gender: ${person.gender}`}</p>
            <p>{`Age: ${person.age_years || 'Unknown'} Years, ${person.age_months || 'Unknown'} Months`}</p>
            <p>{`Residence Location: ${person.residence_location || 'Unknown'}`}</p>
            <p>{`Location Found: ${person.location_found}`}</p>
            <p>{`Date Found: ${person.date_found}`}</p>
            <p>{`Time Reported: ${person.time_reported}`}</p>
            <div className="unidentified-photo-container">
            <img src={`data:image/jpeg;base64,${person.passport_photo}`} alt="Passport of the unidentified person" />
            <img src={`data:image/jpeg;base64,${person.full_body_photo1}`} alt="Full body view 1" />
            <img src={`data:image/jpeg;base64,${person.full_body_photo2}`} alt="Full body view 2" />

            </div>
            <div className="unidentified-lead-input">
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

export default UnidentifiedPersonsPage;
