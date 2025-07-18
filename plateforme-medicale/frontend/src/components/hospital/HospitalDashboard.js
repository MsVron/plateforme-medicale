import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import HospitalDoctorsTab from './HospitalDoctorsTab';
import HospitalAdmissionsTab from './HospitalAdmissionsTab';

const HospitalDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Map routes to tab indices
  const routeToTabMap = {
    '/hospital/dashboard': 0,
    '/hospital/doctors': 0,
    '/hospital/admissions': 1
  };

  // Map tab indices to routes
  const tabToRouteMap = {
    0: '/hospital/doctors',
    1: '/hospital/admissions'
  };

  useEffect(() => {
    const currentTab = routeToTabMap[location.pathname];
    if (currentTab !== undefined) {
      setActiveTab(currentTab);
    }
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const route = tabToRouteMap[newValue];
    if (route) {
      navigate(route);
    }
  };

  const handleSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const handleError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    // Trigger refresh for the current tab
    window.location.reload();
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white'
        }}
      >
        <Box display="flex" alignItems="center">
          <HospitalIcon sx={{ fontSize: 40, mr: 2, color: 'white' }} />
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
            Tableau de Bord Hôpital
          </Typography>
        </Box>
      </Paper>

      {/* Main Content */}
      <Paper elevation={3} sx={{ flexGrow: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              color: '#666',
              fontWeight: 'bold',
              '&.Mui-selected': {
                color: '#d32f2f'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#d32f2f'
            }
          }}
        >
          <Tab label="Médecins de l'Hôpital" />
          <Tab label="Admissions Hospitalières" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <HospitalDoctorsTab 
              onSuccess={handleSuccess}
              onError={handleError}
              onRefresh={handleRefresh}
            />
          )}
          {activeTab === 1 && <HospitalAdmissionsTab />}
        </Box>
      </Paper>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HospitalDashboard;