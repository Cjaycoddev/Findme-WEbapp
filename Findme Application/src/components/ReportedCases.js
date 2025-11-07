import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ReportedCases.css';

const ReportedCases = () => {
    const [records, setRecords] = useState([]);
    const [selectedType, setSelectedType] = useState('missing');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecords = () => {
            const endpoint = selectedType === 'missing' ? '/api/missing-persons/' : '/api/unidentified-persons/';
            axios.get(`http://localhost:8000${endpoint}`)
                .then(response => setRecords(response.data))
                .catch(error => console.error('Error fetching records:', error));
        };

        fetchRecords();
    }, [selectedType]); // Add selectedType to dependencies

    const handleRecordClick = (record) => {
        // Handle record click to show detailed info
        alert(JSON.stringify(record, null, 2));
    };

    return (
        <div className="reported-cases-container">
            <div className="reported-cases-header">
                <button className="reported-cases-back-btn" onClick={() => navigate('/CitizenHomeWidget')}>Back to Home</button>
                <h1>Reported Cases</h1>
                <select 
                    className="reported-cases-select" 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="missing">Missing Persons</option>
                    <option value="unidentified">Unidentified Persons</option>
                </select>
            </div>

            <div className="reported-cases-list">
                {records.map(record => (
                    <div 
                        key={record.id} 
                        className="reported-case-item" 
                        onClick={() => handleRecordClick(record)}>
                        <h2>Report ID: {record.report_id}</h2>
                        <p>Name: {record.name}</p>
                        <p>Age: {record.age}</p>
                        <p>Gender: {record.gender}</p>
                        <p>Date Reported: {record.date_reported}</p>
                    </div>
                ))}
            </div>

            <button className="reported-cases-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to Top
            </button>
        </div>
    );
};

export default ReportedCases;
