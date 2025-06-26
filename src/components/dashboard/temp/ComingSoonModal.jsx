import React from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  Close,
  Construction,
  WorkspacePremium,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.secondary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    maxWidth: 500,
    margin: theme.spacing(3),
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  position: 'relative',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
}));

const ComingSoonModal = ({ open, onClose }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <CloseButton onClick={onClose}>
        {/* <Close /> */}
      </CloseButton>
      
      <ContentBox>
        <IconContainer>
          <Construction sx={{ fontSize: 40, color: 'white' }} />
        </IconContainer>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Character Creation
        </Typography>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          We're working hard to bring you an amazing character creation experience! 
          This feature will allow you to bring your own legends to life.
        </Typography>

        <Box 
          sx={{ 
            backgroundColor: 'background.paper', 
            borderRadius: 2, 
            p: 2.5, 
            mb: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Coming Soon:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Custom character personalities<br/>
            • Upload character images<br/>
            • Historical knowledge integration<br/>
            • Advanced AI training options
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          startIcon={<WorkspacePremium />}
          onClick={onClose}
          sx={{ px: 4 }}
        >
          Got it!
        </Button>

        <Typography 
          variant="caption" 
          color="text.disabled" 
          sx={{ display: 'block', mt: 2 }}
        >
          Want to be notified when it's ready? We'll keep you updated!
        </Typography>
      </ContentBox>
    </StyledDialog>
  );
};

export default ComingSoonModal;