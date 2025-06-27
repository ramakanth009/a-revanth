import React, { forwardRef } from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import Message from './Message';

// Import Telugu font from Google Fonts

import '@fontsource/noto-sans-telugu'; // or use the link method below

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2.5),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  fontFamily: '"Noto Sans Telugu", "Roboto", "Helvetica", "Arial", sans-serif',
}));


// import '@fontsource/ramabhadra'; // Traditional Telugu font

// const MessagesContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: theme.spacing(2.5),
//   overflowY: 'auto',
//   display: 'flex',
//   flexDirection: 'column',
//   gap: theme.spacing(2),
//   fontFamily: '"Ramabhadra", "Roboto", "Helvetica", "Arial", sans-serif',
// }));

// import '@fontsource/kalam'; // Handwriting style Telugu font

// const MessagesContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: theme.spacing(2.5),
//   overflowY: 'auto',
//   display: 'flex',
//   flexDirection: 'column',
//   gap: theme.spacing(2),
//   fontFamily: '"Kalam", "Roboto", "Helvetica", "Arial", sans-serif',
// }));

// import '@fontsource/mallanna'; // Elegant Telugu serif font

// const MessagesContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: theme.spacing(2.5),
//   overflowY: 'auto',
//   display: 'flex',
//   flexDirection: 'column',
//   gap: theme.spacing(2),
//   fontFamily: '"Mallanna", "Roboto", "Helvetica", "Arial", sans-serif',
// }));

// import '@fontsource/gidugu'; // Modern sans-serif Telugu font

// const MessagesContainer = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: theme.spacing(2.5),
//   overflowY: 'auto',
//   display: 'flex',
//   flexDirection: 'column',
//   gap: theme.spacing(2),
//   fontFamily: '"Gidugu", "Roboto", "Helvetica", "Arial", sans-serif',
// }));

// Helper to format text with links, bold markdown, and bullet points
function formatText(text) {
  if (typeof text !== 'string') return text;
  
  // First convert single * to bullet points (at start of line or after whitespace)
  const withBullets = text.replace(/(^|\s)\*(\s)/gm, '$1• $2');
  
  const processText = (inputText) => {
    // Combined regex to match both bold (**text**) and URLs
    const combinedRegex = /(\*\*([^*]+)\*\*)|((https?:\/\/[^\s]+)|((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?))/g;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = combinedRegex.exec(inputText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(inputText.slice(lastIndex, match.index));
      }
      
      // Check what type of match we found
      if (match[1]) {
        // Bold text match (**text**)
        parts.push(
          <strong key={`bold-${match.index}`} style={{ fontWeight: 'bold' }}>
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // URL match
        const url = match[3];
        const href = /^https?:\/\//.test(url) ? url : `https://${url}`;
        parts.push(
          <a
            key={`link-${match.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#818cf8', wordBreak: 'break-all' }}
          >
            {url}
          </a>
        );
      }
      
      lastIndex = combinedRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < inputText.length) {
      parts.push(inputText.slice(lastIndex));
    }
    
    return parts.length > 1 ? parts : inputText;
  };
  
  return processText(withBullets);
}

const MessageList = forwardRef(({ messages, loading }, ref) => {
  return (
    <MessagesContainer className="chat-messages" ref={ref}>
      {messages.map((message, index) => (
        <Fade in timeout={400} key={index}>
          <div>
            <Message
              message={{
                ...message,
                content:
                  typeof message.content === 'string'
                    ? formatText(message.content)
                    : message.content,
              }}
            />
          </div>
        </Fade>
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
    </MessagesContainer>
  );
});

export default MessageList;