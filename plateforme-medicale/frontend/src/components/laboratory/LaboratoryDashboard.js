import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import PatientSearchTab from './PatientSearchTab';

const LaboratoryDashboard = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  const handleError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  const handleRefresh = () => {
    // This would trigger a refresh of relevant data
    console.log('Refreshing laboratory data...');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
          Tableau de Bord - Laboratoire
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Gestion des demandes d'analyses et saisie des résultats
        </Typography>
      </Box>

      {/* Patient Search */}
      <PatientSearchTab 
        onSuccess={handleSuccess}
        onError={handleError}
        onRefresh={handleRefresh}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LaboratoryDashboard; 