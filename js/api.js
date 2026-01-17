// API Configuration
const API = "https://color-game-backend1.onrender.com";

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Helper function to handle API errors
function handleApiError(error) {
  console.error('API Error:', error);
  
  if (error.message === 'Invalid or expired token') {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
  
  return error.message || 'An error occurred';
}

// Helper function to make authenticated requests
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  if (!token && !endpoint.includes('/login') && !endpoint.includes('/register')) {
    window.location.href = 'index.html';
    return;
  }
  
  const defaultOptions = {
    headers: token ? getAuthHeaders() : { 'Content-Type': 'application/json' }
  };
  
  const response = await fetch(`${API}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });
  
  return response;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API, getAuthHeaders, handleApiError, apiRequest };
}
