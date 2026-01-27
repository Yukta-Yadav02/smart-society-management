import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardAPI = {
  getDashboardData: () => api.get('/resident/dashboard'),
  getComplaints: () => api.get('/resident/complaints'),
  getMaintenance: () => api.get('/resident/maintenance'),
  getNotices: () => api.get('/resident/notices'),
};

export default api;