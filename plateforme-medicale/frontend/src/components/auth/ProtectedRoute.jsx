import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, roles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // Verify the token with the backend
        const response = await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsAuthenticated(true);
        setUserRole(response.data.role);
        setLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(userRole)) {
    // User is authenticated but not authorized for this route
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute; 