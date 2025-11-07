// src/components/ManageUserPasswords.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManageUserPasswords.css';

const ManageUserPasswords = () => {
    const [data, setData] = useState([]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Admin');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const createUser = () => {
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        axios.post('http://localhost:8000/api/create-user/', { email, role })
            .then(response => {
                alert(`User created! ID: ${response.data.userId}, Password: ${response.data.password}`);
                setData([...data, response.data]);
                setEmail('');
                setRole('Admin');
            })
            .catch(error => console.error('Error creating user:', error));
    };

    const updateUser = (userId, email, password) => {
        axios.post('http://localhost:8000/api/update-user/', { userId, email, password })
            .then(response => {
                alert(response.data.message);
                setData(data.map(user => (user.userId === userId ? { ...user, email } : user)));
            })
            .catch(error => console.error('Error updating user:', error));
    };

    const viewTable = () => {
        document.getElementById('userTable').style.display = 'table';
    };

    return (
        <div className="manage-user-container">
            <h1>Manage Admins and Police</h1>
            <div className="manage-user-form-group">
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="manage-user-input"
                />
            </div>
            <div className="manage-user-form-group">
                <label>Role:</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="manage-user-select">
                    <option value="Admin">Admin</option>
                    <option value="Police">Police</option>
                </select>
            </div>
            <button className="manage-user-btn" onClick={createUser}>Create User</button>
            <button className="manage-user-btn" onClick={viewTable}>View Users</button>

            <h2>Users with Predefined Passwords</h2>
            <table id="userTable" className="manage-user-table" style={{ display: 'none' }}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={e => setData(data.map(u => u.userId === user.userId ? { ...u, email: e.target.value } : u))}
                                    className="manage-user-table-input"
                                />
                            </td>
                            <td>{user.role}</td>
                            <td>
                                <button className="manage-user-btn" onClick={() => updateUser(user.userId, user.email, prompt('Enter new password (leave blank to keep current password):'))}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="manage-user-nav-btn" onClick={() => navigate('/AdminHomeWidget')}>Back to Admin Home</button>
        </div>
    );
};

export default ManageUserPasswords;
