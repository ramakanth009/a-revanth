// src/components/dashboard/SimpleChat.jsx - Pure Backend Integration
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Fade,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close, Send, Refresh, History } from '@mui/icons-material';
import apiService from '../../services/api';

// All styled components remain the same as before...
const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1e1e1e',
  borderLeft: '1px solid #333',
  position: 'relative',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: '1px solid #333',
  backgroundColor: '#252525',
  gap: theme.spacing(2),
}));

const HeaderInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const HeaderName = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#ffffff',
  lineHeight: 1.2,
}));

const OnlineStatus = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: '#4CAF50',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const OnlineDot = styled(Box)({
  width: 8,
  height: 8,
  backgroundColor: '#4CAF50',
  borderRadius: '50%',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 },
  },
});

const MessagesArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#444',
    borderRadius: 3,
  },
}));

const MessageBubble = styled(Paper)(({ theme, isUser, isError }) => ({
  maxWidth: '75%',
  padding: theme.spacing(1.5, 2),
  marginLeft: isUser ? 'auto' : 0,
  marginRight: isUser ? 0 : 'auto',
  backgroundColor: isError ? '#d32f2f' : (isUser ? '#667eea' : '#333'),
  color: '#ffffff',
  borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  wordBreak: 'break-word',
}));

const MessageText = styled(Typography)({
  fontSize: '0.95rem',
  lineHeight: 1.4,
});

const MessageTime = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: '#888',
  textAlign: 'center',
  marginTop: theme.spacing(0.5),
}));

const MessageAvatar = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  marginRight: theme.spacing(1),
  alignSelf: 'flex-end',
}));

const MessageWithAvatar = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 8,
});

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: '1px solid #333',
  backgroundColor: '#252525',
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
}));

