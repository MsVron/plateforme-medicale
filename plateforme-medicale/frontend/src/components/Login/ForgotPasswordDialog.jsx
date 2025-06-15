import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import axios from 'axios';

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`,
        { email }
      );

      setMessage(response.data.message);
      setEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setError('');
    setEmailSent(false);
    setLoading(false);
    onClose();
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <EmailIcon sx={{ color: '#4ca1af', fontSize: 32, mr: 1 }} />
          <Typography variant="h5" component="span" sx={{ color: '#4ca1af', fontWeight: 'bold' }}>
            Mot de passe oublié
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </Typography>
      </DialogTitle>

      <DialogContent>
        {emailSent ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {message}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Vérifiez votre boîte de réception et vos spams.
            </Typography>
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Adresse email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="votre.email@exemple.com"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#4ca1af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4ca1af',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4ca1af',
                },
              }}
            />

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Cette fonctionnalité est disponible uniquement pour les comptes patients.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {emailSent ? (
          <Button
            onClick={handleClose}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#4ca1af',
              '&:hover': {
                bgcolor: '#2c3e50',
              },
              borderRadius: 2,
              py: 1.5,
            }}
          >
            Fermer
          </Button>
        ) : (
          <>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{
                color: '#666',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !email || !isValidEmail(email)}
              variant="contained"
              sx={{
                bgcolor: '#4ca1af',
                '&:hover': {
                  bgcolor: '#2c3e50',
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                },
                borderRadius: 2,
                px: 3,
                py: 1,
                minWidth: 120,
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Envoyer'
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPasswordDialog; 