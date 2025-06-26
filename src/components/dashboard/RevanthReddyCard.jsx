// src/components/dashboard/RevanthReddyCard.jsx
import React from 'react';
import { Box, Card, Typography, Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Chat, Star, Verified } from '@mui/icons-material';

// This is the main card container - think of it as a premium business card
// We want it to feel important and inviting, like meeting someone significant
const ProfileCard = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  width: '100%',
  padding: theme.spacing(6),
  background: 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)',
  borderRadius: 24,
  border: '2px solid #333',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'visible',
  
  // Subtle hover effect to show interactivity
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)',
  },

  // Mobile responsiveness
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    padding: theme.spacing(4),
    borderRadius: 16,
  },
}));

// The profile image should be large and prominent - this is the focal point
// Think of it as the main attraction, like a movie poster
const ProfileImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: 160,
  height: 160,
  borderRadius: 20,
  border: '4px solid #444',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  
  // Make image even more prominent on hover
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: '#555',
  },

  // Mobile: slightly smaller but still prominent
  [theme.breakpoints.down('md')]: {
    width: 140,
    height: 140,
  },
}));

// Verification badge to show authenticity - like a blue checkmark
const VerificationBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -8,
  right: -8,
  width: 32,
  height: 32,
  backgroundColor: '#1DA1F2',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px solid #2a2a2a',
  boxShadow: '0 4px 12px rgba(29, 161, 242, 0.3)',
}));

// Content area for name, title, and description
const ProfileContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontSize: '2.2rem',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: theme.spacing(1),
  lineHeight: 1.2,
  
  // Mobile: slightly smaller text
  [theme.breakpoints.down('md')]: {
    fontSize: '1.8rem',
  },
}));

const ProfileTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: '#888',
  marginBottom: theme.spacing(2),
  fontWeight: 500,
}));

const ProfileDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  color: '#bbb',
  lineHeight: 1.6,
  marginBottom: theme.spacing(1),
}));

// Stats row to show engagement metrics
const StatsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  marginBottom: theme.spacing(4),
  
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2),
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 700,
  color: '#ffffff',
  lineHeight: 1,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

// The main action button - this is what users will click to start chatting
// Make it feel premium and inviting, like a call-to-action on a landing page
const ChatButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: 16,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  border: 'none',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const RevanthReddyCard = ({ onStartChat }) => {
  return (
    <ProfileCard>
      {/* Profile Image Section */}
      <ProfileImageContainer>
        <ProfileImage
          src="/assets/revanth-reddy.jpg" // You'll need to add this image
          alt="Revanth Reddy"
        />
        <VerificationBadge>
          <Verified sx={{ fontSize: 16, color: 'white' }} />
        </VerificationBadge>
      </ProfileImageContainer>

      {/* Profile Information */}
      <ProfileContent>
        <ProfileName>
          A. Revanth Reddy
        </ProfileName>
        
        <ProfileTitle>
          Chief Minister of Telangana
        </ProfileTitle>
        
        <ProfileDescription>
          Dynamic leader committed to progressive governance and innovative policies for Telangana's development.
        </ProfileDescription>
        
        <ProfileDescription>
          Ready to discuss governance, policy initiatives, and the future of our state.
        </ProfileDescription>
      </ProfileContent>

      {/* Engagement Stats */}
      <StatsRow>
        <StatItem>
          <StatNumber>2.1M+</StatNumber>
          <StatLabel>Followers</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatNumber>500+</StatNumber>
          <StatLabel>Initiatives</StatLabel>
        </StatItem>
        
        <StatItem>
          <StatNumber>98%</StatNumber>
          <StatLabel>Satisfaction</StatLabel>
        </StatItem>
      </StatsRow>

      {/* Main Action Button */}
      <ChatButton
        onClick={onStartChat}
        startIcon={<Chat />}
      >
        Ready to Chat
      </ChatButton>
    </ProfileCard>
  );
};

export default RevanthReddyCard;