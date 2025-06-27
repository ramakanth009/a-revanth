import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Alert,
  Chip,
} from '@mui/material';
import { 
  Close, 
  Add,
  Tune,
  History as HistoryIcon,
  ArrowBack,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import apiService from '../../services/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatHistoryPanel from './ChatHistoryPanel';

const ChatContainer = styled(Box)(({ theme, open }) => ({
  backgroundColor: 'rgba(20, 20, 30, 0.85)',
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'fixed', // Changed from absolute to fixed
  right: 0,
  top: 0,
  height: '100vh',
  height: '100dvh', // Use dynamic viewport height for mobile
  zIndex: 1000,
  width: open ? '100%' : 0, // Changed from 100vw to 100%
  left: 0,
  
  // Remove all the complex media queries for width - just use 100%
  '@media (max-width: 768px)': {
    width: open ? '100%' : 0,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  position: 'sticky', // Changed from fixed to sticky
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1.5),
  backgroundColor: 'rgba(20, 20, 30, 0.95)',
  backdropFilter: 'blur(10px)',
  zIndex: 1001,
  flexShrink: 0, // Prevent header from shrinking
  
  // Add safe area support for mobile devices
  paddingTop: 'max(env(safe-area-inset-top), 16px)',
  paddingLeft: 'max(env(safe-area-inset-left), 16px)',
  paddingRight: 'max(env(safe-area-inset-right), 16px)',
  
  '@media (max-width: 768px)': {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1),
  },
  
  '@media (max-width: 480px)': {
    padding: theme.spacing(1),
    gap: theme.spacing(0.5),
  },
}));

const ChatHeaderTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '48px', // Ensure minimum touch target size
}));

const ChatHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
  minWidth: 0,
  
  '@media (max-width: 768px)': {
    gap: theme.spacing(1),
  },
  
  '@media (max-width: 480px)': {
    gap: theme.spacing(0.5),
  },
}));

const CharacterInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const CharacterDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
  
  '@media (max-width: 768px)': {
    fontSize: '0.8rem',
  },
  
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

const ChatHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  
  '@media (max-width: 480px)': {
    gap: theme.spacing(0.25),
  },
}));

const ResponsiveIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  minWidth: '44px', // Ensure minimum touch target
  minHeight: '44px',
  
  '@media (max-width: 768px)': {
    padding: theme.spacing(0.75),
    minWidth: '40px',
    minHeight: '40px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
  
  '@media (max-width: 480px)': {
    padding: theme.spacing(0.5),
    minWidth: '36px',
    minHeight: '36px',
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
    },
  },
}));

const ResponsiveAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 1,
  
  '@media (max-width: 768px)': {
    width: 36,
    height: 36,
  },
  
  '@media (max-width: 480px)': {
    width: 32,
    height: 32,
  },
}));

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  
  '@media (max-width: 768px)': {
    fontSize: '1.1rem',
  },
  
  '@media (max-width: 480px)': {
    fontSize: '1rem',
  },
}));

const ResponsiveChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.7rem',
  height: 20,
  
  '@media (max-width: 768px)': {
    fontSize: '0.65rem',
    height: 18,
  },
  
  '@media (max-width: 480px)': {
    fontSize: '0.6rem',
    height: 16,
  },
}));

// Main content area that scrolls
const MessagesWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto', // Changed to auto for better scrolling
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0, // Important for flex scrolling
  
  // Remove fixed padding - let it be dynamic
  padding: theme.spacing(1),
  
  '@media (max-width: 768px)': {
    padding: theme.spacing(0.5),
  },
}));

// Fixed input at bottom
const InputWrapper = styled(Box)(({ theme }) => ({
  flexShrink: 0, // Prevent input from shrinking
  backgroundColor: 'rgba(20, 20, 30, 0.95)',
  backdropFilter: 'blur(10px)',
  borderTop: `1px solid ${theme.palette.divider}`,
  
  // Add safe area support for bottom
  paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
  paddingLeft: 'max(env(safe-area-inset-left), 8px)',
  paddingRight: 'max(env(safe-area-inset-right), 8px)',
}));

