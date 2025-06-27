import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Fade } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Import the StarField component
const StarField = React.lazy(() => import('../components/common/StarField'));

const PageContainer = Container;

const Login = () => {
  const [username] = useState('Kiran');
  const [password] = useState('Kirannani');
  const [dots, setDots] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Animate dots for "connecting..." effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto login effect
  useEffect(() => {
    if (!isAuthenticated && username === 'Kiran' && password === 'Kirannani') {
      (async () => {
        await login(username, password);
        // navigation will be handled by the next effect
      })();
    }
    // eslint-disable-next-line
  }, []); // Only run on mount

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <React.Suspense fallback={<div />}>
        <StarField />
      </React.Suspense>
      <PageContainer maxWidth="sm" sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        background: 'transparent',
      }}>
        <Fade in timeout={800}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 6,
              borderRadius: 4,
              background: 'rgba(15, 15, 15, 0.85)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
              minWidth: 320,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              sx={{
                color: '#fff',
                mb: 2,
                letterSpacing: 1,
                textShadow: '0 2px 8px #667eea55',
              }}
            >
              Connecting to Anumula Revanth Reddy{dots}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mt: 2,
                fontStyle: 'italic',
              }}
            >
              Please wait while we establish a legendary connection...
            </Typography>
          </Box>
        </Fade>
      </PageContainer>
    </>
  );
};

export default Login;