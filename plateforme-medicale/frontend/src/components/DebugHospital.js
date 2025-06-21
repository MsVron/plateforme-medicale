import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';

const DebugHospital = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Get all relevant data from localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    let userData = null;
    try {
      userData = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    // Get current URL info
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    setDebugInfo({
      token: token ? `${token.substring(0, 50)}...` : 'No token',
      userData,
      currentPath,
      currentSearch,
      timestamp: new Date().toISOString()
    });

    console.log('DebugHospital - Full debug info:', {
      token: token ? 'Present' : 'Missing',
      userData,
      currentPath,
      currentSearch
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hospital Debug Information
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Authentication Status
        </Typography>
        <Typography><strong>Token:</strong> {debugInfo.token}</Typography>
        <Typography><strong>Current Path:</strong> {debugInfo.currentPath}</Typography>
        <Typography><strong>Query String:</strong> {debugInfo.currentSearch}</Typography>
        <Typography><strong>Timestamp:</strong> {debugInfo.timestamp}</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          User Data from localStorage
        </Typography>
        {debugInfo.userData ? (
          <Box>
            <Typography><strong>ID:</strong> {debugInfo.userData.id}</Typography>
            <Typography><strong>Username:</strong> {debugInfo.userData.nom_utilisateur}</Typography>
            <Typography><strong>Email:</strong> {debugInfo.userData.email}</Typography>
            <Typography><strong>Role:</strong> {debugInfo.userData.role}</Typography>
            <Typography><strong>First Name:</strong> {debugInfo.userData.prenom}</Typography>
            <Typography><strong>Last Name:</strong> {debugInfo.userData.nom}</Typography>
            <Typography><strong>Specific Role ID:</strong> {debugInfo.userData.id_specifique_role}</Typography>
          </Box>
        ) : (
          <Alert severity="error">No user data found in localStorage</Alert>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Role Check Results
        </Typography>
        {debugInfo.userData ? (
          <Box>
            <Typography>
              <strong>Role matches 'hospital':</strong> {debugInfo.userData.role === 'hospital' ? '✅ YES' : '❌ NO'}
            </Typography>
            <Typography>
              <strong>Role in ['hospital'] array:</strong> {['hospital'].includes(debugInfo.userData.role) ? '✅ YES' : '❌ NO'}
            </Typography>
            <Typography>
              <strong>Exact role value:</strong> "{debugInfo.userData.role}" (length: {debugInfo.userData.role?.length})
            </Typography>
            <Typography>
              <strong>Role type:</strong> {typeof debugInfo.userData.role}
            </Typography>
          </Box>
        ) : (
          <Alert severity="warning">Cannot check role - no user data</Alert>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Raw Data (JSON)
        </Typography>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </Paper>
    </Box>
  );
};

export default DebugHospital; 