const ResponsiveAlert = styled(Alert)(({ theme }) => ({
  margin: theme.spacing(1),
  
  '@media (max-width: 768px)': {
    fontSize: '0.8rem',
    margin: theme.spacing(0.5),
  },
  
  '@media (max-width: 480px)': {
    fontSize: '0.75rem',
  },
}));

const ChatPanel = ({ open, character, onClose, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && character) {
      initializeChat();
      loadUserSessions();
    }
  }, [open, character]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    setMessages([
      {
        role: character.name,
        content: `హలో! నేను మీ ${character.name}. ఎట్లున్నారు?`,
      },
    ]);
    setError(null);
    setSessionId(null);
  };

  const loadUserSessions = async () => {
    try {
      const userSessions = await apiService.getSessions();
      const characterSessions = userSessions.filter(s => s.character === character.name);
      setSessions(characterSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadSession = async (sessionIdToLoad) => {
    try {
      setLoading(true);
      const sessionData = await apiService.getSessionMessages(sessionIdToLoad);
      
      const formattedMessages = sessionData.chat_history.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      setMessages(formattedMessages);
      setSessionId(sessionIdToLoad);
      setShowHistory(false);
      setError(null);
    } catch (error) {
      console.error('Failed to load session:', error);
      setError('Failed to load conversation history');
    } finally {
      setLoading(false);
    }
  };

  const startNewSession = () => {
    initializeChat();
    setShowHistory(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading || !character) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setLoading(true);
    setError(null);

    const newUserMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await apiService.sendMessage(
        character.name, 
        userMessage, 
        !sessionId
      );
      
      if (response.chat_history) {
        const formattedMessages = response.chat_history.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        setMessages(formattedMessages);
      } else {
        setMessages(prev => [...prev, { 
          role: character.name, 
          content: response.reply 
        }]);
      }
      
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      await loadUserSessions();
      
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.response?.data?.error || 'Failed to send message. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const handleHistoryClose = () => {
    setShowHistory(false);
  };

  if (!open || !character) {
    return <ChatContainer open={false} />;
  }

  return (
    <>
      <ChatContainer open={open}>
        <ChatHeader>
          <ChatHeaderTop>
            <ChatHeaderLeft>
              <ResponsiveIconButton 
                onClick={handleBackClick}
                title="Back to Characters"
              >
                <ArrowBack />
              </ResponsiveIconButton>
              <ResponsiveAvatar
                src={character.img}
                alt={character.name}
              />
              <CharacterInfo>
                <ResponsiveTypography variant="h6" noWrap>
                  {character.name}
                </ResponsiveTypography>
                {sessionId && (
                  <ResponsiveChip 
                    label={`Session ${sessionId}`} 
                    size="small"
                  />
                )}
              </CharacterInfo>
            </ChatHeaderLeft>
            
            <ChatHeaderRight>
              {/* <ResponsiveIconButton 
                onClick={() => setShowHistory(true)}
                title="Chat History"
              >
                <HistoryIcon />
              </ResponsiveIconButton> */}
              
              <ResponsiveIconButton 
                onClick={startNewSession}
                title="New Conversation"
              >
                <Add />
              </ResponsiveIconButton>
              
              <ResponsiveIconButton onClick={onClose}>
                <Close />
              </ResponsiveIconButton>
            </ChatHeaderRight>
          </ChatHeaderTop>
          
          {character.description && (
            <CharacterDescription>
              {character.description}
            </CharacterDescription>
          )}
        </ChatHeader>

        {error && (
          <ResponsiveAlert severity="error" onClose={() => setError(null)}>
            {error}
          </ResponsiveAlert>
        )}

        <MessagesWrapper>
          <MessageList 
            messages={messages} 
            loading={loading} 
            ref={messagesEndRef} 
          />
        </MessagesWrapper>

        <InputWrapper>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            loading={loading}
          />
        </InputWrapper>
      </ChatContainer>

      <ChatHistoryPanel
        open={showHistory}
        onClose={handleHistoryClose}
        sessions={sessions}
        currentSessionId={sessionId}
        onSessionSelect={loadSession}
        onNewSession={startNewSession}
        characterName={character.name}
      />
    </>
  );
};

export default ChatPanel;