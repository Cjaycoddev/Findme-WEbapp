import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpAndFAQs.css';

const HelpAndFAQs = () => {
    const navigate = useNavigate();

    return (
        <div className="page-container"> 
            <div className="help-faqs-container">
                <div className="help-faqs-header">
                    <button className="backk-buttonn" onClick={() => navigate('/CitizenHomeWidget')}>Back to Home</button>
                    <h1>Help and FAQs</h1>
                </div>
                <div className="help-section">
                    <h2>General Help</h2>
                    <p>If you have any questions or need assistance, please contact:</p>
                    <p>Email: support@findmeapp.com</p>
                    <p>Phone: +254 768126967</p>
                </div>
                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-item">
                        <h3>What is FindMe App?</h3>
                        <p>FindMe App is a platform designed to help locate missing persons and identify unidentified individuals. It facilitates collaboration between citizens, law enforcement, and organizations to resolve such cases efficiently.</p>
                    </div>
                    <div className="faq-item">
                        <h3>How do I create an account?</h3>
                        <p>To create an account, click on the "Register" button on the homepage and fill in the required information. Make sure to provide accurate details and a valid email address.</p>
                    </div>
                    <div className="faq-item">
                        <h3>How do I report a missing person?</h3>
                        <p>To report a missing person, log in to your account and navigate to the "Report Missing Person" page via the menu. Fill in the required details and submit the report.</p>
                    </div>
                    <div className="faq-item">
                        <h3>How do I report an unidentified person?</h3>
                        <p>To report an unidentified person, log in to your account and navigate to the "Report Unidentified Person" page via the menu. Fill in the required details and submit the report.</p>
                    </div>
                    <div className="faq-item">
                        <h3>What types of notifications will I receive?</h3>
                        <p>You will receive notifications for new matches, updates on your submitted cases, and system alerts related to the platform's functionality or cases of interest.</p>
                    </div>
                    <div className="faq-item">
                        <h3>How can I submit feedback or report an issue?</h3>
                        <p>You can submit feedback or report issues through the "Feedback" section on the app. Your input helps us improve the platform and address any challenges you face.</p>
                    </div>
                    <div className="faq-item">
                        <h3>How do I contact support?</h3>
                        <p>If you need further assistance, you can contact our support team via email at support@findmeapp.com or by phone at +254 768126967.</p>
                    </div>
                </div>
            </div>
        </div>    
    );
};

export default HelpAndFAQs;
