import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    background: {
      default: '#0c0c0c',
      paper: '#1f1f23',
      secondary: '#171717',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      disabled: '#666666',
    },
    divider: '#2a2a2e',
    action: {
      hover: '#28282c',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    body2: {
      fontSize: '0.8125rem',
      color: '#a0a0a0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#1f1f23',
            '& fieldset': {
              borderColor: '#2a2a2e',
            },
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f1f23',
          border: '1px solid #2a2a2e',
          borderRadius: '12px',
        },
      },
    },
  },
});