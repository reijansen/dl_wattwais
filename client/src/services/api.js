import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Predict electricity demand
export const predictDemand = async (inputData) => {
  try {
    const response = await api.post('/predict', inputData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Health check endpoint
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
