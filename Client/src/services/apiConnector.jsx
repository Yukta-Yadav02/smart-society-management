// src/services/apiConnector.js
import axios from "axios";

// Security configurations
const MAX_RETRIES = 3;
const TIMEOUT = 30000;
const RATE_LIMIT_DELAY = 1000;

// Rate limiting
let lastRequestTime = 0;
const requestQueue = [];

export const axiosInstance = axios.create({
  withCredentials: true,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Request interceptor for security
axiosInstance.interceptors.request.use(
  (config) => {
    // Add CSRF protection
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Sanitize URL
    if (config.url && typeof config.url === 'string') {
      config.url = config.url.replace(/[<>"']/g, '');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
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

// Rate limiting function
const rateLimit = () => {
  return new Promise((resolve) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      setTimeout(() => {
        lastRequestTime = Date.now();
        resolve();
      }, RATE_LIMIT_DELAY - timeSinceLastRequest);
    } else {
      lastRequestTime = now;
      resolve();
    }
  });
};

// Input validation
const validateInput = (data) => {
  if (!data) return data;

  if (typeof data === 'string') {
    return data.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
  }

  if (typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = value.replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return data;
};

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null,
  retries = 0
) => {
  try {
    // Rate limiting
    await rateLimit();

    // Input validation
    const sanitizedData = validateInput(bodyData);
    const sanitizedParams = validateInput(params);

    // Token validation
    const token = localStorage.getItem("token");
    if (token) {
      // Basic token format validation
      if (!/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(token)) {
        localStorage.removeItem('token');
        throw new Error('Invalid token format');
      }
      headers.Authorization = `Bearer ${token}`;
    }

    // URL validation
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL');
    }

    const response = await axiosInstance({
      method: method.toUpperCase(),
      url,
      data: ["GET", "DELETE"].includes(method.toUpperCase()) ? undefined : (sanitizedData || undefined),
      headers: {
        ...headers,
        'X-Request-ID': crypto.randomUUID?.() || Date.now().toString()
      },
      params: sanitizedParams,
    });

    return response.data;
  } catch (error) {
    console.error("API ERROR:", {
      url,
      method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    // Retry logic for network errors
    if (retries < MAX_RETRIES && (!error.response || error.response.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
      return apiConnector(method, url, bodyData, headers, params, retries + 1);
    }

    throw error?.response?.data || error;
  }
};