const MessageInput = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1e1e1e',
    borderRadius: 24,
    color: '#ffffff',
    fontSize: '0.95rem',
    
    '& fieldset': {
      borderColor: '#444',
    },
    '&:hover fieldset': {
      borderColor: '#555',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
    '&::placeholder': {
      color: '#888',
    },
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#667eea',
  color: '#ffffff',
  width: 48,
  height: 48,
  '&:hover': {
    backgroundColor: '#5a6fd8',
  },
  '&:disabled': {
    backgroundColor: '#444',
    color: '#888',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const ErrorAlert = styled(Alert)(({ theme }) => ({
  margin: theme.spacing(2),
  backgroundColor: '#d32f2f',
  color: '#ffffff',
  '& .MuiAlert-icon': {
    color: '#ffffff',
  },
}));

const SimpleChat = ({ onClose }) => {
  // Core state management - all connected to real backend data
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [serverStatus, setServerStatus] = useState('connecting');
  const messagesEndRef = useRef(null);

  /**
   * BACKEND INTEGRATION: Component Initialization
   * 
   * When the chat opens, we need to:
   * 1. Check if the backend server is available
   * 2. Initialize a new conversation with Revanth Reddy
   * 3. Load any existing conversation if user has one
   * 
   * This is like opening a phone app - first check for signal, then dial the number
   */
  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Initialize chat with real backend connection
   * This replaces any dummy welcome messages with actual server communication
   */
  const initializeChat = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      setServerStatus('connecting');

      // Step 1: Verify backend server is available
      const isServerUp = await apiService.isServerAvailable();
      if (!isServerUp) {
        throw new Error('Unable to connect to chat service. Please try again later.');
      }

      setServerStatus('connected');

      // Step 2: Check if user has any existing conversations with Revanth Reddy
      const conversationsResult = await apiService.getRevanthConversations();
      
      if (conversationsResult.success && conversationsResult.conversations.length > 0) {
        // User has previous conversations - load the most recent one
        const mostRecentConversation = conversationsResult.conversations[0];
        setConversationId(mostRecentConversation.session_id);
        
        // Load conversation history
        await loadConversationHistory(mostRecentConversation.session_id);
      } else {
        // No previous conversations - start fresh with real backend initialization
        await startNewConversation();
      }

    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setError(error.message);
      setServerStatus('error');
    } finally {
      setIsInitializing(false);
    }
  };

  /**
   * Start a completely new conversation with the backend
   * This creates a real session with Revanth Reddy, not a simulated one
   */
  const startNewConversation = async () => {
    try {
      setIsLoading(true);
      
      // Send an initial message to the backend to start the conversation
      // This will create a real session and return Revanth Reddy's actual greeting
      const result = await apiService.sendMessageToRevanth(
        "Hello", // Simple greeting to start the conversation
        null, // No existing conversation ID
        true // Explicitly request new session
      );

      if (result.success) {
        setConversationId(result.conversationId);
        
        // Add the real welcome message from the backend
        const welcomeMessage = {
          id: Date.now(),
          text: result.response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages([welcomeMessage]);
      } else {
        throw new Error('Failed to start conversation with Revanth Reddy');
      }
    } catch (error) {
      console.error('Error starting new conversation:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load existing conversation history from backend
   * This retrieves real message history, not placeholder data
   */
  const loadConversationHistory = async (sessionId) => {
    try {
      const result = await apiService.getRevanthConversation(sessionId);
      
      if (result.success) {
        // Transform backend message format to our UI format
        const formattedMessages = result.messages.map((msg, index) => ({
          id: `${sessionId}-${index}`,
          text: msg.content || msg.message,
          isUser: msg.role === 'user',
          timestamp: msg.timestamp 
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        
        setMessages(formattedMessages);
      } else {
        throw new Error('Failed to load conversation history');
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      // If we can't load history, start fresh
      await startNewConversation();
    }
  };

  /**
   * BACKEND INTEGRATION: Real Message Sending
   * 
   * This completely replaces the setTimeout simulation with actual API calls
   * Every message goes to the real backend and returns real responses
   */
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic update - show user message immediately for responsive UI
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Real backend call - no simulation, no setTimeout
      const result = await apiService.sendMessageToRevanth(
        messageToSend,
        conversationId,
        false // Not a new session, continuing existing conversation
      );
      
      if (result.success) {
        // Add real response from Revanth Reddy via backend
        const botResponse = {
          id: Date.now() + 1,
          text: result.response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages(prev => [...prev, botResponse]);
        
        // Update conversation ID if this was the first message in a new conversation
        if (result.conversationId && !conversationId) {
          setConversationId(result.conversationId);
        }
      } else {
        throw new Error('Failed to get response from Revanth Reddy');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show user-friendly error message in the chat
      const errorMessage = {
        id: Date.now() + 1,
        text: `I apologize, but I'm experiencing technical difficulties. ${error.message} Please try again in a moment.`,
        isUser: false,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle starting a completely new conversation
   * This clears current state and creates a fresh backend session
   */
  const handleNewConversation = async () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    await startNewConversation();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Show loading state while initializing backend connection
  if (isInitializing) {
    return (
      <ChatContainer>
        <LoadingContainer>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: '#667eea', mb: 2 }} />
            <Typography color="#888">
              {serverStatus === 'connecting' ? 'Connecting to Revanth Reddy...' : 'Initializing conversation...'}
            </Typography>
          </Box>
        </LoadingContainer>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      {/* Header with real online status */}
      <ChatHeader>
        <Avatar
          src="/assets/revanth-reddy.jpg"
          alt="A. Revanth Reddy"
          sx={{ width: 40, height: 40 }}
        />
        
        <HeaderInfo>
          <HeaderName>A. Revanth Reddy</HeaderName>
          <OnlineStatus>
            <OnlineDot />
            {serverStatus === 'connected' ? 'Online now' : 'Connecting...'}
          </OnlineStatus>
        </HeaderInfo>

        <IconButton
          onClick={handleNewConversation}
          sx={{ color: '#888', '&:hover': { color: '#ffffff' } }}
          title="Start New Conversation"
        >
          <Refresh />
        </IconButton>

        <IconButton
          onClick={onClose}
          sx={{ color: '#888', '&:hover': { color: '#ffffff' } }}
        >
          <Close />
        </IconButton>
      </ChatHeader>

      {/* Show error alert if there are connection issues */}
      {error && (
        <ErrorAlert severity="error" onClose={() => setError(null)}>
          Connection Issue: {error}
        </ErrorAlert>
      )}

      {/* Messages Area with real backend data */}
      <MessagesArea>
        <MessagesContainer>
          {messages.map((message) => (
            <Fade key={message.id} in timeout={300}>
              <Box>
                {message.isUser ? (
                  <MessageBubble isUser={true} isError={message.isError}>
                    <MessageText>{message.text}</MessageText>
                  </MessageBubble>
                ) : (
                  <MessageWithAvatar>
                    <MessageAvatar
                      src="/assets/revanth-reddy.jpg"
                      alt="A. Revanth Reddy"
                    />
                    <MessageBubble isUser={false} isError={message.isError}>
                      <MessageText>{message.text}</MessageText>
                    </MessageBubble>
                  </MessageWithAvatar>
                )}
                <MessageTime>{message.timestamp}</MessageTime>
              </Box>
            </Fade>
          ))}

          {/* Real-time loading indicator during backend communication */}
          {isLoading && (
            <MessageWithAvatar>
              <MessageAvatar
                src="/assets/revanth-reddy.jpg"
                alt="A. Revanth Reddy"
              />
              <MessageBubble isUser={false}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: '#888' }} />
                  <MessageText>Revanth Reddy is typing...</MessageText>
                </Box>
              </MessageBubble>
            </MessageWithAvatar>
          )}

          <div ref={messagesEndRef} />
        </MessagesContainer>
      </MessagesArea>

      {/* Input Area */}
      <InputArea>
        <MessageInput
          placeholder="Type your message to Revanth Reddy..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          disabled={isLoading || serverStatus !== 'connected'}
        />
        
        <SendButton
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading || serverStatus !== 'connected'}
        >
          <Send />
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
};

export default SimpleChat;