import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Avatar,
  Alert,
  Chip,
} from '@mui/material';
import { 
  Close, 
  Refresh, 
  Tune,
  History as HistoryIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import apiService from '../../services/api';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import CreativitySettingsMenu from './CreativitySettingsMenu';
import SessionHistory from './SessionHistory';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.secondary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    width: '100%',
    maxWidth: 900,
    height: '80vh',
    margin: theme.spacing(3),
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ChatHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const ChatHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ChatModal = ({ open, character, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false);
  
  // Creativity settings
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && character) {
      initializeChat();
      loadUserSessions();
    }
  }, [open, character]);

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
      setShowSessions(false);
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
    setShowSessions(false);
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
      const creativitySettings = { temperature, top_p: topP, top_k: topK };
      const response = await apiService.sendMessage(
        character.name, 
        userMessage, 
        !sessionId,
        creativitySettings
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

  const handleClose = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    onClose();
  };

  if (!character) return null;

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth={false}>
      <ChatHeader>
        <ChatHeaderLeft>
          <Avatar
            src={character.img}
            alt={character.name}
            sx={{ width: 40, height: 40, borderRadius: 1 }}
          />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {character.name}
            </Typography>
            {sessionId && (
              <Chip 
                label={`Session ${sessionId}`} 
                size="small" 
                sx={{ fontSize: '0.7rem', height: 20 }} 
              />
            )}
          </Box>
        </ChatHeaderLeft>
        
        <ChatHeaderRight>
          <IconButton 
            onClick={() => setShowSessions(!showSessions)}
            sx={{ color: 'text.secondary' }}
            title="Session History"
          >
            <HistoryIcon />
          </IconButton>
          
          <IconButton 
            onClick={startNewSession}
            sx={{ color: 'text.secondary' }}
            title="New Conversation"
          >
            <Refresh />
          </IconButton>
          
          <IconButton 
            onClick={(e) => setSettingsAnchor(e.currentTarget)}
            sx={{ color: 'text.secondary' }}
            title="Creativity Settings"
          >
            <Tune />
          </IconButton>
          
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
            <Close />
          </IconButton>
        </ChatHeaderRight>
      </ChatHeader>

      <SessionHistory
        showSessions={showSessions}
        sessions={sessions}
        sessionId={sessionId}
        onNewSession={startNewSession}
        onLoadSession={loadSession}
      />

      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      <MessageList 
        messages={messages} 
        loading={loading} 
        ref={messagesEndRef} 
      />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        loading={loading}
      />

      <CreativitySettingsMenu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        temperature={temperature}
        setTemperature={setTemperature}
        topP={topP}
        setTopP={setTopP}
        topK={topK}
        setTopK={setTopK}
      />
    </StyledDialog>
  );
};

export default ChatModal;