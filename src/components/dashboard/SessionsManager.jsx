import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { 
  Delete, 
  Chat, 
  History,
  Person,
  AccessTime,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import apiService from '../../services/api';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.secondary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    minWidth: 600,
    maxHeight: '80vh',
  },
}));

const SessionItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SessionStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(0.5),
}));

const SessionsManager = ({ open, onClose, onSessionSelect }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedSessions, setGroupedSessions] = useState({});

  useEffect(() => {
    if (open) {
      loadSessions();
    }
  }, [open]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const userSessions = await apiService.getSessions();
      setSessions(userSessions);
      
      // Group sessions by character
      const grouped = userSessions.reduce((acc, session) => {
        if (!acc[session.character]) {
          acc[session.character] = [];
        }
        acc[session.character].push(session);
        return acc;
      }, {});
      
      setGroupedSessions(grouped);
      setError(null);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (session) => {
    try {
      const sessionData = await apiService.getSessionMessages(session.session_id);
      onSessionSelect({
        ...session,
        messages: sessionData.chat_history
      });
      onClose();
    } catch (error) {
      console.error('Failed to load session messages:', error);
      setError('Failed to load conversation');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const getSessionPreview = (session) => {
    // You could extend this to show the first message or last activity
    return `Session ${session.session_id}`;
  };

  const getTotalSessions = () => {
    return Object.values(groupedSessions).reduce((total, sessions) => total + sessions.length, 0);
  };

  const getCharacterCount = () => {
    return Object.keys(groupedSessions).length;
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <History />
          <Typography variant="h6" fontWeight="bold">
            Chat History
          </Typography>
        </Box>
        
        {!loading && !error && (
          <Box mt={1}>
            <SessionStats>
              <Chip 
                icon={<Chat />} 
                label={`${getTotalSessions()} conversations`} 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<Person />} 
                label={`${getCharacterCount()} characters`} 
                size="small" 
                variant="outlined"
              />
            </SessionStats>
          </Box>
        )}
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button 
              size="small" 
              onClick={loadSessions} 
              sx={{ ml: 2 }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {!loading && !error && Object.keys(groupedSessions).length === 0 && (
          <Box textAlign="center" py={4}>
            <History sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No conversations yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Start chatting with characters to see your history here
            </Typography>
          </Box>
        )}

        {!loading && !error && (
          <Box>
            {Object.entries(groupedSessions).map(([character, characterSessions]) => (
              <Box key={character} mb={3}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Person fontSize="small" />
                  {character}
                  <Chip 
                    label={`${characterSessions.length} session${characterSessions.length !== 1 ? 's' : ''}`}
                    size="small"
                    variant="outlined"
                  />
                </Typography>
                
                <List dense>
                  {characterSessions.map((session) => (
                    <SessionItem
                      key={session.session_id}
                      button
                      onClick={() => handleSessionClick(session)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Chat fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {getSessionPreview(session)}
                            </Typography>
                            <Chip 
                              label={formatDate(session.created_at)}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <AccessTime fontSize="small" sx={{ color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.disabled">
                              Started {new Date(session.created_at).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete session (if you implement this endpoint)
                          console.log('Delete session:', session.session_id);
                        }}
                        sx={{ opacity: 0.7 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </SessionItem>
                  ))}
                </List>
                
                {Object.keys(groupedSessions).length > 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button 
          onClick={loadSessions} 
          variant="outlined"
          disabled={loading}
        >
          Refresh
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default SessionsManager;