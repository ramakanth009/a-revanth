import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: 600,
  marginTop: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    fontSize: '1rem',
  },
}));

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <HeaderContainer>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome back, Legend Seeker
      </Typography>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>
    </HeaderContainer>
  );
};

export default Header;