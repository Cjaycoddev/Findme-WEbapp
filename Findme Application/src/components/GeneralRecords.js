import React, { useEffect, useState } from "react";
import "./GeneralRecords.css";

const ReportsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [unidentifiedPersons, setUnidentifiedPersons] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered and displayed data
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [sortOption, setSortOption] = useState(""); // Sort option state
  const [filterOption, setFilterOption] = useState(""); 
  const [activeTab, setActiveTab] = useState("missingPersons"); // Default tab now set to "missingPersons"
 // Default tab

  useEffect(() => {
    // Fetch Report Data
    const fetchReportData = async () => {
      const response = await fetch("http://localhost:8000/api/reports/");
      const data = await response.json();
      setReportData(data);
    };

    // Fetch Unidentified Persons Data
    const fetchUnidentifiedPersons = async () => {
      const response = await fetch("http://localhost:8000/api/unidentified-persons/");
      const data = await response.json();
      setUnidentifiedPersons(data);
    };

    // Fetch Missing Persons Data
    const fetchMissingPersons = async () => {
      const response = await fetch("http://localhost:8000/api/missing-persons/");
      const data = await response.json();
      setMissingPersons(data);
    };

    fetchReportData();
    fetchUnidentifiedPersons();
    fetchMissingPersons();
  }, []);

  // Apply search, sort, and filter logic
  useEffect(() => {
    let currentData = [];

    // Determine active tab data
    if (activeTab === "missingPersons") {
      currentData = [...missingPersons];
    } else if (activeTab === "unidentifiedPersons") {
      currentData = [...unidentifiedPersons];
    } else if (activeTab === "reportData") {
      currentData = [...reportData];
    }

    // Apply filter (e.g., by gender for persons tabs)
    if (filterOption) {
      currentData = currentData.filter((item) => {
        if (activeTab !== "reportData") {
          return item.gender.toLowerCase() === filterOption.toLowerCase();
        }
        return true; // No filtering for reportData
      });
    }

    // Apply search
    if (searchQuery) {
      currentData = currentData.filter((item) => {
        const searchFields = activeTab === "reportData"
          ? ["report_id", "status"]
          : ["first_name", "second_name", "last_name", "unique_identifiers"];
        return searchFields.some((field) =>
          item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply sorting
    if (sortOption) {
      currentData.sort((a, b) => {
        if (sortOption === "report_id") {
          return a.report_id.localeCompare(b.report_id);
        } else if (sortOption === "date") {
          const dateField = activeTab === "reportData" ? "date_reported" :
                            activeTab === "unidentifiedPersons" ? "date_found" : "date_of_disappearance";
          return new Date(a[dateField]) - new Date(b[dateField]);
        } else if (sortOption === "age" && activeTab !== "reportData") {
          return a.age_years - b.age_years;
        }
        return 0;
      });
    }

    // Update filtered data
    setFilteredData(currentData);
  }, [searchQuery, sortOption, filterOption, activeTab, reportData, unidentifiedPersons, missingPersons]);

  // Render Table
  const renderTable = (columns) => {
    return (
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="reports-page">
      <h1>Reports Page</h1>

      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab("missingPersons")} className={activeTab === "missingPersons" ? "active" : ""}>
          Missing Persons
        </button>
        <button onClick={() => setActiveTab("unidentifiedPersons")} className={activeTab === "unidentifiedPersons" ? "active" : ""}>
          Unidentified Persons
        </button>
        <button onClick={() => setActiveTab("reportData")} className={activeTab === "reportData" ? "active" : ""}>
          Report Data
        </button>
        
      </div>

      {/* Search, Sort, and Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
          <option value="">Sort by</option>
          <option value="report_id">Report ID</option>
          <option value="date">Date</option>
          {activeTab !== "reportData" && <option value="age">Age</option>}
        </select>
        {activeTab !== "reportData" && (
          <select onChange={(e) => setFilterOption(e.target.value)} value={filterOption}>
            <option value="">Filter by Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "reportData" &&
          renderTable(["report_id", "date_reported", "status"])}
        {activeTab === "unidentifiedPersons" &&
          renderTable([
            "report_id",
            "first_name",
            "second_name",
            "last_name",
            "gender",
            "age_years",
            "age_months",
            "contact_information",
            "residence_location",
            "unique_identifiers",
            "other_descriptions",
            "location_found",
            "date_found",
            "time_reported",
          ])}
        {activeTab === "missingPersons" &&
          renderTable([
            "report_id",
            "first_name",
            "second_name",
            "last_name",
            "gender",
            "age_years",
            "age_months",
            "residence_location",
            "contact_information",
            "unique_identifiers",
            "other_descriptions",
            "last_seen_location",
            "date_of_disappearance",
            "time_reported",
          ])}
      </div>
    </div>
  );
};

export default ReportsPage;
