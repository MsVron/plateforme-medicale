import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const MedicalRecords = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to patient search page after a brief delay
    const timer = setTimeout(() => {
      navigate('/medecin/patients/search');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Redirection vers la recherche de patients...
      </Typography>
    </Box>
  );
};

export default MedicalRecords; 