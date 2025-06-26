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
  width: open ? 'calc(100vw - 280px)' : 0,
  backgroundColor: theme.palette.background.secondary,
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
  [theme.breakpoints.down('md')]: {
    width: open ? '100vw' : 0,
    left: 0,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1.5),
}));

const ChatHeaderTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ChatHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
  minWidth: 0,
}));

const CharacterInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const CharacterDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
}));

const ChatHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const MessagesWrapper = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

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
        content: `Hello! I'm ${character.name}. What would you like to talk about?`,
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
              <Avatar
                src={character.img}
                alt={character.name}
                sx={{ width: 40, height: 40, borderRadius: 1 }}
              />
              <CharacterInfo>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {character.name}
                </Typography>
                {sessionId && (
                  <Chip 
                    label={`Session ${sessionId}`} 
                    size="small" 
                    sx={{ fontSize: '0.7rem', height: 20 }} 
                  />
                )}
              </CharacterInfo>
            </ChatHeaderLeft>
            
            <ChatHeaderRight>
              <IconButton 
                onClick={() => setShowHistory(true)}
                sx={{ color: 'text.secondary' }}
                title="Chat History"
              >
                <HistoryIcon />
              </IconButton>
              
              <IconButton 
                onClick={startNewSession}
                sx={{ color: 'text.secondary' }}
                title="New Conversation"
              >
                <Add />
              </IconButton>
              
              {/* <IconButton 
                onClick={(e) => setSettingsAnchor(e.currentTarget)}
                sx={{ color: 'text.secondary' }}
                title="Creativity Settings"
              >
                <Tune />
              </IconButton> */}
              
              <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                <Close />
              </IconButton>
            </ChatHeaderRight>
          </ChatHeaderTop>
          
          {character.description && (
            <CharacterDescription>
              {character.description}
            </CharacterDescription>
          )}
        </ChatHeader>

        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
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