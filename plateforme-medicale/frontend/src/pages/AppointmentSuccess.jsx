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
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const AppointmentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get('message') || 'Opération réussie';

  const handleGoHome = () => {
    navigate('/');
  };

  const handleBookAnother = () => {
    navigate('/search-doctors');
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
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
            
            <Typography variant="h4" color="success.main" gutterBottom>
              Succès !
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
              {decodeURIComponent(message)}
            </Typography>
            
            <Alert severity="success" sx={{ mt: 2, maxWidth: 500 }}>
              L'opération a été effectuée avec succès. Vous pouvez continuer à utiliser la plateforme.
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AppointmentSuccess; 