import React from 'react';
import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const MessageWrapper = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2),
}));

const MessageContent = styled(Paper)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  fontSize: '0.875rem',
  lineHeight: 1.4,
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? 'white' : theme.palette.text.primary,
  border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
  wordBreak: 'break-word',
}));

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <MessageWrapper isUser={isUser}>
      <MessageContent isUser={isUser}>
        {typeof message.content === 'string' ? message.content : message.content}
      </MessageContent>
    </MessageWrapper>
  );
};

export default Message;