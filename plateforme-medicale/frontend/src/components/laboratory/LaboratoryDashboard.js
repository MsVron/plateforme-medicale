import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import PendingWorkTab from './PendingWorkTab';
import ResultEntryTab from './ResultEntryTab';
import PatientSearchTab from './PatientSearchTab';
import TestRequestsTab from './TestRequestsTab';

const LaboratoryDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          Tableau de Bord - Laboratoire
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion des demandes d'analyses et saisie des résultats
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Demandes en Attente
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                -
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <ScienceIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                En Cours
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                -
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Terminées Aujourd'hui
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                -
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Patients Traités
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                -
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content with Tabs */}
      <Card sx={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none'
              }
            }}
          >
            <Tab label="Demandes en Attente" />
            <Tab label="Saisie des Résultats" />
            <Tab label="Recherche Patient" />
            <Tab label="Historique des Demandes" />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <PendingWorkTab 
              onSuccess={handleSuccess}
              onError={handleError}
              onRefresh={handleRefresh}
            />
          )}
          
          {activeTab === 1 && (
            <ResultEntryTab 
              onSuccess={handleSuccess}
              onError={handleError}
              onRefresh={handleRefresh}
            />
          )}
          
          {activeTab === 2 && (
            <PatientSearchTab 
              onSuccess={handleSuccess}
              onError={handleError}
              onRefresh={handleRefresh}
            />
          )}
          
          {activeTab === 3 && (
            <TestRequestsTab 
              onSuccess={handleSuccess}
              onError={handleError}
              onRefresh={handleRefresh}
            />
          )}
        </Box>
      </Card>

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