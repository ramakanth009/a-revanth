import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ChatInputWrapper = styled(Box)({
  display: 'flex',
  gap: 8,
  alignItems: 'flex-end',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    minHeight: 44,
    maxHeight: 120,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  height: 44,
  width: 44,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));

const ChatInput = ({ value, onChange, onSend, loading, placeholder = "Message..." }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <ChatInputContainer>
      <ChatInputWrapper>
        <StyledTextField
          multiline
          maxRows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <SendButton
          onClick={onSend}
          disabled={!value.trim() || loading}
        >
          <Send />
        </SendButton>
      </ChatInputWrapper>
    </ChatInputContainer>
  );
};

export default ChatInput;