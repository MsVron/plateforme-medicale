import React from 'react';
import { Box, Typography } from '@mui/material';

const MedecinHome = () => {
  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#f0fff0', borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Espace Médecin
      </Typography>
      <Typography variant="body1">
        Bienvenue sur votre espace médecin de la plateforme médicale.
      </Typography>
    </Box>
  );
};

export default MedecinHome;