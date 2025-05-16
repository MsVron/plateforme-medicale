import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

/**
 * Simple map component for displaying and setting coordinates
 * Uses iframe with OpenStreetMap to avoid React context issues
 */
const CoordinatesMap = ({ latitude, longitude }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // OpenStreetMap URL for the iframe
  const mapUrl = latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(longitude) - 0.01},${parseFloat(latitude) - 0.01},${parseFloat(longitude) + 0.01},${parseFloat(latitude) + 0.01}&layer=mapnik&marker=${parseFloat(latitude)},${parseFloat(longitude)}`
    : 'https://www.openstreetmap.org/export/embed.html?bbox=-11.3,27.6,0.0,35.9&layer=mapnik'; // Morocco view

  // Handle iframe loading state
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Impossible de charger la carte');
  };

  return (
    <Box 
      component={Paper} 
      sx={{ 
        position: 'relative',
        height: 300, 
        width: '100%', 
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {isLoading && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            bgcolor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <CircularProgress size={40} sx={{ color: '#4ca1af', mr: 2 }} />
          <Typography variant="body1">Chargement de la carte...</Typography>
        </Box>
      )}

      {error && (
        <Box 
          sx={{ 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Typography variant="body1" color="error">{error}</Typography>
        </Box>
      )}

      <iframe
        title="Carte des coordonnées"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        style={{ border: 0 }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />

      <Box 
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
          textAlign: 'center'
        }}
      >
        <Typography variant="caption">
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors
        </Typography>
      </Box>
    </Box>
  );
};

export default CoordinatesMap; 