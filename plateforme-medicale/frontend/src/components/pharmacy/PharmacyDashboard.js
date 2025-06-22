import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocalPharmacy,
  PersonAdd,
  Search,
  Assignment,
  History,
  Medication,
  Refresh
} from '@mui/icons-material';
import pharmacyService from '../../services/pharmacyService';
import PatientSearchTab from './PatientSearchTab';

const PharmacyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement du tableau de bord...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalPharmacy sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Tableau de Bord Pharmacie
          </Typography>
        </Box>
      </Box>

      {/* Alert Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
          {success}
        </Alert>
      )}

      {/* Main Content */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Box sx={{ p: 3 }}>
            <PatientSearchTab 
              onSuccess={showSuccess} 
              onError={showError}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default PharmacyDashboard; 