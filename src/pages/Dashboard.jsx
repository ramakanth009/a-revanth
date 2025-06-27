import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CharacterGrid from '../components/dashboard/CharacterGrid';
import ChatPanel from '../components/dashboard/ChatPanel';
import { useAuth } from '../context/AuthContext';
import StarField from '../components/common/StarField';

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100vw',
  marginTop: '20px !important',
  flexDirection: 'column',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
  
  '@media (max-width: 1200px)': {
    width: '100vw',
    marginTop: '18px !important',
  },
  
  '@media (max-width: 960px)': {
    width: '100vw',
    marginTop: '16px !important',
  },
  
  '@media (max-width: 600px)': {
    width: '100vw',
    marginTop: '14px !important',
  },
  
  '@media (max-width: 480px)': {
    width: '100vw',
    marginTop: '12px !important',
  },
  
  '@media (max-width: 375px)': {
    width: '100vw',
    marginTop: '10px !important',
  },
}));

const DashboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(2, 3, 0, 3),
  minHeight: 64,
  width: '100%',
  
  '@media (max-width: 1200px)': {
    padding: theme.spacing(2, 2.5, 0, 2.5),
    minHeight: 60,
  },
  
  '@media (max-width: 960px)': {
    padding: theme.spacing(2, 2, 0, 2),
    minHeight: 56,
  },
  
  '@media (max-width: 600px)': {
    padding: theme.spacing(1.5, 1.5, 0, 1.5),
    minHeight: 52,
  },
  
  '@media (max-width: 480px)': {
    padding: theme.spacing(1.2, 1.2, 0, 1.2),
    minHeight: 48,
  },
  
  '@media (max-width: 375px)': {
    padding: theme.spacing(1, 1, 0, 1),
    minHeight: 44,
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  width: '100%',
  overflow: 'hidden',
  
  '@media (max-width: 1200px)': {
    width: '100%',
  },
  
  '@media (max-width: 960px)': {
    width: '100%',
  },
  
  '@media (max-width: 600px)': {
    width: '100%',
    flexDirection: 'column',
  },
  
  '@media (max-width: 480px)': {
    width: '100%',
    flexDirection: 'column',
  },
  
  '@media (max-width: 375px)': {
    width: '100%',
    flexDirection: 'column',
  },
}));

const ContentArea = styled(Box)(({ theme, chatOpen }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflow: 'auto',
  transition: 'all 0.3s ease',
  display: chatOpen ? 'none' : 'block',
  width: '100%',
  
  '@media (max-width: 1200px)': {
    padding: theme.spacing(2.5),
  },
  
  '@media (max-width: 960px)': {
    padding: theme.spacing(2),
  },
  
  '@media (max-width: 600px)': {
    padding: theme.spacing(1.5),
    display: chatOpen ? 'none' : 'block',
  },
  
  '@media (max-width: 480px)': {
    padding: theme.spacing(1.2),
    display: chatOpen ? 'none' : 'block',
  },
  
  '@media (max-width: 375px)': {
    padding: theme.spacing(1),
    display: chatOpen ? 'none' : 'block',
  },
}));

const ResponsiveButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  
  '@media (max-width: 1200px)': {
    fontSize: '0.9rem',
    padding: theme.spacing(1, 2),
  },
  
  '@media (max-width: 960px)': {
    fontSize: '0.85rem',
    padding: theme.spacing(0.8, 1.8),
  },
  
  '@media (max-width: 600px)': {
    fontSize: '0.8rem',
    padding: theme.spacing(0.6, 1.5),
  },
  
  '@media (max-width: 480px)': {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 1.2),
  },
  
  '@media (max-width: 375px)': {
    fontSize: '0.7rem',
    padding: theme.spacing(0.4, 1),
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
    setTimeout(() => setSelectedCharacter(null), 300);
  };

  const handleBackToCharacters = () => {
    setIsChatOpen(false);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <>
      <StarField />
      <DashboardContainer>
        {/* <DashboardHeader>
          <ResponsiveButton
            variant="outlined"
            color="primary"
            onClick={logout}
          >
            Logout
          </ResponsiveButton>
        </DashboardHeader> */}
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
    </>
  );
};

export default Dashboard;