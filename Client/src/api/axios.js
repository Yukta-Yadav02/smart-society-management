import axios from 'axios';

// 🌐 BACKEND CONFIGURATION:
// Replace the baseURL with your production or local backend URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
