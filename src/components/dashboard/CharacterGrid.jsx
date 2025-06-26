import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, CircularProgress, Alert, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CharacterCard from './CharacterCard';
import ChatHistoryGrid from './ChatHistoryGrid';
import apiService from '../../services/api';

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ViewAllLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));

const CharacterBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  '& > *': {
    flex: '1 1 calc(25% - 12px)',
    minWidth: '280px',
    maxWidth: 'calc(25% - 12px)',
    [theme.breakpoints.down('xl')]: {
      flex: '1 1 calc(33.333% - 12px)',
      maxWidth: 'calc(33.333% - 12px)',
    },
    [theme.breakpoints.down('lg')]: {
      flex: '1 1 calc(50% - 8px)',
      maxWidth: 'calc(50% - 8px)',
    },
    [theme.breakpoints.down('md')]: {
      flex: '1 1 100%',
      maxWidth: '100%',
    },
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6),
  color: theme.palette.text.secondary,
}));

const CharacterGrid = ({ onCharacterClick, activeSection }) => {
  const [characters, setCharacters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeSection === 'History') {
        await loadChatHistory();
      } else {
        await loadCharacters();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCharacters = async () => {
    const apiCharacters = await apiService.getCharacters();
    const transformedCharacters = apiCharacters.map((char) => ({
      ...char,
      creator: extractCreator(char.name) || 'LegendsAI',
      type: extractType(char.name) || 'Historical Figure',
      messages: generateStats().messages,
      likes: generateStats().likes,
      category: extractCategory(char.name),
      isIndian: isIndianCharacter(char.name),
      popularity: Math.floor(Math.random() * 1000) + 100, // Simulated popularity score
    }));

    const filteredCharacters = filterCharactersBySection(transformedCharacters);
    setCharacters(filteredCharacters);
  };

  const loadChatHistory = async () => {
    const userSessions = await apiService.getSessions();
    setSessions(userSessions);
  };

  const filterCharactersBySection = (characters) => {
    switch (activeSection) {
      case 'Discover':
        return characters; // Show all characters
      
      case 'Featured':
        return characters.filter(char => char.isIndian);
      
      case 'Trending':
        return characters
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 8);
      
      case 'For You':
        // TODO: Implement recommendation based on user's chat history
        return characters
          .filter(char => ['science', 'technology', 'leadership'].includes(char.category))
          .slice(0, 6);
      
      case 'Recent':
        // TODO: Implement based on actual user interaction data
        return characters.slice(0, 4);
      
      case 'Art & Culture':
        return characters.filter(char => 
          ['art', 'culture', 'literature', 'music'].includes(char.category)
        );
      
      case 'Science':
        return characters.filter(char => 
          ['science', 'technology', 'medicine'].includes(char.category)
        );
      
      case 'Entertainment':
        return characters.filter(char => 
          ['entertainment', 'sports', 'film'].includes(char.category)
        );
      
      default:
        return characters;
    }
  };

  const extractCreator = (name) => {
    const creatorMap = {
      'N.T. Rama Rao': 'TeluguLegends',
      'APJ Abdul Kalam': 'IndianPioneers',
      'Steve Jobs': 'TechVisionaries',
      'Albert Einstein': 'PhysicsGenius',
      'Marie Curie': 'ScienceGreats',
      'Leonardo da Vinci': 'Renaissance',
      'Mahatma Gandhi': 'IndianPioneers',
      'Rabindranath Tagore': 'LiteraryGenius',
      'Sachin Tendulkar': 'SportsLegends',
      'Shah Rukh Khan': 'BollywoodStars',
    };
    return creatorMap[name] || 'LegendsAI';
  };

  const extractType = (name) => {
    const typeMap = {
      'N.T. Rama Rao': 'Actor, Politician',
      'APJ Abdul Kalam': 'Scientist, President',
      'Steve Jobs': 'Entrepreneur, Innovator',
      'Albert Einstein': 'Physicist, Philosopher',
      'Marie Curie': 'Physicist, Chemist',
      'Leonardo da Vinci': 'Artist, Inventor',
      'Mahatma Gandhi': 'Freedom Fighter, Philosopher',
      'Rabindranath Tagore': 'Poet, Philosopher',
      'Sachin Tendulkar': 'Cricket Legend',
      'Shah Rukh Khan': 'Actor, Producer',
    };
    return typeMap[name] || 'Historical Figure';
  };

  const extractCategory = (name) => {
    const categoryMap = {
      'N.T. Rama Rao': 'entertainment',
      'APJ Abdul Kalam': 'science',
      'Steve Jobs': 'technology',
      'Albert Einstein': 'science',
      'Marie Curie': 'science',
      'Leonardo da Vinci': 'art',
      'Mahatma Gandhi': 'leadership',
      'Rabindranath Tagore': 'literature',
      'Sachin Tendulkar': 'sports',
      'Shah Rukh Khan': 'entertainment',
    };
    return categoryMap[name] || 'general';
  };

  const isIndianCharacter = (name) => {
    const indianCharacters = [
      'N.T. Rama Rao', 'APJ Abdul Kalam', 'Mahatma Gandhi', 
      'Rabindranath Tagore', 'Sachin Tendulkar', 'Shah Rukh Khan'
    ];
    return indianCharacters.includes(name);
  };

  const generateStats = () => {
    const messages = Math.floor(Math.random() * 300) + 50;
    const likes = Math.floor(messages * 0.15);
    return {
      messages: `${messages}k`,
      likes: `${likes}k`
    };
  };

  const getSectionDescription = () => {
    const descriptions = {
      'Discover': 'Explore all available legendary figures',
      'Featured': 'Celebrating Indian legends and their contributions',
      'Trending': 'Most popular characters worldwide',
      'For You': 'Recommended based on your interests',
      'Recent': 'Characters you recently interacted with',
      'History': 'Your complete conversation history',
      'Art & Culture': 'Artists, writers, and cultural icons',
      'Science': 'Scientists, inventors, and innovators',
      'Entertainment': 'Actors, musicians, and entertainers',
    };
    return descriptions[activeSection] || '';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={4}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  // Special handling for History section
  if (activeSection === 'History') {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>
            Chat History
            <Chip label={`${sessions.length} conversations`} size="small" />
          </SectionTitle>
        </SectionHeader>
        <ChatHistoryGrid sessions={sessions} />
      </Section>
    );
  }

  if (characters.length === 0) {
    return (
      <EmptyState>
        <Typography variant="h6" gutterBottom>
          No characters found
        </Typography>
        <Typography variant="body2">
          {activeSection === 'Recent' 
            ? 'Start chatting with characters to see them here!'
            : 'Please check back later or try a different section.'
          }
        </Typography>
      </EmptyState>
    );
  }

  return (
    <Section>
      <SectionHeader>
        <Box>
          <SectionTitle>
            {activeSection}
            <Chip label={`${characters.length} characters`} size="small" />
          </SectionTitle>
          {getSectionDescription() && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {getSectionDescription()}
            </Typography>
          )}
        </Box>
        {characters.length > 8 && (
          <ViewAllLink onClick={() => console.log(`View all ${activeSection}`)}>
            View all
          </ViewAllLink>
        )}
      </SectionHeader>
      
      <CharacterBoxContainer>
        {characters.map((character) => (
          <CharacterCard 
            key={character.id} 
            character={character} 
            onClick={onCharacterClick} 
          />
        ))}
      </CharacterBoxContainer>
    </Section>
  );
};

export default CharacterGrid;