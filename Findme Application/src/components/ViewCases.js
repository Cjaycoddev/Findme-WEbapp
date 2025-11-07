import React, { useState, useEffect } from 'react';
import './ViewCases.css';

const PoliceRecords = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        location: '',
        dateReported: '',
        dateOfDisappearance: '',
    });

    // Fetch records from the backend
    useEffect(() => {
        fetch('http://localhost:8000/api/missing_records/')
            .then((response) => response.json())
            .then((data) => {
                setRecords(data);
                setFilteredRecords(data);
            })
            .catch((error) => console.error('Error fetching records:', error));
    }, []);

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredRecords(
            records.filter((record) =>
                record.first_name.toLowerCase().includes(query) ||
                record.second_name.toLowerCase().includes(query) ||
                record.last_name.toLowerCase().includes(query) 
            )
        );
    };

    // Handle filtering
    const handleFilter = (key, value) => {
        const updatedCriteria = { ...filterCriteria, [key]: value };
        setFilterCriteria(updatedCriteria);

        setFilteredRecords(
            records.filter((record) =>
                (!updatedCriteria.location || record.residence_location.toLowerCase().includes(updatedCriteria.location.toLowerCase())) &&
                (!updatedCriteria.dateReported || record.time_reported.includes(updatedCriteria.dateReported)) &&
                (!updatedCriteria.dateOfDisappearance || record.date_of_disappearance.includes(updatedCriteria.dateOfDisappearance))
            )
        );
    };

    // Handle sorting
    const handleSort = (key) => {
        setSortKey(key);
        const sorted = [...filteredRecords].sort((a, b) => {
            if (key === 'time_reported' || key === 'date_of_disappearance') {
                return new Date(a[key]) - new Date(b[key]);
            }
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        setFilteredRecords(sorted);
    };

    return (
        <div className="unique-police-records">
            <header className="unique-records-header">
                <h1>Missing Persons Records</h1>
            </header>
    
            <div className="unique-controls">
                {/* Search Field */}
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchQuery}
                    onChange={handleSearch}
                />
    
                {/* Filter by Date Reported */}
                <div className="filter-container">
                    <label htmlFor="filter-date-reported">Filter by Date Reported:</label>
                    <input
                        type="date"
                        id="filter-date-reported"
                        onChange={(e) => handleFilter('dateReported', e.target.value)}
                    />
                </div>
    
                {/* Filter by Date of Disappearance */}
                <div className="filter-container">
                    <label htmlFor="filter-date-disappearance">Filter by Date of Disappearance:</label>
                    <input
                        type="date"
                        id="filter-date-disappearance"
                        onChange={(e) => handleFilter('dateOfDisappearance', e.target.value)}
                    />
                </div>
    
                {/* Filter by Location */}
                <div className="filter-container">
                    <label htmlFor="filter-location">Filter by Location:</label>
                    <input
                        type="text"
                        id="filter-location"
                        placeholder="Enter location"
                        onChange={(e) => handleFilter('location', e.target.value)}
                    />
                </div>
    
                {/* Sort By Dropdown */}
                <select onChange={(e) => handleSort(e.target.value)} value={sortKey}>
                    <option value="">Sort By</option>
                    <option value="time_reported">Date Reported</option>
                    <option value="date_of_disappearance">Date of Disappearance</option>
                    <option value="residence_location">Location</option>
                    <option value="report_id">Report ID</option>
                </select>
            </div>
    
            <div className="unique-records-list">
                {filteredRecords.map((record) => (
                    <div key={record.report_id} className="unique-record-card">
                        <h2>{`${record.first_name} ${record.second_name} ${record.last_name}`}</h2>
                        <div className="unique-text-data">
                            <p><strong>Report ID:</strong> {record.report_id}</p>
                            <p><strong>Reporter ID:</strong> {record.reporter_object_id}</p>
                            <p><strong>Gender:</strong> {record.gender}</p>
                            <p><strong>Age:</strong> {record.age_years} years, {record.age_months} months</p>
                            <p><strong>Residence:</strong> {record.residence_location}</p>
                            <p><strong>Contact:</strong> {record.contact_information}</p>
                            <p><strong>Last Seen:</strong> {record.last_seen_location}</p>
                            <p><strong>Date of Disappearance:</strong> {record.date_of_disappearance}</p>
                            <p><strong>Time Reported:</strong> {record.time_reported}</p>
                            <p><strong>Unique Identifiers:</strong> {record.unique_identifiers}</p>
                            <p><strong>Other Descriptions:</strong> {record.other_descriptions}</p>
                        </div>
                        <div className="unique-images">
                            <img src={`data:image/jpeg;base64,${record.passport_photo}`} alt="Passport" />
                            <img src={`data:image/jpeg;base64,${record.full_body_photo1}`} alt="Full Body 1" />
                            <img src={`data:image/jpeg;base64,${record.full_body_photo2}`} alt="Full Body 2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PoliceRecords;
