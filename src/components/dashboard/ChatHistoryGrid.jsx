import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Chat,
  MoreVert,
  Delete,
  Refresh,
  AccessTime,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HistoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  '& > *': {
    flex: '1 1 calc(33.333% - 12px)',
    minWidth: '300px',
    maxWidth: 'calc(33.333% - 12px)',
    [theme.breakpoints.down('lg')]: {
      flex: '1 1 calc(50% - 8px)',
      maxWidth: 'calc(50% - 8px)',
    },
    [theme.breakpoints.down('md')]: {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },
}));

const SessionCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
}));

const SessionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1.5),
}));

const SessionInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
  minWidth: 0,
}));

const SessionMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}));

const MetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: '0.75rem',
  color: theme.palette.text.disabled,
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6),
  color: theme.palette.text.secondary,
}));

const ChatHistoryGrid = ({ sessions }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleMenuOpen = (event, session) => {
    event.stopPropagation();
    setSelectedSession(session);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSession(null);
  };

  const handleSessionClick = (session) => {
    // TODO: Implement session opening logic
    console.log('Open session:', session);
  };

  const handleDeleteSession = () => {
    // TODO: Implement session deletion
    console.log('Delete session:', selectedSession);
    handleMenuClose();
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

  const getSessionDuration = (session) => {
    // Mock duration calculation - in real app, calculate from first/last message
    const durations = ['5 min', '12 min', '23 min', '45 min', '1 hr 15 min'];
    return durations[Math.floor(Math.random() * durations.length)];
  };

  const getMessageCount = (session) => {
    // Mock message count - in real app, get from session data
    return Math.floor(Math.random() * 20) + 5;
  };

  const groupSessionsByCharacter = (sessions) => {
    return sessions.reduce((acc, session) => {
      if (!acc[session.character]) {
        acc[session.character] = [];
      }
      acc[session.character].push(session);
      return acc;
    }, {});
  };

  const groupedSessions = groupSessionsByCharacter(sessions);

  if (sessions.length === 0) {
    return (
      <EmptyState>
        <Chat sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No conversation history
        </Typography>
        <Typography variant="body2">
          Start chatting with characters to see your conversations here
        </Typography>
      </EmptyState>
    );
  }

  return (
    <Box>
      {Object.entries(groupedSessions).map(([character, characterSessions]) => (
        <Box key={character} sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {character}
            <Chip 
              label={`${characterSessions.length} conversation${characterSessions.length !== 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
            />
          </Typography>
          
          <HistoryContainer>
            {characterSessions.map((session) => (
              <SessionCard 
                key={session.session_id}
                onClick={() => handleSessionClick(session)}
              >
                <CardContent>
                  <SessionHeader>
                    <SessionInfo>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <Chat fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Session {session.session_id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(session.created_at)}
                        </Typography>
                      </Box>
                    </SessionInfo>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, session)}
                      sx={{ opacity: 0.7 }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </SessionHeader>

                  <SessionMeta>
                    <MetaRow>
                      <AccessTime fontSize="inherit" />
                      <span>{getSessionDuration(session)}</span>
                      <span>•</span>
                      <span>{getMessageCount(session)} messages</span>
                    </MetaRow>
                    
                    <MetaRow>
                      <span>Started: {new Date(session.created_at).toLocaleString()}</span>
                    </MetaRow>
                  </SessionMeta>
                </CardContent>
              </SessionCard>
            ))}
          </HistoryContainer>
          
          {Object.keys(groupedSessions).length > 1 && (
            <Divider sx={{ mt: 3 }} />
          )}
        </Box>
      ))}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleSessionClick(selectedSession)}>
          <Refresh sx={{ mr: 1 }} fontSize="small" />
          Resume Chat
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteSession} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete Session
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatHistoryGrid;