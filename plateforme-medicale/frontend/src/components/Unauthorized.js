import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  // Debug information
  const userData = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Accès non autorisé
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
        {userData && (
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Rôle utilisateur: {JSON.parse(userData).role}
          </Typography>
        )}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
          <Button
            variant="outlined"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Unauthorized;