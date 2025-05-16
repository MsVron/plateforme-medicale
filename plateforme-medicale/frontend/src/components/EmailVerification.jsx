import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const status = searchParams.get('status');
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we already have a status from the URL, use it directly
    if (status === 'success') {
      setVerificationStatus('success');
      setMessage('Email vérifié avec succès. Vous pouvez maintenant vous connecter.');
      setLoading(false);
      return;
    } else if (status === 'error') {
      setVerificationStatus('error');
      setMessage('Une erreur est survenue lors de la vérification de votre email. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus('error');
        setMessage('Token de vérification manquant');
        setLoading(false);
        return;
      }

      try {
        // Send verification request to backend
        const response = await axios.post('/api/auth/verify-email', { token });
        setVerificationStatus('success');
        setMessage(response.data.message || 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.');
        setLoading(false);
      } catch (error) {
        setVerificationStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Une erreur est survenue lors de la vérification de votre email. Veuillez réessayer.'
        );
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, status]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          p: 4,
          borderRadius: 5,
          boxShadow: '0 4px 20px rgba(44, 62, 80, 0.1)',
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: '#4ca1af', my: 4 }} />
        ) : (
          <>
            {verificationStatus === 'success' ? (
              <>
                <svg 
                  className="mx-auto h-16 w-16 text-green-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ color: '#4caf50', width: '64px', height: '64px' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <Typography component="h2" variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: '#4ca1af' }}>
                  Vérification réussie!
                </Typography>
              </>
            ) : (
              <>
                <svg 
                  className="mx-auto h-16 w-16 text-red-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ color: '#f44336', width: '64px', height: '64px' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <Typography component="h2" variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: '#f44336' }}>
                  Échec de la vérification
                </Typography>
              </>
            )}
            
            <Alert 
              severity={verificationStatus === 'success' ? 'success' : 'error'}
              sx={{ mt: 3, width: '100%' }}
            >
              {message}
            </Alert>
            
            <Button 
              component={Link} 
              to="/login" 
              variant="contained"
              sx={{ 
                mt: 4, 
                bgcolor: '#4ca1af', 
                '&:hover': { bgcolor: '#2c3e50', transform: 'translateY(-2px)' },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(76, 161, 175, 0.3)',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 'bold'
              }}
            >
              Aller à la page de connexion
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default EmailVerification; 