import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: false, // Set to false if not using cookies
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      const message = error.response.data?.detail || error.response.data?.message || 'Server error';
      console.error(`❌ ${error.response.status}: ${message}`);
      toast.error(message);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ No response from server');
      toast.error('Cannot connect to server. Please check if backend is running.');
    } else {
      // Something happened in setting up the request
      console.error('❌ Request error:', error.message);
      toast.error('Request failed. Please try again.');
    }
    return Promise.reject(error);
  }
);

export const predictPrice = async (features) => {
  const response = await api.post('/predict', { features });
  return response.data;
};

export const predictBatch = async (featuresList) => {
  const response = await api.post('/predict/batch', { features: featuresList });
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/model-info');
  return response.data;
};

export const getMarketStats = async () => {
  const response = await api.get('/market/stats');
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;