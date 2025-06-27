// src/components/dashboard/CharacterCard.jsx
import React from 'react';
import { Card, CardContent, Box, Typography, Button, Chip, IconButton, Fade } from '@mui/material';
import { Message, Favorite, Star } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const CardWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  minHeight: 0,
  minWidth: 0,
  padding: 0,
  boxSizing: 'border-box',
  overflow: 'visible',
  position: 'static',
  top: 'unset',
  left: 'unset',
  zIndex: 'auto',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 24,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: 600,
  minWidth: 0,
  margin: '0 auto',
  height: 'auto',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '98vw',
    borderRadius: 12,
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 220,
  overflow: 'hidden',
  borderRadius: '20px 20px 0 0',
  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    height: 140,
    borderRadius: '12px 12px 0 0',
  },
}));

const CharacterImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transition: 'transform 0.4s ease',
  background: '#fff',
}));

const StatusBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: 'rgba(76, 175, 80, 0.9)',
  color: 'white',
  fontSize: '0.7rem',
  height: 24,
  fontWeight: 600,
  backdropFilter: 'blur(10px)',
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(6),
  position: 'relative',
  zIndex: 2,
}));

const CharacterName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.3rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(0.5),
}));

const CreatorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
  marginBottom: theme.spacing(1),
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  fontSize: '0.7rem',
  height: 22,
  backgroundColor: 'rgba(102, 126, 234, 0.1)',
  border: '1px solid rgba(102, 126, 234, 0.3)',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1.5),
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
  display: 'block',
  overflow: 'visible',
  minHeight: 48,
  WebkitLineClamp: 'unset',
  WebkitBoxOrient: 'unset',
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.disabled,
  fontSize: '0.8rem',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
}));

const ChatButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  flex: 1,
  padding: theme.spacing(1.2, 2),
  // Always visible
  opacity: 1,
  transform: 'none',
  transition: 'all 0.4s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'scale(1.05)',
  },
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: theme.palette.text.secondary,
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'all 0.4s ease',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: theme.palette.primary.main,
  },
}));



const TopActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  left: 12,
  zIndex: 3,
}));

const CharacterCard = ({ character, onClick }) => {
  const navigate = useNavigate();

  const handleChatClick = (e) => {
    e.stopPropagation();
    navigate(`/chat/${character.id}`, { state: { character } });
  };

  return (
    <CardWrapper>
      <Fade in timeout={600}>
        <StyledCard className="character-card">
          <ImageContainer>
            <CharacterImage 
              src={character.img || '/api/placeholder/400/200'} 
              alt={character.name}
              className="character-avatar"
            />
            <StatusBadge label="Online" size="small" />
            <TopActions>
              
            </TopActions>
          </ImageContainer>

          <CardContentStyled>
            <CharacterName variant="h6">
              {character.name}
            </CharacterName>
            
            <CreatorText variant="body2">
              by @{character.creator || 'Giga character AI'}
            </CreatorText>

            <CategoryChip 
              label={character.type || 'Historical Figure'} 
              size="small" 
            />

            <Description>
              {character.description || "An engaging character ready to chat with you about their fascinating life and experiences."}
            </Description>

            <StatsContainer>
              <StatItem>
                <Message fontSize="small" />
                <span>{character.messages || '2.1k'}</span>
              </StatItem>
              <StatItem>
                <Favorite fontSize="small" />
                <span>{character.likes || '847'}</span>
              </StatItem>
            </StatsContainer>

            <ActionButtons>
              <ChatButton 
                className="action-button"
                onClick={handleChatClick}
                startIcon={<Message />}
              >
                Start Chat
              </ChatButton>
            </ActionButtons>
          </CardContentStyled>
        </StyledCard>
      </Fade>
    </CardWrapper>
  );
};

export default CharacterCard;