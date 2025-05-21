import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// Get API URL from environment or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const status = searchParams.get('status');
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [resendMessage, setResendMessage] = useState({ type: '', text: '' });

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
        // Send verification request to backend with full API URL
        const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
        setVerificationStatus('success');
        setMessage(response.data.message || 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.');
        setLoading(false);
      } catch (error) {
        console.error('Verification error:', error);
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
    // Reset previous messages when opening dialog
    setResendMessage({ type: '', text: '' });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEmail('');
    setEmailError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('L\'email est requis');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Format d\'email invalide');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResendVerification = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsResending(true);
    setResendMessage({ type: '', text: '' });
    
    try {
      console.log('Sending resend verification request to:', `${API_URL}/auth/resend-verification`);
      
      const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
      console.log('Resend verification response:', response);
      
      setResendMessage({
        type: 'success',
        text: response.data.message || 'Un nouvel email de vérification a été envoyé à votre adresse.'
      });
      
      setTimeout(handleCloseDialog, 3000); // Close dialog after 3 seconds on success
    } catch (error) {
      console.error('Resend verification error:', error);
      
      let errorMessage = 'Erreur lors du renvoi de l\'email de vérification.';
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.status === 404) {
          errorMessage = error.response.data.message || 'Aucun utilisateur non vérifié trouvé avec cet email.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.';
      } else {
        console.error('Error message:', error.message);
      }
      
      setResendMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsResending(false);
    }
  };

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
            
            {verificationStatus === 'error' && (
              <Button 
                variant="outlined"
                color="primary"
                onClick={handleOpenDialog}
                sx={{ 
                  mt: 3,
                  borderColor: '#4ca1af',
                  color: '#4ca1af',
                  '&:hover': { 
                    borderColor: '#2c3e50',
                    backgroundColor: 'rgba(44, 62, 80, 0.04)'
                  },
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  padding: '8px 16px',
                }}
              >
                Renvoyer un email de vérification
              </Button>
            )}
            
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

      {/* Dialog for email verification resend */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Renvoyer un email de vérification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez entrer l'adresse email associée à votre compte pour recevoir un nouveau lien de vérification.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            disabled={isResending}
            sx={{ mt: 2 }}
          />
          {resendMessage.text && (
            <Alert 
              severity={resendMessage.type} 
              sx={{ mt: 2 }}
            >
              {resendMessage.text}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog} 
            disabled={isResending}
            sx={{ color: '#f44336' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleResendVerification} 
            variant="contained"
            disabled={isResending}
            sx={{ 
              bgcolor: '#4ca1af', 
              '&:hover': { bgcolor: '#2c3e50' },
              transition: 'all 0.3s ease',
            }}
          >
            {isResending ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Envoi...
              </>
            ) : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmailVerification; 