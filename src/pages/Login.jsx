import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  IconButton,
  InputAdornment,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  WorkspacePremium,
  Google,
  Apple,
  Email,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

// Import the StarField component
const StarField = React.lazy(() => import('../components/common/StarField'));

const PageContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(3),
}));

const AuthCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 440,
  padding: theme.spacing(4),
  backgroundColor: 'rgba(15, 15, 15, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 24,
  boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid #667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#667eea',
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
    padding: theme.spacing(1.5),
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: 12,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  marginBottom: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  textTransform: 'none',
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-1px)',
  },
}));

const Divider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: 1,
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const DividerText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '0.875rem',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#5a67d8',
  },
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <React.Suspense fallback={<div />}>
        <StarField />
      </React.Suspense>
      
      <PageContainer maxWidth="sm">
        <Fade in timeout={800}>
          <AuthCard>
            <Zoom in timeout={1000}>
              <Box>
                <LogoContainer>
                  <LogoIcon>
                    <WorkspacePremium sx={{ color: 'white', fontSize: 28 }} />
                  </LogoIcon>
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #ffffff 0%, #a0aec0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Bring Back Legend
                  </Typography>
                </LogoContainer>

                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  align="center" 
                  gutterBottom
                  sx={{ 
                    color: '#ffffff',
                    fontSize: '2rem',
                    mb: 1,
                  }}
                >
                  Welcome back
                </Typography>
                
                <Typography 
                  variant="body1" 
                  align="center" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 4,
                  }}
                >
                  Sign in to continue your legendary conversations
                </Typography>

                {/* Social Login Buttons */}
                <SocialButton
                  startIcon={<Google />}
                  onClick={() => console.log('Google login')}
                >
                  Continue with Google
                </SocialButton>
                <Divider>
                  <DividerText>OR</DividerText>
                </Divider>

                {error && (
                  <Fade in>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        color: '#ffffff',
                        borderRadius: 2,
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
  fullWidth
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  margin="normal"
  required
  autoFocus
/>

<TextField
  fullWidth
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  margin="normal"
  required
/>

                  <LoginButton
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </LoginButton>

                  <Box textAlign="center">
                    <Typography 
                      variant="body2" 
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      Don't have an account?{' '}
                      <StyledLink to="/register">
                        Create one
                      </StyledLink>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Zoom>
          </AuthCard>
        </Fade>
      </PageContainer>
    </>
  );
};

export default Login;