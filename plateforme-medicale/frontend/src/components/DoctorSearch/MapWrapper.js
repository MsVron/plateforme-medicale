import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';

// This wrapper component helps avoid map initialization issues
const MapWrapper = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);
  const mountAttempts = useRef(0);
  const maxAttempts = 3;

  useEffect(() => {
    try {
      if (mountAttempts.current >= maxAttempts) {
        setError('Maximum initialization attempts reached');
        return;
      }

      mountAttempts.current += 1;
      
      // Wait for the next render cycle to ensure DOM is ready
      const timer = setTimeout(() => {
        setMounted(true);
      }, 200); // Give it a bit more time
      
      return () => {
        clearTimeout(timer);
        setMounted(false);
      };
    } catch (err) {
      console.error("Map initialization error:", err);
      setError(err.message);
    }
  }, []);

  // Add a second effect to retry if there was an error from a context consumer
  useEffect(() => {
    if (mounted && error && mountAttempts.current < maxAttempts) {
      // Try one more time after a slight delay
      const retryTimer = setTimeout(() => {
        console.log('Retrying map initialization...');
        setError(null);
        setMounted(false);
      }, 300);
      
      return () => clearTimeout(retryTimer);
    }
  }, [mounted, error]);

  if (error) {
    return (
      <Paper sx={{ 
        p: 3, 
        textAlign: 'center', 
        height: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#fff0f5' 
      }}>
        <Typography variant="body1">
          Erreur lors de l'initialisation de la carte. 
          Veuillez réessayer plus tard.
        </Typography>
      </Paper>
    );
  }

  if (!mounted) {
    return (
      <Paper sx={{ 
        p: 3, 
        textAlign: 'center', 
        height: '200px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography variant="body1">
          Chargement de la carte...
        </Typography>
      </Paper>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default MapWrapper; 