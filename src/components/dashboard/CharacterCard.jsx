// src/components/dashboard/EnhancedCharacterCard.jsx
import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Button, Chip, IconButton, Fade } from '@mui/material';
import { Message, Favorite, MoreVert, Share, Star } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 24,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  height: 420,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(145deg, transparent 0%, rgba(102, 126, 234, 0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.2)',
    '&::before': {
      opacity: 1,
    },
    '& .character-avatar': {
      transform: 'scale(1.1)',
    },
    '& .action-button': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 200,
  overflow: 'hidden',
  borderRadius: '20px 20px 0 0',
  background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
}));

const CharacterImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s ease',
}));

const CharacterAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  border: '4px solid rgba(255,255,255,0.2)',
  position: 'absolute',
  bottom: -40,
  left: 20,
  transition: 'transform 0.4s ease',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
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
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  marginBottom: theme.spacing(2),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  minHeight: 48,
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
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'all 0.4s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(0) scale(1.05)',
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

const RatingStars = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 2,
  alignItems: 'center',
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
    // Navigate to full-screen chat
    navigate(`/chat/${character.id}`, { 
      state: { character, fullScreen: true }
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(character);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    console.log(`${action} clicked for`, character.name);
  };

  return (
    <Fade in timeout={600}>
      <StyledCard onClick={handleCardClick} className="character-card">
        <ImageContainer>
          <CharacterImage 
            src={character.img || '/api/placeholder/400/200'} 
            alt={character.name}
            className="character-avatar"
          />
          <CharacterAvatar 
            src={character.img || '/api/placeholder/80/80'} 
            alt={character.name}
            className="character-avatar"
          />
          <StatusBadge label="Online" size="small" />
          <TopActions>
            <RatingStars>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  sx={{ 
                    fontSize: 16, 
                    color: star <= (character.rating || 4) ? '#ffd700' : 'rgba(255,255,255,0.3)' 
                  }} 
                />
              ))}
            </RatingStars>
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
            
            <IconButtonStyled 
              className="action-button"
              onClick={(e) => handleActionClick(e, 'share')}
              size="small"
            >
              <Share fontSize="small" />
            </IconButtonStyled>
            
            <IconButtonStyled 
              className="action-button"
              onClick={(e) => handleActionClick(e, 'more')}
              size="small"
            >
              <MoreVert fontSize="small" />
            </IconButtonStyled>
          </ActionButtons>
        </CardContentStyled>
      </StyledCard>
    </Fade>
  );
};

export default CharacterCard;