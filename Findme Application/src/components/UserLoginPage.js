import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLoginPage.css'; 

const UserLoginPage = () => {
    const navigate = useNavigate();

    const handleRoleClick = (role) => {
        navigate(`/${role}loginPage`);
    };

    return (
        <div className='user-login-page'>
            <div className="custom-login-containerer">
                <h2 className="custom-login-title">Select User Type</h2>
                <div className="custom-role-selection">
                    <div className="custom-role-card" onClick={() => handleRoleClick('citizen')}>
                        <h3>Citizen</h3>
                    </div>
                    <div className="custom-role-card" onClick={() => handleRoleClick('police')}>
                        <h3>Police</h3>
                    </div>
                    <div className="custom-role-card" onClick={() => handleRoleClick('admin')}>
                        <h3>Admin</h3>
                    </div>
                </div>
            </div>
        </div>    
    );
};

export default UserLoginPage;
