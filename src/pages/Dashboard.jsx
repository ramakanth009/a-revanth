// src/pages/Dashboard.jsx - Complete rewrite for single character focus
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import RevanthReddyCard from '../components/dashboard/RevanthReddyCard';
import SimpleChat from '../components/dashboard/SimpleChat';

// This is the new main container - think of it as a clean, minimal room
// with just what we need: a profile card and a chat area
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  position: 'relative',
  // Responsive design for mobile
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    alignItems: 'flex-start',
    paddingTop: theme.spacing(4),
  },
}));

// The main content area that holds either the card or the chat
const ContentArea = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  // On mobile, take full width
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}));

// When chat is open, we'll slide the chat panel in from the right
const ChatContainer = styled(Box)(({ theme, isOpen }) => ({
  position: 'fixed',
  top: 0,
  right: isOpen ? 0 : '-100%',
  width: '60%',
  height: '100vh',
  transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,
  // On mobile, chat takes full screen
  [theme.breakpoints.down('md')]: {
    width: '100%',
    right: isOpen ? 0 : '-100%',
  },
}));

// Simple backdrop to dim the background when chat is open
const Backdrop = styled(Box)(({ theme, isOpen }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  opacity: isOpen ? 1 : 0,
  visibility: isOpen ? 'visible' : 'hidden',
  transition: 'all 0.3s ease',
  zIndex: 999,
}));

const Dashboard = () => {
  // Simple state management - just track if chat is open or closed
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handler for when user clicks "Ready to Chat" button
  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  // Handler for when user closes the chat
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <DashboardContainer>
      {/* Backdrop appears when chat is open */}
      <Backdrop isOpen={isChatOpen} onClick={handleCloseChat} />
      
      {/* Main content area with the Revanth Reddy card */}
      <ContentArea>
        <RevanthReddyCard onStartChat={handleStartChat} />
      </ContentArea>

      {/* Chat panel that slides in from the right */}
      <ChatContainer isOpen={isChatOpen}>
        <SimpleChat onClose={handleCloseChat} />
      </ChatContainer>
    </DashboardContainer>
  );
};

export default Dashboard;