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
  LocalHospital,
  PersonAdd,
  Search,
  Bed,
  People,
  Assignment,
  Refresh
} from '@mui/icons-material';
import hospitalService from '../../services/hospitalService';
import PatientSearchTab from './PatientSearchTab';
import HospitalPatientsTab from './HospitalPatientsTab';
import WalkInPatientTab from './WalkInPatientTab';

const HospitalDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    admittedPatients: 0,
    availableBeds: 0,
    totalDoctors: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const patientsData = await hospitalService.getHospitalPatients();
      const doctorsData = await hospitalService.getHospitalDoctors();
      
      setStats({
        totalPatients: patientsData.patients?.length || 0,
        admittedPatients: patientsData.patients?.filter(p => p.status === 'admitted').length || 0,
        availableBeds: 50, // This would come from bed management API
        totalDoctors: doctorsData.doctors?.length || 0
      });
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
          <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            Tableau de Bord Hôpital
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
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalPatients}
              </Typography>
              <Typography variant="body2">
                Total Patients
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
              <Assignment sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.admittedPatients}
              </Typography>
              <Typography variant="body2">
                Patients Admis
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
              <Bed sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.availableBeds}
              </Typography>
              <Typography variant="body2">
                Lits Disponibles
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
              <LocalHospital sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalDoctors}
              </Typography>
              <Typography variant="body2">
                Médecins
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
              icon={<People />} 
              label="Patients Hôpital" 
              iconPosition="start"
            />
            <Tab 
              icon={<PersonAdd />} 
              label="Patient Direct" 
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
            <HospitalPatientsTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
          {tabValue === 2 && (
            <WalkInPatientTab 
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

export default HospitalDashboard; 