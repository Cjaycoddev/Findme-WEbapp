import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Terms.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container"> {/* Wrapping container for aliceblue background */}
      <div className="terms-container">
        <h1>Terms and Conditions</h1>
        <p>
          <u>1. Introduction </u><br />
          Welcome to the FindMe application. These Terms and Conditions govern your use of our platform and services. By accessing or using our services, you agree to comply with these terms. If you do not agree with any part of these terms, you must not use our platform.<br /><br />

          <u>2. Eligibility </u><br />
          To use our platform, you must be:<br />
          - An adult (18 years or older).<br />
          - A holder of a valid National ID card.<br />
          - Responsible for providing accurate and truthful information.<br /><br />

          <u>3. Account Registration </u><br />
          When creating an account, you agree to:<br />
          - Provide accurate, current, and complete information.<br />
          - Maintain the security of your password and account.<br />
          - Notify us immediately of any unauthorized use of your account.<br /><br />

          <u>4. User Responsibilities </u><br />
          As a user, you agree to:<br />
          - Use the platform responsibly and ethically.<br />
          - Not engage in any activity that could harm, disrupt, or interfere with the platform.<br />
          - Respect the privacy and rights of other users.<br />
          - Not post or share any false, misleading, or defamatory information.<br />
          - Comply with all applicable laws and regulations.<br /><br />

          <u>5. Content Ownership and Use </u><br />
          You retain ownership of the content you submit to the platform.<br />
          By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content for the purposes of providing and improving our services.<br />
          We reserve the right to remove or modify any content that violates these terms.<br /><br />

          <u>6. Privacy and Data Protection </u><br />
          Our Privacy Policy outlines how we collect, use, and protect your personal information. By using our platform, you consent to our data practices as described in the Privacy Policy.<br /><br />

          <u>7. Termination </u><br />
          We reserve the right to suspend or terminate your account if you violate these terms or engage in any conduct that we deem harmful to the platform or other users.<br /><br />

          <u>8. Limitation of Liability </u><br />
          To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the platform.<br /><br />

          <u>9. Changes to Terms and Conditions </u><br />
          We may update these Terms and Conditions from time to time. We will notify you of any changes by posting the new Terms and Conditions on our platform. You are advised to review these terms periodically for any changes.<br /><br />

          <u>10. Contact Us</u><br />
          If you have any questions or concerns about these Terms and Conditions, please contact us at:<br />
          <p className="blue-text"><strong>Email:</strong> Jonahkimani254@gmail.com</p>
        </p>

        <button onClick={() => navigate('/register')} className="back-button">Back</button>
      </div>
    </div>
  );
};

export default Terms;
