import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const MessageWrapper = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2),
}));

const MessageContent = styled('div')(({ theme }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  fontSize: '0.875rem',
  lineHeight: 1.4,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  wordBreak: 'break-word',
  whiteSpace: 'pre-line', // This preserves newlines and basic formatting
}));

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <MessageWrapper isUser={isUser}>
      <MessageContent>
        {typeof message.content === 'string' ? message.content : message.content}
      </MessageContent>
    </MessageWrapper>
  );
};

export default Message;