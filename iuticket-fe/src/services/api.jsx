const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, options);
    
    // Handle authentication errors
    if (response.status === 401) {
      console.error("Token expired or invalid");
      return { apiError: "Authentication failed" };
    }
    
    // Parse JSON response if the request was successful
    if (response.ok) {
      // Some endpoints might not return JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return { data };
      }
      return { data: await response.text() };
    }
    
    // Handle error responses
    const errorText = await response.text();
    return {
      apiError: `Request failed with status ${response.status}: ${errorText}`,
      status: response.status
    };
    
  } catch (err) {
    console.error("API request failed:", err);
    return { apiError: err.message || "Network error" };
  }
};

// Ticket-related API calls
export const ticketApi = {  
  // Get all tickets
  getAll: (token) => {
    return apiRequest('/api/tickets', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  // Get ticket by ID
  getById: (id, token) => {
    return apiRequest(`/api/tickets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  // Create new ticket
  create: (ticketData, token) => {
    return apiRequest('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ticketData)
    });
  },
  
  update: (id, ticketData, token) => {
    if (ticketData.dueDate === null) {
      // Workaround to allow clearing the due date (undefined results in no change)
      ticketData.dueDate = new Date(0).toISOString();
    }

    return apiRequest(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ticketData)
    });
  },
  
  // Delete ticket
  delete: (id, token) => {
    return apiRequest(`/api/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Auth-related API calls
export const authApi = {
  callback: (code) => {
    return apiRequest('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { 
          code,
          redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI 
        }
      )
    });
  },
  
  login: (token) => {
    return apiRequest('/api/auth/login', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  validateToken: (token) => {
    return apiRequest('/api/auth/validate', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

export const userApi = {
  get: (id, token) => {
    return apiRequest(`/api/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  update: (id, userData, token) => {
    return apiRequest(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
  }
}