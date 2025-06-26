import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { Message, Favorite } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 12,
  padding: theme.spacing(2.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  },
}));

const CharacterHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

const CharacterAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1),
}));

const CharacterInfo = styled(Box)({
  flex: 1,
  minWidth: 0,
});

const CharacterDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
  marginBottom: theme.spacing(2),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const CharacterStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  fontSize: '0.8125rem',
  color: theme.palette.text.disabled,
}));

const Stat = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

const CharacterCard = ({ character, onClick }) => {
  const handleClick = () => {
    onClick(character);
  };

  return (
    <StyledCard onClick={handleClick}>
      <CharacterHeader>
        <CharacterAvatar src={character.img} alt={character.name} />
        <CharacterInfo>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {character.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            by @{character.creator || 'LegendsAI'}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {character.type || 'Historical Figure'}
          </Typography>
        </CharacterInfo>
      </CharacterHeader>

      <CharacterDescription>
        {character.description}
      </CharacterDescription>

      <CharacterStats>
        <Stat>
          <Message fontSize="small" />
          <span>{character.messages || '0'}</span>
        </Stat>
        <Stat>
          <Favorite fontSize="small" />
          <span>{character.likes || '0'}</span>
        </Stat>
      </CharacterStats>
    </StyledCard>
  );
};

export default CharacterCard;