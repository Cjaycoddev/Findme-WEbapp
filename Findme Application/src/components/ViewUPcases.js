import React, { useState, useEffect } from 'react';
import './ViewUPcases.css';

const UnidentifiedPersons = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // Added state for sorting order
    const [filterCriteria, setFilterCriteria] = useState({
        locationFound: '',
        dateFound: '',
        dateReported: '',
        reportId: '', // Added filter criteria for Report ID
    });

    // Fetch records from the backend
    useEffect(() => {
        fetch('http://localhost:8000/api/view-up-cases/')
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
                (!updatedCriteria.locationFound || record.location_found.toLowerCase().includes(updatedCriteria.locationFound.toLowerCase())) &&
                (!updatedCriteria.dateFound || record.date_found.includes(updatedCriteria.dateFound)) &&
                (!updatedCriteria.dateReported || record.date_reported.includes(updatedCriteria.dateReported)) &&
                (!updatedCriteria.reportId || record.report_id.toLowerCase().includes(updatedCriteria.reportId.toLowerCase())) // Ensured correct filter for report_id
            )
        );
    };

    // Handle sorting
    const handleSort = (key) => {
        const newSortOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
        setSortKey(key);
        setSortOrder(newSortOrder);

        const sorted = [...filteredRecords].sort((a, b) => {
            let comparison = 0;

            if (key === 'date_found' || key === 'date_reported') {
                comparison = new Date(a[key]) - new Date(b[key]);
            } else if (key === 'report_id') {
                // Extract the numeric part of the report ID and compare
                const numA = parseInt(a.report_id.slice(-4), 10); // Last 4 characters
                const numB = parseInt(b.report_id.slice(-4), 10); // Last 4 characters
                comparison = numA - numB;
            } else {
                if (a[key] < b[key]) comparison = -1;
                if (a[key] > b[key]) comparison = 1;
            }

            // Reverse order if descending
            return newSortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredRecords(sorted);
    };

    return (
        <div className="unidentifieed-ppersons">
            <header className="records-header">
                <h1>Unidentified Persons</h1>
            </header>

            <div className="controls">
                {/* Search Field */}
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchQuery}
                    onChange={handleSearch}
                />

                {/* Filter by Report ID */}
                <div className="filter-container">
                    <label htmlFor="filter-report-id">Filter by Report ID:</label>
                    <input
                        type="text"
                        id="filter-report-id"
                        placeholder="Enter Report ID"
                        onChange={(e) => handleFilter('reportId', e.target.value)}
                    />
                </div>

                {/* Filter by Date Found */}
                <div className="filter-container">
                    <label htmlFor="filter-date-found">Filter by Date Found:</label>
                    <input
                        type="date"
                        id="filter-date-found"
                        onChange={(e) => handleFilter('dateFound', e.target.value)}
                    />
                </div>

                {/* Filter by Date Reported */}
                <div className="filter-container">
                    <label htmlFor="filter-date-reported">Filter by Date Reported:</label>
                    <input
                        type="date"
                        id="filter-date-reported"
                        onChange={(e) => handleFilter('dateReported', e.target.value)}
                    />
                </div>

                {/* Filter by Location Found */}
                <div className="filter-container">
                    <label htmlFor="filter-location">Filter by Location Found:</label>
                    <input
                        type="text"
                        id="filter-location"
                        placeholder="Enter location"
                        onChange={(e) => handleFilter('locationFound', e.target.value)}
                    />
                </div>

                {/* Sort Buttons */}
                <div className="sort-buttons">
                    <button onClick={() => handleSort('date_found')}>
                        Sort by Date Found ({sortOrder === 'asc' && sortKey === 'date_found' ? 'Ascending' : 'Descending'})
                    </button>
                    <button onClick={() => handleSort('date_reported')}>
                        Sort by Date Reported ({sortOrder === 'asc' && sortKey === 'date_reported' ? 'Ascending' : 'Descending'})
                    </button>
                    <button onClick={() => handleSort('report_id')}>
                        Sort by Report ID ({sortOrder === 'asc' && sortKey === 'report_id' ? 'Ascending' : 'Descending'})
                    </button>
                </div>
            </div>

            <div className="records-list">
                {filteredRecords.map((record) => (
                    <div key={record.report_id} className="record-card">
                        <h2>{`${record.first_name} ${record.second_name || ''} ${record.last_name || ''}`}</h2>
                        <div className="text-data">
                            <p><strong>Report ID:</strong> {record.report_id}</p>
                            <p><strong>Reporter ID:</strong> {record.reporter_object_id}</p>
                            <p><strong>Gender:</strong> {record.gender}</p>
                            <p><strong>Age:</strong> {record.age_years || 'Unknown'} years, {record.age_months || 'Unknown'} months</p>
                            <p><strong>Residence Location:</strong> {record.residence_location}</p>
                            <p><strong>Contact:</strong> {record.contact_information}</p>
                            <p><strong>Location Found:</strong> {record.location_found}</p>
                            <p><strong>Date Found:</strong> {record.date_found}</p>
                            <p><strong>Date Reported:</strong> {record.date_reported}</p>
                            <p><strong>Unique Identifiers:</strong> {record.unique_identifiers}</p>
                            <p><strong>Other Descriptions:</strong> {record.other_descriptions}</p>
                        </div>
                        <div className="images">
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

export default UnidentifiedPersons;
