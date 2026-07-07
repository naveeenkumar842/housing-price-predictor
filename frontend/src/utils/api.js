import axios from 'axios';
import toast from 'react-hot-toast';

// Use the EXACT backend URL
const API_BASE_URL = 'https://housing-backend-lsfd.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Add a request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 Sending ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Received ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      const message = error.response.data?.detail || error.response.data?.message || 'Server error';
      toast.error(message);
    } else if (error.request) {
      toast.error('Cannot connect to server. Please check your network.');
    } else {
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