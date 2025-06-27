import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CharacterGrid from '../components/dashboard/CharacterGrid';
import ChatPanel from '../components/dashboard/ChatPanel';
import { useAuth } from '../context/AuthContext';

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  background: theme.palette.background.default,
  flexDirection: 'column', // Add column direction for header
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(2, 3, 0, 3),
  minHeight: 64,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 2, 0, 2),
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  
  flex: 1,
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

const ContentArea = styled(Box)(({ theme, chatOpen }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflow: 'auto',
  transition: 'all 0.3s ease',
  display: chatOpen ? 'none' : 'block', // Always hide when chat is open
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Discover');
  const { logout } = useAuth();

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setTimeout(() => setSelectedCharacter(null), 300); // Delay for animation
  };

  const handleBackToCharacters = () => {
    setIsChatOpen(false);
    // Don't clear selectedCharacter immediately to allow for potential re-opening
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Button
          variant="outlined"
          color="primary"
          onClick={logout}
          sx={{ fontWeight: 600 }}
        >
          Logout
        </Button>
      </DashboardHeader>
      <MainContent>
        <ContentArea chatOpen={isChatOpen}>
          <CharacterGrid 
            onCharacterClick={handleCharacterClick}
            activeSection={activeSection}
          />
        </ContentArea>
        <ChatPanel
          open={isChatOpen}
          character={selectedCharacter}
          onClose={handleChatClose}
          onBack={handleBackToCharacters}
        />
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;