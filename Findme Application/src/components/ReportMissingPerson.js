import React, { useState, useEffect, useCallback } from 'react';
import './ReportMissingPerson.css';

const ReportMissingPerson = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    gender: '',
    ageYear: '',
    ageMonth: '',
    location: '',
    contactInfo: '',
    uniqueIdentifiers: '',
    Otherdescriptions: '',
    lastSeenLocation: '',
    disappearanceDate: '',
    currentTime: '',
    passportPhoto: null,
    fullBodyPhoto1: null,
    fullBodyPhoto2: null,
  });
  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/csrf_token/', {
      credentials: 'include',  // Ensure cookies are sent with the request
    })
      .then(response => response.json())
      .then(data => {
        console.log('CSRF token fetched:', data.csrfToken);
        setCsrfToken(data.csrfToken);
      })
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
        setFormData({
            ...formData,
            [name]: files[0],
        });
    } else {
        setFormData({
            ...formData,
            [name]: value,
        });

        if ((name === 'firstName' || name === 'secondName' || name === 'lastName') && !/^[A-Za-z]*$/.test(value)) {
            setErrors({
                ...errors,
                [name]: 'Please enter only letters.',
            });
        } else if (name === 'ageYear' && (isNaN(value) || value.length > 2)) {
            setErrors({
                ...errors,
                [name]: 'Please enter a valid year.',
            });
        } else if (name === 'ageMonth' && (isNaN(value) || value < 1 || value > 12)) {
            setErrors({
                ...errors,
                [name]: 'Please enter a valid month.',
            });
        } else if (name === 'contactInfo' && !/^(07|01)\d{8}$/.test(value)) {
            setErrors({
                ...errors,
                [name]: 'Please enter a valid 10-digit phone number starting with 07 or 01.',
            });
        } else {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    }
};

const handleBlur = (e) => {
    const { name, value } = e.target;
    if (['firstName', 'secondName', 'ageYear', 'ageMonth', 'lastSeenLocation', 'disappearanceDate', 'contactInfo'].includes(name) && value.trim() === '') {
        setErrors({
            ...errors,
            [name]: 'This field is required.',
        });
    }
};

const showAlert = (message, type) => {
  // Create the alert element
  const alertBox = document.createElement('div');
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;

  // Append the alert to the body
  document.body.appendChild(alertBox);

  // Add a show class for animation
  setTimeout(() => {
      alertBox.classList.add('show');
  }, 10); // Slight delay for CSS animation to kick in

  // Remove the alert after 3 seconds
  setTimeout(() => {
      alertBox.classList.remove('show');
      alertBox.addEventListener('transitionend', () => {
          alertBox.remove();
      });
  }, 3000);
};



const handleSubmit = async (e) => {
  e.preventDefault();
  let valid = true;

  // Validate required fields
  const requiredFields = [
      'firstName', 'secondName', 'ageYear', 'ageMonth', 'lastSeenLocation', 'disappearanceDate', 'contactInfo', 'location'
  ];
  requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
          setErrors((prevErrors) => ({
              ...prevErrors,
              [field]: 'This field is required.',
          }));
          valid = false;
      }
  });

  if (valid) {
      try {
          const formDataToSend = new FormData();
          Object.keys(formData).forEach((key) => {
              formDataToSend.append(key, formData[key]);
          });

          const response = await fetch('http://localhost:8000/api/report_missing_person/', {
              method: 'POST',
              body: formDataToSend,
              credentials: 'include', // Include cookies
              headers: {
                  'X-CSRFToken': csrfToken,
              },
          });

          const data = await response.json();
          if (response.ok) {
              // Show success alert
              showAlert(data.success, 'success');
          } else {
              showAlert(data.error || 'Error submitting report', 'error');
          }
      } catch (error) {
          console.error('Error:', error);
          showAlert('Server error during submission', 'error');
      }
  }
};



const handleCurrentTime = useCallback(() => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setFormData(prevFormData => ({
        ...prevFormData,
        currentTime: formattedTime
    }));
}, []); // No dependencies, so it only creates the function once

// useEffect to update the current time every second
useEffect(() => {
    handleCurrentTime();
    const interval = setInterval(handleCurrentTime, 1000); // Update time every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
}, [handleCurrentTime]);

