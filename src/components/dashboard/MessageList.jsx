import React, { forwardRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Message from './Message';

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2.5),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const MessageList = forwardRef(({ messages, loading }, ref) => {
  return (
    <MessagesContainer className="chat-messages">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
      
      {loading && (
        <Message message={{
          role: 'assistant',
          content: (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Thinking...</Typography>
            </Box>
          )
        }} />
      )}
      
      <div ref={ref} />
    </MessagesContainer>
  );
});

export default MessageList;