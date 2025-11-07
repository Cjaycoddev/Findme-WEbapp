import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchItems = () => {
    return axios.get(`${API_URL}/items/`);
};

export const createItem = (itemData) => {
    return axios.post(`${API_URL}/items/`, itemData);
};
