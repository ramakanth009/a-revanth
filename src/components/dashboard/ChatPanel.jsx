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
// import CreativitySettingsMenu from './CreativitySettingsMenu';
import ChatHistoryPanel from './ChatHistoryPanel';

const ChatContainer = styled(Box)(({ theme, open }) => ({
  backgroundColor: 'rgba(20, 20, 30, 0.85)',
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'absolute',
  right: 0,
  top: 0,
  height: '100vh',
  zIndex: 1000,
  width: open ? '100vw' : 0,
  left: 0,
  right: 'auto',
  
  '@media (max-width: 1200px)': {
    width: open ? '100vw' : 0,
  },
  
  '@media (max-width: 960px)': {
    width: open ? '100vw' : 0,
  },
  
  '@media (max-width: 600px)': {
    width: open ? '100vw' : 0,
  },
  
  '@media (max-width: 480px)': {
    width: open ? '100vw' : 0,
  },
  
  '@media (max-width: 375px)': {
    width: open ? '100vw' : 0,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1.5),
  backgroundColor: 'rgba(20, 20, 30, 0.95)',
  backdropFilter: 'blur(10px)',
  zIndex: 1001,
  
  '@media (max-width: 1200px)': {
    padding: theme.spacing(2),
    gap: theme.spacing(1.2),
  },
  
  '@media (max-width: 960px)': {
    padding: theme.spacing(1.8),
    gap: theme.spacing(1),
  },
  
  '@media (max-width: 600px)': {
    padding: theme.spacing(1.5),
    gap: theme.spacing(0.8),
  },
  
  '@media (max-width: 480px)': {
    padding: theme.spacing(1.2),
    gap: theme.spacing(0.6),
  },
  
  '@media (max-width: 375px)': {
    padding: theme.spacing(1),
    gap: theme.spacing(0.5),
  },
}));

const ChatHeaderTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  
  '@media (max-width: 600px)': {
    flexWrap: 'nowrap',
  },
  
  '@media (max-width: 480px)': {
    flexWrap: 'nowrap',
  },
  
  '@media (max-width: 375px)': {
    flexWrap: 'nowrap',
  },
}));

const ChatHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
  minWidth: 0,
  
  '@media (max-width: 1200px)': {
    gap: theme.spacing(1.2),
  },
  
  '@media (max-width: 960px)': {
    gap: theme.spacing(1),
  },
  
  '@media (max-width: 600px)': {
    gap: theme.spacing(0.8),
  },
  
  '@media (max-width: 480px)': {
    gap: theme.spacing(0.6),
  },
  
  '@media (max-width: 375px)': {
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
  
  '@media (max-width: 1200px)': {
    fontSize: '0.825rem',
  },
  
  '@media (max-width: 960px)': {
    fontSize: '0.8rem',
  },
  
  '@media (max-width: 600px)': {
    display: 'none',
  },
  
  '@media (max-width: 480px)': {
    display: 'none',
  },
  
  '@media (max-width: 375px)': {
    display: 'none',
  },
}));

const ChatHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  
  '@media (max-width: 1200px)': {
    gap: theme.spacing(0.8),
  },
  
  '@media (max-width: 960px)': {
    gap: theme.spacing(0.6),
  },
  
  '@media (max-width: 600px)': {
    gap: theme.spacing(0.4),
  },
  
  '@media (max-width: 480px)': {
    gap: theme.spacing(0.3),
  },
  
  '@media (max-width: 375px)': {
    gap: theme.spacing(0.2),
  },
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  
  '@media (max-width: 1200px)': {
    padding: theme.spacing(0.8),
  },
  
  '@media (max-width: 960px)': {
    padding: theme.spacing(0.6),
  },
  
  '@media (max-width: 600px)': {
    padding: theme.spacing(0.5),
  },
  
  '@media (max-width: 480px)': {
    padding: theme.spacing(0.4),
  },
  
  '@media (max-width: 375px)': {
    padding: theme.spacing(0.3),
  },
}));

const ResponsiveIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  
  '@media (max-width: 1200px)': {
    padding: theme.spacing(0.8),
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
  
  '@media (max-width: 960px)': {
    padding: theme.spacing(0.6),
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
  
  '@media (max-width: 600px)': {
    padding: theme.spacing(0.5),
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
    },
  },
  
  '@media (max-width: 480px)': {
    padding: theme.spacing(0.4),
    '& .MuiSvgIcon-root': {
      fontSize: '0.9rem',
    },
  },
  
  '@media (max-width: 375px)': {
    padding: theme.spacing(0.3),
    '& .MuiSvgIcon-root': {
      fontSize: '0.85rem',
    },
  },
}));

const ResponsiveAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 1,
  
  '@media (max-width: 1200px)': {
    width: 36,
    height: 36,
  },
  
  '@media (max-width: 960px)': {
    width: 32,
    height: 32,
  },
  
  '@media (max-width: 600px)': {
    width: 28,
    height: 28,
  },
  
  '@media (max-width: 480px)': {
    width: 26,
    height: 26,
  },
  
  '@media (max-width: 375px)': {
    width: 24,
    height: 24,
  },
}));

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  
  '@media (max-width: 1200px)': {
    fontSize: '1.15rem',
  },
  
  '@media (max-width: 960px)': {
    fontSize: '1.1rem',
  },
  
  '@media (max-width: 600px)': {
    fontSize: '1rem',
  },
  
  '@media (max-width: 480px)': {
    fontSize: '0.95rem',
  },
  
  '@media (max-width: 375px)': {
    fontSize: '0.9rem',
  },
}));

const ResponsiveChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.7rem',
  height: 20,
  
  '@media (max-width: 1200px)': {
    fontSize: '0.65rem',
    height: 18,
  },
  
  '@media (max-width: 960px)': {
    fontSize: '0.6rem',
    height: 16,
  },
  
  '@media (max-width: 600px)': {
    fontSize: '0.55rem',
    height: 14,
  },
  
  '@media (max-width: 480px)': {
    fontSize: '0.5rem',
    height: 12,
  },
  
  '@media (max-width: 375px)': {
    fontSize: '0.45rem',
    height: 10,
  },
}));

const MessagesWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '120px', // Account for fixed header
  paddingBottom: '80px', // Account for fixed input
  
  '@media (max-width: 1200px)': {
    paddingTop: '110px',
    paddingBottom: '75px',
  },
  
  '@media (max-width: 960px)': {
    paddingTop: '100px',
    paddingBottom: '70px',
  },
  
  '@media (max-width: 600px)': {
    paddingTop: '80px',
    paddingBottom: '65px',
  },
  
  '@media (max-width: 480px)': {
    paddingTop: '70px',
    paddingBottom: '60px',
  },
  
  '@media (max-width: 375px)': {
    paddingTop: '60px',
    paddingBottom: '55px',
  },
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(20, 20, 30, 0.95)',
  backdropFilter: 'blur(10px)',
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 1001,
}));

const ResponsiveAlert = styled(Alert)(({ theme }) => ({
  '@media (max-width: 600px)': {
    fontSize: '0.8rem',
    padding: theme.spacing(1),
  },
  
  '@media (max-width: 480px)': {
    fontSize: '0.75rem',
    padding: theme.spacing(0.8),
  },
  
  '@media (max-width: 375px)': {
    fontSize: '0.7rem',
    padding: theme.spacing(0.6),
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
  
  // Creativity settings
  // const [settingsAnchor, setSettingsAnchor] = useState(null);
  // const [temperature, setTemperature] = useState(0.7);
  // const [topP, setTopP] = useState(0.95);
  // const [topK, setTopK] = useState(40);
  
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
      // const creativitySettings = { temperature, top_p: topP, top_k: topK };
      const response = await apiService.sendMessage(
        character.name, 
        userMessage, 
        !sessionId
        // ,creativitySettings
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
              <BackButton 
                onClick={handleBackClick}
                title="Back to Characters"
              >
                <ArrowBack />
              </BackButton>
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
              <ResponsiveIconButton 
                onClick={() => setShowHistory(true)}
                title="Chat History"
              >
                <HistoryIcon />
              </ResponsiveIconButton>
              
              <ResponsiveIconButton 
                onClick={startNewSession}
                title="New Conversation"
              >
                <Add />
              </ResponsiveIconButton>
              
              {/* <ResponsiveIconButton 
                onClick={(e) => setSettingsAnchor(e.currentTarget)}
                title="Creativity Settings"
              >
                <Tune />
              </ResponsiveIconButton> */}
              
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
          <Box sx={{ 
            p: 2,
            '@media (max-width: 600px)': { p: 1.5 },
            '@media (max-width: 480px)': { p: 1.2 },
            '@media (max-width: 375px)': { p: 1 },
          }}>
            <ResponsiveAlert severity="error" onClose={() => setError(null)}>
              {error}
            </ResponsiveAlert>
          </Box>
        )}

        <MessagesWrapper>
          <MessageList 
            messages={messages} 
            loading={loading} 
            ref={messagesEndRef} 
          />
        </MessagesWrapper>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          loading={loading}
        />

        {/* <CreativitySettingsMenu
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={() => setSettingsAnchor(null)}
          temperature={temperature}
          setTemperature={setTemperature}
          topP={topP}
          setTopP={setTopP}
          topK={topK}
          setTopK={setTopK}
        /> */}
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