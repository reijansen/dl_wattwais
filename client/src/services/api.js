import axios from 'axios';

// Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// =======================
// PREDICTION API FUNCTIONS
// =======================

/**
 * Predict electricity demand
 * @param {Object} inputData - Form data with 11 fields
 * @returns {Object} Prediction response with hourly, daily, monthly, and bill estimates
 */
export const predictDemand = async (inputData) => {
  try {
    const response = await api.post('/predict', inputData);
    
    // Check if response was successful
    if (response.data.success) {
      return {
        success: true,
        data: response.data.prediction,
        metadata: response.data.metadata,
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Prediction failed',
        details: response.data.details || [],
      };
    }
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Backend returned error response
      return {
        success: false,
        error: error.response.data?.error || 'Backend error',
        details: error.response.data?.details || error.message,
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        error: 'No response from backend',
        details: 'Backend server is not running or unreachable at http://localhost:5000',
      };
    } else {
      // Error in request setup
      return {
        success: false,
        error: 'Request error',
        details: error.message,
      };
    }
  }
};

/**
 * Check if backend is running
 * @returns {Object} Backend status information
 */
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/');
    
    return {
      success: true,
      status: 'Backend is running',
      data: response.data,
    };
  } catch (error) {
    // Handle different error types
    if (error.response) {
      return {
        success: false,
        error: 'Backend error',
        status: error.response.status,
        details: error.response.data || error.message,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Backend is not running',
        details: 'Cannot reach backend server at http://localhost:5000. Make sure the backend is started with "npm run dev" in the server folder.',
      };
    } else {
      return {
        success: false,
        error: 'Connection error',
        details: error.message,
      };
    }
  }
};

/**
 * Test connection with sample data
 * @returns {Object} Test result
 */
export const testPredictionWithSampleData = async () => {
  const sampleData = {
    hour: 14,
    day_of_week: 3,
    month: 5,
    is_weekend: 0,
    electricity_rate_php_kwh: 7.50,
    temperature: 25.5,
    last_hour_kwh: 2.5,
    same_hour_yesterday_kwh: 2.3,
    same_hour_last_week_kwh: 2.4,
    avg_24h_kwh: 2.2,
    avg_7d_kwh: 2.1,
  };

  return await predictDemand(sampleData);
};

export default api;
