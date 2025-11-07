import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Privacy.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container"> 
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p>
          <u>1. Introduction </u><br />
          Welcome to the FindMe application. Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our platform. By accessing or using our services, you agree to the terms of this Privacy Policy.<br /><br />

          <u>2. Information We Collect </u><br />
          We may collect and process the following types of information:<br />
          - Personal Information: Includes your name, email address, phone number, National ID number, and other identifiers.<br />
          - Profile Information: Includes your username, password, and account preferences.<br />
          - User Content: Any information you upload or submit to our platform, such as reports of missing persons, images, and descriptions.<br />
          - Usage Data: Information about how you use our services, including your IP address, browser type, and access times.<br /><br />

          <u>3. How We Use Your Information </u><br />
          We use the information we collect for various purposes, including:<br />
          - Providing and Improving Services: To operate, maintain, and enhance the platform's functionality.<br />
          - Communication: To send you notifications, updates, and administrative messages.<br />
          - Safety and Security: To protect the safety and security of our users and the platform.<br />
          - Compliance: To comply with legal obligations and enforce our terms and conditions.<br /><br />

          <u>4. Information Sharing and Disclosure </u><br />
          We may share your information with:<br />
          - Law Enforcement and Authorities: To assist in locating and identifying missing persons and for other legal purposes.<br />
          - Service Providers: Third-party vendors who assist us in operating the platform and providing services.<br />
          - Other Users: Information you choose to share publicly on the platform may be accessible to other users.<br />
          - Legal Compliance: When required by law, legal process, or government request.<br /><br />

          <u>5. Data Security </u><br />
          We implement various security measures to protect your information from unauthorized access, use, or disclosure. However, no data transmission over the internet or electronic storage is completely secure, so we cannot guarantee absolute security.<br /><br />

          <u>6. User Rights </u><br />
          You have the right to:<br />
          - Access Your Information: Request a copy of the personal information we hold about you.<br />
          - Update or Correct Information: Request corrections or updates to your personal information.<br />
          - Delete Your Account: Request the deletion of your account and personal information.<br /><br />

          <u>7. Children's Privacy </u><br />
          Our platform is intended for users who are adults and national ID card holders. We do not knowingly collect information from children under the age of 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information.<br /><br />

          <u>8. Changes to This Privacy Policy </u><br />
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our platform. You are advised to review this Privacy Policy periodically for any changes.<br /><br />

          <u>9. Contact Us </u><br />
          If you have any questions or concerns about this Privacy Policy, please contact us at:<br />
          <p className="blue-text"><strong>Phone:</strong> +254768126967</p>
          <p className="blue-text"><strong>Email:</strong> Jonahkimani254@gmail.com</p>
        </p>

        <button onClick={() => navigate('/register')} className="back-button">Back to Registration</button>
      </div>
    </div>
  );
};

export default Privacy;
