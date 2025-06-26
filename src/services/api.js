import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://characters-2-0.onrender.com';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout for AI responses
    });

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Enhanced response interceptor with better error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        // Log errors for debugging (remove in production)
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(username, password) {
    try {
      const response = await this.client.post('/register', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Registration failed');
    }
  }

  async login(username, password) {
    try {
      const response = await this.client.post('/login', {
        username,
        password,
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    }
  }

  // Character endpoints
  async getCharacters() {
    try {
      const response = await this.client.get('/characters');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to load characters');
    }
  }

  // Chat endpoints with enhanced error handling
  async sendMessage(characterName, userInput, newSession = false, creativitySettings = {}) {
    try {
      const requestData = {
        character_name: characterName,
        user_input: userInput,
        new_session: newSession,
        ...creativitySettings,
      };

      const response = await this.client.post('/chat', requestData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to send message');
    }
  }

  // Session management endpoints
  async getSessions() {
    try {
      const response = await this.client.get('/get_sessions');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to load sessions');
    }
  }

  async getSessionMessages(sessionId) {
    try {
      const response = await this.client.get(`/get_session_messages?session_id=${sessionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to load session messages');
    }
  }

  // Character management (if you add these endpoints later)
  async createCharacter(characterData) {
    try {
      const response = await this.client.post('/characters', characterData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create character');
    }
  }

  async updateCharacter(characterId, characterData) {
    try {
      const response = await this.client.put(`/characters/${characterId}`, characterData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update character');
    }
  }

  async deleteCharacter(characterId) {
    try {
      const response = await this.client.delete(`/characters/${characterId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to delete character');
    }
  }

  // Enhanced error handling
  handleError(error, defaultMessage) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.error || 'Invalid request');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('Access forbidden');
        case 404:
          return new Error('Resource not found');
        case 429:
          return new Error('Too many requests. Please try again later.');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(data.error || defaultMessage);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || defaultMessage);
    }
  }

  // Utility methods
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Basic JWT token validation (check if it's expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  // Get user info from token
  getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.user_id,
        exp: payload.exp
      };
    } catch {
      return null;
    }
  }

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Health check failed');
    }
  }

  // Helper method to check if backend is available
  async isBackendAvailable() {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

export default new ApiService();