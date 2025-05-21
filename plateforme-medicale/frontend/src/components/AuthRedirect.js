import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AuthRedirect - Redirects authenticated users away from authentication pages
 * 
 * This component checks if a user is already logged in (has token and user data in localStorage)
 * and redirects them to their role-specific dashboard if they attempt to access:
 * - /login
 * - /register/patient
 */
const AuthRedirect = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register/patient'].includes(location.pathname);
  
  // Check if user is authenticated
  let user = null;
  const token = localStorage.getItem('token');
  
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  // If user is on auth page and is already authenticated, redirect to appropriate dashboard
  if (isAuthPage && token && user) {
    // Determine where to redirect based on user role
    let redirectPath = '/login';
    
    if (['super_admin', 'admin'].includes(user.role)) {
      redirectPath = '/admin';
    } else if (user.role === 'medecin') {
      redirectPath = '/medecin';
    } else if (user.role === 'patient') {
      redirectPath = '/patient';
    } else if (user.role === 'institution') {
      redirectPath = '/institution';
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`User already authenticated. Redirecting from ${location.pathname} to ${redirectPath}`);
    }
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // Otherwise render the original component
  return children;
};

export default AuthRedirect; 