return (
  <div className="report-missing-person-page">
    <header className="reportt-header">
      <h1>Report Missing Person</h1>
    </header>
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter First Name"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="secondName">Second Name</label>
          <input
            type="text"
            id="secondName"
            name="secondName"
            placeholder="Second Name"
            value={formData.secondName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.secondName && <span className="error">{errors.secondName}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
        <div className="input-group age-group">
          <label htmlFor="ageYear">Age</label>
          <div>
            <input
              type="text"
              id="ageYear"
              name="ageYear"
              placeholder="Years"
              value={formData.ageYear}
              onChange={handleChange}
              onBlur={handleBlur}
              required={formData.ageMonth === ''}  // Required if months is empty
            />
            <input
              type="text"
              id="ageMonth"
              name="ageMonth"
              placeholder="Months"
              value={formData.ageMonth}
              onChange={handleChange}
              onBlur={handleBlur}
              required={formData.ageYear === ''}  // Required if years is empty
              min="0"
              max="12"
            />
          </div>
          {errors.ageYear && <span className="error">{errors.ageYear}</span>}
          {errors.ageMonth && <span className="error">{errors.ageMonth}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label className="image-upload">
            Upload Passport Photo
            <input
              type="file"
              name="passportPhoto"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </label>
          {errors.passportPhoto && <span className="error">{errors.passportPhoto}</span>}
        </div>
        <div className="input-group">
          <label className="image-upload">
            Upload Full Body Photo 1
            <input
              type="file"
              name="fullBodyPhoto1"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </label>
          {errors.fullBodyPhoto1 && <span className="error">{errors.fullBodyPhoto1}</span>}
        </div>
        <div className="input-group">
          <label className="image-upload">
            Upload Full Body Photo 2
            <input
              type="file"
              name="fullBodyPhoto2"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </label>
          {errors.fullBodyPhoto2 && <span className="error">{errors.fullBodyPhoto2}</span>}
        </div>
      </div>
      <div className="form-row">
            <div className="input-group">
        <label htmlFor="location">Residence Location</label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          size="5" // Makes it display 5 options at a time, scrollable
        >
          <option value="" disabled>Residence Location</option>
          <option value="nairobi">Nairobi</option>
          <option value="mombasa">Mombasa</option>
          <option value="kisumu">Kisumu</option>
          <option value="nakuru">Nakuru</option>
          <option value="eldoret">Eldoret</option>
          <option value="machakos">Machakos</option>
          <option value="thika">Thika</option>
          <option value="nyeri">Nyeri</option>
          <option value="meru">Meru</option>
          <option value="embu">Embu</option>
          <option value="kericho">Kericho</option>
          <option value="bomet">Bomet</option>
          <option value="kiambu">Kiambu</option>
          <option value="busia">Busia</option>
          <option value="bungoma">Bungoma</option>
          <option value="kakamega">Kakamega</option>
          <option value="vihiga">Vihiga</option>
          <option value="homabay">Homa Bay</option>
          <option value="kisii">Kisii</option>
          <option value="migori">Migori</option>
          <option value="nyamira">Nyamira</option>
          <option value="siaya">Siaya</option>
          <option value="narok">Narok</option>
          <option value="kajiiado">Kajiado</option>
          <option value="laikipia">Laikipia</option>
          <option value="samburu">Samburu</option>
          <option value="isiolo">Isiolo</option>
          <option value="marsabit">Marsabit</option>
          <option value="mandera">Mandera</option>
          <option value="wajir">Wajir</option>
          <option value="garissa">Garissa</option>
          <option value="kilifi">Kilifi</option>
          <option value="lamu">Lamu</option>
          <option value="kwale">Kwale</option>
          <option value="tana_river">Tana River</option>
          <option value="turkana">Turkana</option>
          <option value="west_pokot">West Pokot</option>
          <option value="trans_nzoia">Trans Nzoia</option>
          <option value="uasingishu">Uasin Gishu</option>
          <option value="kitui">Kitui</option>
          <option value="taita_taveta">Taita Taveta</option>
          <option value="nyandarua">Nyandarua</option>
          <option value="muranga">Murang'a</option>
          <option value="nand">Nandi</option>
          <option value="baringo">Baringo</option>
        </select>
        {errors.location && <span className="error">{errors.location}</span>}
      </div>

        <div className="input-group">
          <label htmlFor="contactInfo">Contact Information</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            placeholder="Contact Information"
            value={formData.contactInfo}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.contactInfo && <span className="error">{errors.contactInfo}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="uniqueIdentifiers">Unique Identifiers</label>
          <textarea
            id="uniqueIdentifiers"
            name="uniqueIdentifiers"
            placeholder="Input Unique Identifiers"
            value={formData.unique_identifiers}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="Otherdescriptions">Other Descriptions</label>
          <textarea
            id="Otherdescriptions"
            name="Otherdescriptions"
            placeholder="Input Other Descriptions"
            value={formData.other_descriptions}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="lastSeenLocation">Last Seen Location</label>
          <input
            type="text"
            id="lastSeenLocation"
            name="lastSeenLocation"
            placeholder="Last Seen Location"
            value={formData.lastSeenLocation}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.lastSeenLocation && <span className="error">{errors.lastSeenLocation}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="disappearanceDate">Date of Disappearance</label>
          <input
            type="date"
            id="disappearanceDate"
            name="disappearanceDate"
            placeholder="Date of Disappearance"
            value={formData.disappearanceDate}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.disappearanceDate && <span className="error">{errors.disappearanceDate}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label htmlFor="currentTime">Time Reported</label>
          <input
            type="text"
            id="currentTime"
            name="currentTime"
            placeholder="Time Reported"
            value={formData.currentTime}
            readOnly
          />
        </div>
      </div>
      <div className="form-row">
        <button type="submit" className="submit-button">Report Case</button>
      </div>
    </form>
  </div>
);
};

export default ReportMissingPerson;
