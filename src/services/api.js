// src/services/api.js - Complete API Service for Revanth Reddy Chat Application
import axios from 'axios';

/**
 * Complete API Service Class
 * 
 * Think of this as the "translator" between your beautiful React interface and your backend server.
 * It handles all the complex networking, error handling, and data formatting so your components
 * can focus on creating great user experiences.
 * 
 * We use a class-based approach here because it gives us several advantages:
 * 1. Centralized configuration (all API settings in one place)
 * 2. Automatic token management (login once, authenticated everywhere)
 * 3. Consistent error handling (every request gets the same error treatment)
 * 4. Easy testing and maintenance
 */

class ApiService {
  constructor() {
    // Base configuration - this is the foundation of all our API calls
    // Think of this like setting up a telephone system - we define how all calls should work
    this.baseURL = process.env.REACT_APP_API_URL || 'https://characters-2-0.onrender.com';
    
    // Create the axios instance with default settings
    // This is like having a dedicated phone line with preset dialing rules
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds - generous for AI response times
    });

    // Set up automatic token management
    // This means users log in once and we handle authentication for all future requests
    this.setupInterceptors();
  }

  /**
   * Interceptors: The "Middleware" of API Calls
   * 
   * Think of interceptors like security guards at a building:
   * - Request interceptor: Checks everyone going IN (adds authentication tokens)
   * - Response interceptor: Handles everyone coming OUT (manages errors, redirects)
   */
  setupInterceptors() {
    // Request interceptor - automatically adds authentication token to every request
    // This means your components never have to worry about authentication headers
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log requests in development (helps with debugging)
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handles common scenarios like expired tokens
    // This provides a seamless user experience even when things go wrong
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        // Handle authentication failures gracefully
        if (error.response?.status === 401) {
          // Token expired or invalid - clean up and redirect to login
          this.logout();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        // Enhanced error logging for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.error || error.message
          });
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * AUTHENTICATION METHODS
   * 
   * These methods handle user login, registration, and session management.
   * They form the security foundation of your application.
   */

  /**
   * Register a new user
   * @param {string} username - User's chosen username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Registration response
   */
  async register(username, password) {
    try {
      const response = await this.client.post('/register', {
        username,
        password,
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Registration successful'
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Registration failed');
    }
  }

  /**
   * Login user and store authentication token
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login response with token
   */
  async login(username, password) {
    try {
      const response = await this.client.post('/login', {
        username,
        password,
      });
      
      // Store the token for future requests
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Login failed');
    }
  }

  /**
   * REVANTH REDDY CHAT METHODS
   * 
   * These are the core methods for your simplified chat application.
   * They handle all communication with Revanth Reddy specifically.
   */

  /**
   * Send a message to Revanth Reddy
   * @param {string} message - User's message
   * @param {string|null} conversationId - Optional conversation ID for continuing chats
   * @param {boolean} newSession - Whether to start a new conversation
   * @param {Object} creativitySettings - Optional AI creativity parameters
   * @returns {Promise<Object>} Chat response from Revanth Reddy
   */
  async sendMessageToRevanth(message, conversationId = null, newSession = false, creativitySettings = {}) {
    try {
      // Prepare the request payload
      // We always specify 'revanth-reddy' as the character since this is a focused app
      const requestData = {
        character_name: 'revanth-reddy', // Always chat with Revanth Reddy
        user_input: message,
        new_session: newSession,
        conversation_id: conversationId,
        ...creativitySettings, // Spread any additional AI parameters
      };

      const response = await this.client.post('/chat', requestData);
      
      return {
        success: true,
        response: response.data.response || response.data.message,
        conversationId: response.data.session_id || response.data.conversation_id,
        character: 'revanth-reddy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Failed to send message to Revanth Reddy');
    }
  }

  /**
   * Start a new conversation with Revanth Reddy
   * @returns {Promise<Object>} New conversation initialization
   */
  async startNewConversationWithRevanth() {
    try {
      const welcomeMessage = "Hello! I'm A. Revanth Reddy, Chief Minister of Telangana. I'm here to discuss governance, policy initiatives, and answer any questions you might have about our state's development. How can I assist you today?";
      
      // Start with a predefined welcome message to ensure consistency
      return {
        success: true,
        response: welcomeMessage,
        conversationId: null, // Will be set with first user message
        character: 'revanth-reddy',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Failed to start new conversation');
    }
  }

  /**
   * CONVERSATION MANAGEMENT
   * 
   * These methods handle conversation history and session management.
   * Even in a simplified app, users appreciate being able to continue conversations.
   */

  /**
   * Get conversation history with Revanth Reddy
   * @param {string} conversationId - ID of the conversation to retrieve
   * @returns {Promise<Object>} Conversation messages
   */
  async getRevanthConversation(conversationId) {
    try {
      const response = await this.client.get(`/get_session_messages?session_id=${conversationId}`);
      
      return {
        success: true,
        messages: response.data.messages || [],
        conversationId: conversationId,
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Failed to retrieve conversation');
    }
  }

  /**
   * Get all user's conversations with Revanth Reddy
   * @returns {Promise<Object>} List of user's conversations
   */
  async getRevanthConversations() {
    try {
      const response = await this.client.get('/get_sessions');
      
      // Filter for only Revanth Reddy conversations if your backend stores multiple characters
      const revanthConversations = response.data.filter
        ? response.data.filter(session => session.character === 'revanth-reddy')
        : response.data;
      
      return {
        success: true,
        conversations: revanthConversations,
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Failed to retrieve conversations');
    }
  }

  /**
   * Delete a specific conversation
   * @param {string} conversationId - ID of conversation to delete
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteRevanthConversation(conversationId) {
    try {
      const response = await this.client.delete(`/sessions/${conversationId}`);
      
      return {
        success: true,
        message: 'Conversation deleted successfully',
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Failed to delete conversation');
    }
  }

  /**
   * UTILITY METHODS
   * 
   * These are helper methods that support the main functionality.
   * They handle things like authentication checking and error formatting.
   */

  /**
   * Logout user and clean up session
   */
  logout() {
    localStorage.removeItem('token');
    // You might also want to clear other stored data here
    localStorage.removeItem('userPreferences');
    localStorage.removeItem('conversationHistory');
  }

  /**
   * Check if user is currently authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      // If token is malformed, consider user not authenticated
      return false;
    }
  }

  /**
   * Get user information from stored token
   * @returns {Object|null} User information or null if not available
   */
  getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.user_id || payload.sub,
        username: payload.username,
        exp: payload.exp,
      };
    } catch {
      return null;
    }
  }

  /**
   * Check if the backend server is available
   * @returns {Promise<boolean>} Server availability status
   */
  async isServerAvailable() {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * ERROR HANDLING SYSTEM
   * 
   * This creates consistent error responses throughout your application.
   * Instead of different components handling errors differently, they all get
   * the same format, making your UI more predictable and easier to debug.
   */

  /**
   * Create a standardized error response
   * @param {Error} error - The original error
   * @param {string} defaultMessage - Fallback message if error details unavailable
   * @returns {Error} Formatted error object
   */
  createErrorResponse(error, defaultMessage) {
    if (error.response) {
      // Server responded with an error status
      const { status, data } = error.response;
      
      // Create user-friendly messages based on status codes
      const statusMessages = {
        400: data.error || 'Invalid request. Please check your input.',
        401: 'Please log in to continue.',
        403: 'You don\'t have permission to perform this action.',
        404: 'The requested resource was not found.',
        429: 'Too many requests. Please wait a moment and try again.',
        500: 'Server error. Our team has been notified.',
        502: 'Service temporarily unavailable. Please try again later.',
        503: 'Service temporarily unavailable. Please try again later.',
      };
      
      const message = statusMessages[status] || data.error || defaultMessage;
      
      const errorObj = new Error(message);
      errorObj.status = status;
      errorObj.code = data.code;
      return errorObj;
    } else if (error.request) {
      // Network error - no response received
      const errorObj = new Error('Network connection failed. Please check your internet connection.');
      errorObj.status = 0;
      errorObj.code = 'NETWORK_ERROR';
      return errorObj;
    } else {
      // Something else happened
      const errorObj = new Error(error.message || defaultMessage);
      errorObj.status = -1;
      errorObj.code = 'UNKNOWN_ERROR';
      return errorObj;
    }
  }

  /**
   * FUTURE-PROOFING METHODS
   * 
   * These methods aren't used in your current simplified app,
   * but they're here in case you want to expand functionality later.
   */

  /**
   * Update user preferences
   * @param {Object} preferences - User preference object
   * @returns {Promise<Object>} Update confirmation
   */
  async updateUserPreferences(preferences) {
    try {
      const response = await this.client.put('/user/preferences', preferences);
      return {
        success: true,
        preferences: response.data,
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Failed to update preferences');
    }
  }

  /**
   * Get system status and announcements
   * @returns {Promise<Object>} System status information
   */
  async getSystemStatus() {
    try {
      const response = await this.client.get('/system/status');
      return {
        success: true,
        status: response.data,
      };
    } catch (error) {
      throw this.createErrorResponse(error, 'Failed to get system status');
    }
  }
}

// Export a single instance (singleton pattern)
// This ensures all parts of your app use the same API configuration and state
const apiService = new ApiService();
export default apiService;