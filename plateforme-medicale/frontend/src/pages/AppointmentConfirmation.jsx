import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';

const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const confirmAppointment = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const id = searchParams.get('id');

        if (!token || !id) {
          setError('Lien de confirmation invalide');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/appointments/confirm?token=${token}&id=${id}`
        );

        setResult(response.data);
        setLoading(false);

      } catch (error) {
        console.error('Error confirming appointment:', error);
        setError(error.response?.data?.message || 'Erreur lors de la confirmation du rendez-vous');
        setLoading(false);
      }
    };

    confirmAppointment();
  }, [location.search]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Confirmation de votre rendez-vous en cours...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {error ? (
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
              
              <Typography variant="h4" color="error.main" gutterBottom>
                Erreur de confirmation
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                {error}
              </Typography>
              
              <Alert severity="error" sx={{ mt: 2, maxWidth: 500 }}>
                Le lien de confirmation peut avoir expiré ou être invalide. 
                Veuillez contacter directement votre médecin si nécessaire.
              </Alert>
              
              <Button 
                variant="contained" 
                onClick={handleGoHome}
                sx={{ px: 4, mt: 3 }}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </CardContent>
        ) : (
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
              
              <Typography variant="h4" color="success.main" gutterBottom>
                Rendez-vous confirmé !
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                Votre présence a été confirmée avec succès. Vous recevrez un rappel 24 heures avant votre rendez-vous.
              </Typography>
              
              {result?.appointment && (
                <Card sx={{ 
                  mt: 3, 
                  bgcolor: 'success.50', 
                  border: '1px solid',
                  borderColor: 'success.200',
                  maxWidth: 500,
                  width: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      Détails du rendez-vous
                    </Typography>
                    
                    <Box sx={{ mt: 2, textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Médecin:</strong> {result.appointment.doctor}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Date:</strong> {result.appointment.date}
                      </Typography>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Chip 
                          label="Confirmé" 
                          color="success" 
                          variant="filled"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
              
              <Alert severity="info" sx={{ mt: 2, maxWidth: 500 }}>
                <Typography variant="body2">
                  <strong>Rappels importants:</strong>
                  <br />• Arrivez 15 minutes avant votre rendez-vous
                  <br />• Apportez votre carte d'identité et d'assurance
                  <br />• Préparez la liste de vos médicaments actuels
                </Typography>
              </Alert>
              
              <Button 
                variant="contained" 
                onClick={handleGoHome}
                sx={{ px: 4, mt: 3 }}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </CardContent>
        )}
      </Card>
    </Container>
  );
};

export default AppointmentConfirmation; 