import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,
      params
    });
    return response.data;
  } catch (error) {
    console.error("API ERROR:", error.response?.data?.message || error.message);
    throw error?.response?.data || error;
  }
};