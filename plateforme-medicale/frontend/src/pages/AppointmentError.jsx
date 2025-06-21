import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Support as SupportIcon
} from '@mui/icons-material';

const AppointmentError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get('message') || 'Une erreur est survenue';

  const handleGoHome = () => {
    navigate('/');
  };

  const handleBookAnother = () => {
    navigate('/search-doctors');
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    // For now, just redirect to home with a message
    navigate('/?support=true');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
            
            <Typography variant="h4" color="error.main" gutterBottom>
              Erreur
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
              {decodeURIComponent(message)}
            </Typography>
            
            <Alert severity="error" sx={{ mt: 2, maxWidth: 500 }}>
              <Typography variant="body2">
                Si le problème persiste, veuillez contacter le support technique ou essayer à nouveau plus tard.
              </Typography>
            </Alert>
            
            <Alert severity="info" sx={{ maxWidth: 500 }}>
              <Typography variant="body2">
                <strong>Conseils :</strong>
                <br />• Vérifiez votre connexion internet
                <br />• Actualisez la page et réessayez
                <br />• Contactez directement votre médecin si urgent
              </Typography>
            </Alert>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                onClick={handleGoHome}
                startIcon={<HomeIcon />}
                sx={{ px: 4 }}
              >
                Retour à l'accueil
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleBookAnother}
                startIcon={<CalendarIcon />}
                sx={{ px: 4 }}
              >
                Prendre un rendez-vous
              </Button>
              <Button 
                variant="text" 
                onClick={handleContactSupport}
                startIcon={<SupportIcon />}
                sx={{ px: 4 }}
              >
                Contacter le support
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AppointmentError; 