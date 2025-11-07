import React, { useState, useEffect } from 'react';
import './ReportUnidentifiedPersonPage.css';

const ReportUnidentifiedPersonPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    gender: '',
    ageYears: '',
    ageMonths: '',
    passportPhoto: null,
    fullPhoto1: null,
    fullPhoto2: null,
    contact: '',
    residence: '',
    unique_identifiers: '',
    other_descriptions: '',
    locationFound: '',
    dateFound: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF Token
  useEffect(() => {
    fetch('http://localhost:8000/api/csrf_token/', {
      credentials: 'include', // Ensure cookies are sent with the request
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('CSRF token fetched:', data.csrfToken);
        setCsrfToken(data.csrfToken);
      })
      .catch((error) => console.error('Error fetching CSRF token:', error));
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  
    // Validate the field as the user types
    validateField(name, value);
  };
  

  // Validate individual fields
  const validateField = (name, value) => {
    let error = '';
    const contactRegex = /^(07|01)\d{8}$/; // Regex to enforce the rule
  
    switch (name) {
      case 'contact':
        if (!value) {
          error = 'This field is required.';
        } else if (!contactRegex.test(value)) {
          error = 'Contact must start with 07 or 01 and be exactly 10 digits.';
        }
        break;
      case 'gender':
      case 'locationFound':
      case 'dateFound':
        if (!value.trim()) {
          error = 'This field is required.';
        }
        break;
      case 'passportPhoto':
      case 'fullPhoto1':
      case 'fullPhoto2':
        if (!value) {
          error = 'This photo is required.';
        }
        break;
      case 'ageYears':
        if (!value.trim()) {
          error = 'Age (Years) is required.';
        }
        break;
      case 'ageMonths':
        if (!value.trim()) {
          error = 'Age (Months) is required.';
        }
        break;
      default:
        break;
    }
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  
  // Handle onBlur validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  
    // Prevent focus change if there's an error
    if (errors[name]) {
      e.target.focus();
    }
  };
  

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'gender',
      'ageYears',
      'passportPhoto',
      'fullPhoto1',
      'fullPhoto2',
      'contact',
      'locationFound',
      'dateFound',
    ];

    let formValid = true;
    const newErrors = {};

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = 'This field is required.';
        formValid = false;
      }
    });

    // Validate at least one of the unique_identifiers or other_descriptions fields
    if (!formData.unique_identifiers.trim() && !formData.other_descriptions.trim()) {
      newErrors.unique_identifiers =
        'At least one of Unique Identifiers or Other Descriptions is required.';
      formValid = false;
    }

    setErrors(newErrors);

    if (formValid) {
      setIsSubmitting(true); // Disable the submit button
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key]);
        });

        const response = await fetch('http://localhost:8000/api/report-unidentified-person/', {
          method: 'POST',
          headers: {
            'X-CSRFToken': csrfToken,
          },
          body: formDataToSend,
          credentials: 'include', // Ensure cookies are sent
        });

        const data = await response.json();
        if (response.ok) {
          showAlert(`Case reported successfully! Report ID: ${data.report_id}`, 'success');
          console.log('Success:', data);
        } else {
          showAlert(data.error || 'Error submitting report', 'error');
          console.log('Error:', data);
        }
      } catch (error) {
        console.error('Error:', error);
        showAlert('Error: Unable to submit the form.', 'error');
      } finally {
        setIsSubmitting(false); // Re-enable the submit button
      }
    } else {
      showAlert('Please correct the highlighted fields.', 'error');
    }
  };

  // Custom alert function
  const showAlert = (message, type) => {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;

    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.classList.add('show');
    }, 10);

    setTimeout(() => {
      alertBox.classList.remove('show');
      alertBox.addEventListener('transitionend', () => {
        alertBox.remove();
      });
    }, 3000);
  };



  return (
    <div className="report-page">
      <header className="report-headerr">
        <h1>Report Unidentified Person</h1>
      </header>
      <form className="report-form" onSubmit={handleSubmit}>
        {/* Name Fields */}
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
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="secondName">Second Name</label>
            <input
              type="text"
              id="secondName"
              name="secondName"
              placeholder="Enter Second Name"
              value={formData.secondName}
              onChange={handleChange}
              onBlur={handleBlur}
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
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="gender">Gender*</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>
        </div>
        {/* Age Fields */}
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="ageYears">Approximate Age (Years)*</label>
            <input
              type="text"
              id="ageYears"
              name="ageYears"
              placeholder="Years"
              value={formData.ageYears}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.ageYears && <span className="error">{errors.ageYears}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="ageMonths">Approximate Age (Months)</label>
            <input
              type="text"
              id="ageMonth"
              name="ageMonths"
              placeholder="Months"
              value={formData.ageMonths}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.ageMonths && <span className="error">{errors.ageMonths}</span>}
          </div>
        </div>
        {/* Residence Location and Location Found */}
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="residence">Residence Location*</label>
            <select
              id="residence"
              name="residence"
              value={formData.residence}
              onChange={handleChange}
              required
              size="5" 
            >
              <option value="" disabled>Select Residence Location</option>
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
            {errors.residence && <span className="error">{errors.residence}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="locationFound">Location Found*</label>
            <input
              type="text"
              id="locationFound"
              name="locationFound"
              placeholder="Enter Location Found"
              value={formData.locationFound}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.locationFound && <span className="error">{errors.locationFound}</span>}
          </div>
        </div>
        {/* Contact Information */}
        <div className="form-row">
        <div className="input-group">
          <label htmlFor="contactInfo">Contact Information*</label>
          <input
            type="text"
            id="contact"
            name="contact"
            placeholder="Enter Contact Information"
            value={formData.contact}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.contact && <span className="error">{errors.contact}</span>}
        </div>
        <div className="input-group">
          <label htmlFor="dateFound">Date Found</label>
          <input
            type="date"
            id="dateFound"
            name="dateFound"
            value={formData.dateFound}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.dateFound && <span className="error">{errors.dateFound}</span>}
        </div>
      </div>
        {/* Descriptions */}
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="uniqueIdentifiers">Unique Identifiers</label>
            <textarea
              id="uniqueIdentifiers"
              name="unique_identifiers"
              placeholder="Enter Unique Identifiers"
              value={formData.unique_identifiers}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="otherDescriptions">Other Descriptions</label>
            <textarea
              id="otherDescriptions"
              name="other_descriptions"
              placeholder="Enter Other Descriptions"
              value={formData.other_descriptions}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Image Uploads */}
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="passportPhoto">Passport Photo*</label>
            <input
              type="file"
              id="passportPhoto"
              name="passportPhoto"
              onChange={handleChange}
            />
            {errors.passportPhoto && <span className="error">{errors.passportPhoto}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="fullPhoto1">Full Body Photo 1*</label>
            <input
              type="file"
              id="fullPhoto1"
              name="fullPhoto1"
              onChange={handleChange}
            />
            {errors.fullPhoto1 && <span className="error">{errors.fullPhoto1}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="fullPhoto2">Full Body Photo 2*</label>
            <input
              type="file"
              id="fullPhoto2"
              name="fullPhoto2"
              onChange={handleChange}
            />
            {errors.fullPhoto2 && <span className="error">{errors.fullPhoto2}</span>}
          </div>
        </div>
        {/* Submit Button */}
        <div className="form-row">
          <button type="submit" className="report-button" disabled={isSubmitting} >Report Case</button>
        </div>
      </form>
    </div>
  );  
  
};

export default ReportUnidentifiedPersonPage;
