import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!token) {
      setError('Token de réinitialisation manquant');
    }
  }, [token]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#f44336';
    if (passwordStrength < 50) return '#ff9800';
    if (passwordStrength < 75) return '#2196f3';
    return '#4caf50';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Faible';
    if (passwordStrength < 50) return 'Moyen';
    if (passwordStrength < 75) return 'Bon';
    return 'Fort';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de réinitialisation manquant');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/reset-password`,
        {
          token,
          newPassword: formData.newPassword,
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
            textAlign: 'center',
          }}
        >
          <CheckIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
          <Typography component="h1" variant="h4" sx={{ mb: 2, color: '#4ca1af' }}>
            Mot de passe réinitialisé !
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            Votre mot de passe a été réinitialisé avec succès.
            Vous allez être redirigé vers la page de connexion...
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: '#4ca1af',
              '&:hover': {
                bgcolor: '#2c3e50',
              },
              borderRadius: 2,
              px: 4,
              py: 1.5,
            }}
          >
            Se connecter maintenant
          </Button>
        </Box>
      </Container>
    );
  }

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 32, color: '#4ca1af', mr: 1 }} />
          <Typography component="h1" variant="h4" sx={{ color: '#4ca1af' }}>
            BluePulse
          </Typography>
        </Box>
        
        <Typography component="h2" variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          Réinitialiser votre mot de passe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            required
            fullWidth
            name="newPassword"
            label="Nouveau mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
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

          {formData.newPassword && (
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ mr: 1 }}>
                  Force du mot de passe:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: getPasswordStrengthColor(), fontWeight: 'bold' }}
                >
                  {getPasswordStrengthText()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getPasswordStrengthColor(),
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}

          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirmer le mot de passe"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !formData.newPassword || !formData.confirmPassword}
            sx={{
              mt: 2,
              bgcolor: '#4ca1af',
              color: 'white',
              '&:hover': {
                bgcolor: '#2c3e50',
              },
              '&:disabled': {
                bgcolor: '#ccc',
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(76, 161, 175, 0.3)',
              borderRadius: '8px',
              padding: '12px 0',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </Button>

          <Button
            variant="text"
            onClick={() => navigate('/login')}
            sx={{
              color: '#4ca1af',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(76, 161, 175, 0.05)',
              },
            }}
          >
            Retour à la connexion
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword; 