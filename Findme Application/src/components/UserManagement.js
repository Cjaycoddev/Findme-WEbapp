import React, { useState, useEffect } from 'react';
import{ useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserManagement.css';
import { FaSearch } from 'react-icons/fa';

// Function to generate a strong 9-character password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 9; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    role: 'Admin',
    email: '',
    password: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/fetch-users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData({
      ...formData,
      role: role,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;  // Prevent multiple submissions
    setIsSubmitting(true);

    const password = generatePassword();
    const newUserData = { ...formData, password };

    // Ensure the generated password is set in formData
    setFormData({
        ...formData,
        password: password,
    });

    try {
        const response = await axios.post('http://localhost:8000/api/create-user/', newUserData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        alert('User created successfully');
        fetchUsers();
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.response && error.response.data.error === 'Email already exists') {
            alert('Error: Email already exists');
        } else {
            alert('Error creating user. Please try again.');
        }
    } finally {
        setIsSubmitting(false);
    }
};


  const handleDeleteUsers = async () => {
    try {
      await axios.post('http://localhost:8000/api/delete-users/', { user_ids: selectedUsers });
      alert('Users deleted successfully');
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error deleting users:', error);
      alert('Error deleting users. Please try again.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = searchTerm
    ? users.filter(
        (user) =>
          user.email.includes(searchTerm) || user.user_id.includes(searchTerm)
      )
    : users;

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  return (
    <div className="user-management">
      <header className="user-management-header">
        <h1>User Management</h1>
        <button onClick={() => navigate('/AdminHomeWidget')}>Back to Admin Home</button>
        <button onClick={() => document.getElementById('create-user-form').style.display = 'block'}>Create User</button>
      </header>
      <form id="create-user-form" className="user-form" onSubmit={handleCreateUser}>
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleRoleChange}>
            <option value="Admin">Admin</option>
            <option value="Police">Police</option>
          </select>
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="text" name="password" value={formData.password} readOnly />
        </label>
        <button type="submit" disabled={isSubmitting}>Create Account</button>
        <button type="button" onClick={() => document.getElementById('create-user-form').style.display = 'none'}>Cancel</button>
      </form>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search by email or user ID" value={searchTerm} onChange={handleSearch} />
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>User ID</th>
            <th>Role</th>
            <th>Email</th>
            <th>Date Registered</th> {/* Remove Password column */}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.user_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.user_id)}
                  onChange={() => handleCheckboxChange(user.user_id)}
                />
              </td>
              <td>{user.user_id}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>{new Date(user.date_registered).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUsers.length > 0 && (
        <button onClick={handleDeleteUsers} className="delete-account-button">Delete Account</button>
      )}
    </div>
  );
};

export default UserManagement;
