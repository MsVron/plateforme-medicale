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
import PrescriptionsTab from './PrescriptionsTab';
import HistoryTab from './HistoryTab';

const PharmacyDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    dispensedToday: 0,
    pendingPrescriptions: 0,
    totalPatients: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const statsData = await pharmacyService.getPharmacyStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    clearMessages();
  };

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
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            Tableau de Bord Pharmacie
          </Typography>
        </Box>
        <Tooltip title="Actualiser les données">
          <IconButton onClick={fetchDashboardStats} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4ca1af 0%, #2c3e50 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalPrescriptions}
              </Typography>
              <Typography variant="body2">
                Total Prescriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #3a6e78 0%, #4ca1af 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Medication sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.dispensedToday}
              </Typography>
              <Typography variant="body2">
                Dispensées Aujourd'hui
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #3a6e78 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalPharmacy sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.pendingPrescriptions}
              </Typography>
              <Typography variant="body2">
                En Attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4ca1af 0%, #2c3e50 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PersonAdd sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalPatients}
              </Typography>
              <Typography variant="body2">
                Patients Servis
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: 'primary.main',
              }
            }}
          >
            <Tab 
              icon={<Search />} 
              label="Rechercher Patient" 
              iconPosition="start"
            />
            <Tab 
              icon={<LocalPharmacy />} 
              label="Prescriptions" 
              iconPosition="start"
            />
            <Tab 
              icon={<History />} 
              label="Historique" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <PatientSearchTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
          {tabValue === 1 && (
            <PrescriptionsTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
          {tabValue === 2 && (
            <HistoryTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default PharmacyDashboard; 