import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress } from '@mui/material';

const InstitutionHome = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Chargement...</Typography>
        </Box>
      </Container>
    );
  }

  // Redirect based on user role
  if (user?.role) {
    switch (user.role) {
      case 'hospital':
        return <Navigate to="/hospital/dashboard" replace />;
      case 'pharmacy':
        return <Navigate to="/pharmacy/dashboard" replace />;
      case 'laboratory':
        return <Navigate to="/laboratory/dashboard" replace />;
      default:
        break;
    }
  }

  // Default institution home for generic institutions
  return (
    <Container>
      <Box sx={{ mt: 4, p: 3, bgcolor: '#fffacd', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Espace Institution Médicale
        </Typography>
        <Typography variant="body1">
          Bienvenue sur votre espace institution de la plateforme médicale.
        </Typography>
      </Box>
    </Container>
  );
};

export default InstitutionHome;