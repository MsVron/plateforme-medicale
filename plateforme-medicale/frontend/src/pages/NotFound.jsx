import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { Error as ErrorIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
        </Box>
        <Typography variant="h4" gutterBottom>
          Page non trouvée
        </Typography>
        <Typography variant="body1" paragraph>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>
        <Button 
          component={Link} 
          to="/"
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          Retour à l'accueil
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound; 