import axios from 'axios';
import toast from 'react-hot-toast';

// Use relative URL for Render
const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast.error(error.response.data?.detail || 'Server error');
    } else if (error.request) {
      toast.error('Cannot connect to server');
    } else {
      toast.error('Request failed');
    }
    return Promise.reject(error);
  }
);

export const predictPrice = async (features) => {
  const response = await api.post('/api/predict', { features });
  return response.data;
};

export const predictBatch = async (featuresList) => {
  const response = await api.post('/api/predict/batch', { features: featuresList });
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/api/model-info');
  return response.data;
};

export const getMarketStats = async () => {
  const response = await api.get('/api/market/stats');
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;