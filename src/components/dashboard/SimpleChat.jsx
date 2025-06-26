// src/components/dashboard/SimpleChat.jsx
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close, Send, ArrowBack } from '@mui/icons-material';

// The main chat container - think of this as a clean, focused conversation space
// We want users to feel like they're having a private conversation with Revanth Reddy
const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1e1e1e',
  borderLeft: '1px solid #333',
  position: 'relative',
}));

// Chat header shows who you're talking to - simple and clean
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
  minWidth: 0, // Allows text to truncate if needed
});

const HeaderName = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#ffffff',
  lineHeight: 1.2,
}));

const OnlineStatus = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: '#4CAF50', // Green to show "online"
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

// Messages area - this is where the conversation flows
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
  
  // Custom scrollbar styling
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

// Individual message styling - different for user vs Revanth Reddy
const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  maxWidth: '75%',
  padding: theme.spacing(1.5, 2),
  marginLeft: isUser ? 'auto' : 0,
  marginRight: isUser ? 0 : 'auto',
  backgroundColor: isUser ? '#667eea' : '#333',
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

// Avatar for Revanth Reddy's messages
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

// Input area for typing messages
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

// Welcome message component
const WelcomeMessage = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  color: '#888',
}));

const SimpleChat = ({ onClose }) => {
  // Simple state management - just messages and input
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm A. Revanth Reddy, Chief Minister of Telangana. I'm here to discuss governance, policy initiatives, and answer any questions you might have about our state's development. How can I assist you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Here you would integrate with your API service
      // For now, we'll simulate a response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: "Thank you for your question. As Chief Minister, I'm committed to transparent governance and citizen engagement. Could you please share more details about what specific aspect you'd like to discuss?",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      {/* Header */}
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
            Online now
          </OnlineStatus>
        </HeaderInfo>

        <IconButton
          onClick={onClose}
          sx={{ color: '#888', '&:hover': { color: '#ffffff' } }}
        >
          <Close />
        </IconButton>
      </ChatHeader>

      {/* Messages Area */}
      <MessagesArea>
        <MessagesContainer>
          {messages.length === 1 && (
            <WelcomeMessage>
              <Typography variant="body2">
                You're now chatting with A. Revanth Reddy
              </Typography>
            </WelcomeMessage>
          )}

          {messages.map((message) => (
            <Fade key={message.id} in timeout={300}>
              <Box>
                {message.isUser ? (
                  <MessageBubble isUser={true}>
                    <MessageText>{message.text}</MessageText>
                  </MessageBubble>
                ) : (
                  <MessageWithAvatar>
                    <MessageAvatar
                      src="/assets/revanth-reddy.jpg"
                      alt="A. Revanth Reddy"
                    />
                    <MessageBubble isUser={false}>
                      <MessageText>{message.text}</MessageText>
                    </MessageBubble>
                  </MessageWithAvatar>
                )}
                <MessageTime>{message.timestamp}</MessageTime>
              </Box>
            </Fade>
          ))}

          {isLoading && (
            <MessageWithAvatar>
              <MessageAvatar
                src="/assets/revanth-reddy.jpg"
                alt="A. Revanth Reddy"
              />
              <MessageBubble isUser={false}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: '#888' }} />
                  <MessageText>Typing...</MessageText>
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
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          disabled={isLoading}
        />
        
        <SendButton
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
        >
          <Send />
        </SendButton>
      </InputArea>
    </ChatContainer>
  );
};

export default SimpleChat;