import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const SessionHistory = ({ 
  showSessions, 
  sessions, 
  sessionId, 
  onNewSession, 
  onLoadSession 
}) => {
  if (!showSessions) return null;

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Recent Conversations
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip 
          label="+ Start New Conversation" 
          onClick={onNewSession}
          variant="outlined"
          sx={{ justifyContent: 'flex-start' }}
        />
        {sessions.map((session) => (
          <Chip
            key={session.session_id}
            label={`Session ${session.session_id} - ${new Date(session.created_at).toLocaleDateString()}`}
            onClick={() => onLoadSession(session.session_id)}
            variant={sessionId === session.session_id ? "filled" : "outlined"}
            sx={{ justifyContent: 'flex-start' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SessionHistory;