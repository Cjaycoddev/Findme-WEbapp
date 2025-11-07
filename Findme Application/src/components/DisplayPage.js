import React from 'react';
import './DisplayPage.css';

const DisplayPage = () => {
  return (
    <div className="display-page">
      <div className="column">
        <div className="column-header missing-header">
          <h2>Missing People</h2>
        </div>
        <div className="record-container">
          <div className="record">
            <div className="record-title">Case Number: 12345</div>
            <div className="record-body">
              <div>First Name: John</div>
              <div>Second Name: Doe</div>
              <div>Gender: Male</div>
              <div>Age: 25 years</div>
              <div>Photos: [Clear passport, Full photo 1, Full photo 2]</div>
              <div>Location of Residence: Nairobi, Kenya</div>
              <div>Contact: +254712345678</div>
              <div>Unique Description: Scar on left cheek</div>
              <div>Other Description: Wearing a black jacket</div>
              <div>Last Seen Location: City Center</div>
              <div>Date of Disappearance: 2025-02-08</div>
              <div>Time of Disappearance: 14:00</div>
            </div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="column-header unidentified-header">
          <h2>Unidentified Persons</h2>
        </div>
        <div className="record-container">
          <div className="record">
            <div className="record-title">Case Number: 54321</div>
            <div className="record-body">
              <div>First Name: Unknown</div>
              <div>Second Name: Unknown</div>
              <div>Last Name: Unknown</div>
              <div>Gender: Male</div>
              <div>Age: 30 years</div>
              <div>Photos: [Clear passport, Full photo 1, Full photo 2]</div>
              <div>Contact of Reporter: +254712345678</div>
              <div>Unique Description: Tattoo on right arm</div>
              <div>Other Description: Found wearing a blue shirt</div>
              <div>Last Seen Location: Market Area</div>
              <div>Date Found: 2025-02-08</div>
              <div>Time Found: 15:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
