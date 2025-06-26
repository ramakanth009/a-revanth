import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import {
  Close,
  Add,
  Chat,
  AccessTime,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const PanelContainer = styled(Box)(({ theme, open }) => ({
  position: 'fixed',
  top: 0,
  right: open ? 0 : -400,
  width: 400,
  height: '100vh',
  backgroundColor: theme.palette.background.secondary,
  borderLeft: `1px solid ${theme.palette.divider}`,
  zIndex: 1500,
  transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: open ? '0 0 20px rgba(0, 0, 0, 0.5)' : 'none',
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
    right: open ? 0 : '-100vw',
  },
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2.5, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const PanelContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const ScrollableList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(1, 0),
  '&.history-panel': {
    // Custom scrollbar class for targeting
  },
}));

const SessionItem = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.selected': {
    backgroundColor: theme.palette.action.selected,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
}));

const NewSessionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1.5),
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SessionMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  fontSize: '0.75rem',
  color: theme.palette.text.disabled,
}));

const Backdrop = styled(Box)(({ theme, open }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1400,
  opacity: open ? 1 : 0,
  visibility: open ? 'visible' : 'hidden',
  transition: 'all 0.3s ease',
}));

const ChatHistoryPanel = ({ 
  open, 
  onClose, 
  sessions, 
  currentSessionId, 
  onSessionSelect, 
  onNewSession,
  characterName 
}) => {
  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatSessionTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Backdrop open={open} onClick={onClose} />
      <PanelContainer open={open}>
        <PanelHeader>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Chat History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {characterName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </PanelHeader>

        <PanelContent>
          <NewSessionButton
            variant="contained"
            startIcon={<Add />}
            onClick={onNewSession}
            fullWidth
          >
            Start New Conversation
          </NewSessionButton>

          <Box sx={{ px: 2, pb: 1 }}>
            <Typography variant="caption" color="text.disabled">
              {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <ScrollableList className="history-panel">
            {sessions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
                <Chat sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No previous conversations
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Start chatting to see your history here
                </Typography>
              </Box>
            ) : (
              <List dense>
                {sessions.map((session) => (
                  <SessionItem
                    key={session.session_id}
                    onClick={() => onSessionSelect(session.session_id)}
                    className={currentSessionId === session.session_id ? 'selected' : ''}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Chat fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight="medium">
                            Session {session.session_id}
                          </Typography>
                          {currentSessionId === session.session_id && (
                            <Chip 
                              label="Active" 
                              size="small" 
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <SessionMeta>
                          <AccessTime fontSize="inherit" />
                          <span>{formatSessionDate(session.created_at)}</span>
                          <span>•</span>
                          <span>{formatSessionTime(session.created_at)}</span>
                        </SessionMeta>
                      }
                    />
                  </SessionItem>
                ))}
              </List>
            )}
          </ScrollableList>
        </PanelContent>
      </PanelContainer>
    </>
  );
};

export default ChatHistoryPanel;