import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = [], roles = [] }) => {
  // Support both allowedRoles and roles props for backward compatibility
  const rolesList = allowedRoles.length > 0 ? allowedRoles : roles;
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        const userData = JSON.parse(user);
        console.log('ProtectedRoute: User data from localStorage:', userData);
        
        setIsAuthenticated(true);
        setUserRole(userData.role);
        setLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

  if (rolesList.length > 0 && !rolesList.includes(userRole)) {
    // User is authenticated but not authorized for this route
    console.log('ProtectedRoute: Authorization failed');
    console.log('- Required roles:', rolesList);
    console.log('- User role:', userRole);
    console.log('- User role included?', rolesList.includes(userRole));
    return <Navigate to="/unauthorized" />;
  }

  console.log('ProtectedRoute: Access granted');
  console.log('- Required roles:', rolesList);
  console.log('- User role:', userRole);

  return children;
};

export default ProtectedRoute; 