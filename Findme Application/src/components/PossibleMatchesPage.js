import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PossibleMatchesPage.css";

const PossibleMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchPossibleMatches = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/get_possible_matches/");
  
        const sortedMatches = response.data.sort((a, b) => {
          // First, compare names (alphabetically)
          const nameA = a.missing_person.first_name.toLowerCase();
          const nameB = b.missing_person.first_name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
  
          // If names are the same, compare match scores (highest first)
          return b.match_score - a.match_score;
        });
  
        setMatches(sortedMatches);
      } catch (err) {
        setError("Unable to fetch possible matches. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPossibleMatches();
  }, []);
  

  // Handle status update
  const handleUpdateStatus = async (matchId, newStatus) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/update_match_status/${matchId}/`, {
        status: newStatus,
      });
      if (response.data.success) {
        // Update the local state to reflect the status change
        setMatches((prevMatches) =>
          prevMatches.map((match) =>
            match.match_id === matchId ? { ...match, status: newStatus } : match
          )
        );
        alert(`Match ${matchId} has been marked as ${newStatus}.`);
      }
    } catch (err) {
      console.error("Error updating match status:", err);
      alert("Failed to update match status. Please try again.");
    }
  };

  return (
      <div className="possible-matches-page">
        <h1>Possible Case Matches</h1>
        {loading && <p>Loading matches...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && matches.length === 0 && <p>No matches found.</p>}
        {!loading && matches.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Match ID</th>
                <th>Missing Person</th>
                <th>Unidentified Person</th>
                <th>Status</th>
                <th>Match Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.match_id}>
                  <td>{match.match_id}</td>
                  <td>
                    {match.missing_person.first_name} {match.missing_person.last_name} <br />
                    ({match.missing_person.gender}, {match.missing_person.age_years} years)
                  </td>
                  <td>
                    {match.unidentified_person.first_name} {match.unidentified_person.last_name} <br />
                    ({match.unidentified_person.gender}, {match.unidentified_person.age_years} years)
                  </td>
                  <td>{match.status}</td>
                  <td>{match.match_score ? match.match_score.toFixed(2) : "N/A"}</td>
                  <td>
                    <button
                      className="btn-solved"
                      onClick={() => handleUpdateStatus(match.match_id, "solved")}
                    >
                      Mark as Solved
                    </button>
                    <button
                      className="btn-pending"
                      onClick={() => handleUpdateStatus(match.match_id, "pending")}
                    >
                      Mark as Pending
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  );
};

export default PossibleMatchesPage;
