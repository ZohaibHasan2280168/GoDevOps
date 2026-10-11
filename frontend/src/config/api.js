// Use environment variable for API URL, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Session timeout configuration (in milliseconds)
export const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

// API helper function
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log(`🌐 API Request: ${endpoint}`, {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? JSON.parse(config.body) : undefined
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    console.log(`📥 API Response: ${endpoint}`, {
      status: response.status,
      ok: response.ok,
      data
    });
    
    if (!response.ok) {
      // For validation errors, include the detailed errors
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || `Server returned ${response.status}: ${data.error || 'Unknown error'}`);
    }
    
    // If data is just a string, wrap it in an object
    if (typeof data === 'string') {
      return { data };
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error);
    throw error;
  }
};