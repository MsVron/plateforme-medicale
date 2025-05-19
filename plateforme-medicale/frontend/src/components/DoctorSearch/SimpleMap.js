import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import '../DoctorSearch/DoctorSearch.css';

// Morocco bounds - more accurate based on OpenStreetMap
const MOROCCO_BOUNDS = {
  minLat: 27.6,
  maxLat: 35.9,
  minLng: -13.2,
  maxLng: -1.0
};

/**
 * Simple map component for displaying doctors on OpenStreetMap via iframe
 * Uses OpenStreetMap's Nominatim service for better marker display
 */
const SimpleMap = ({ doctors, selectedDoctor, mapCenter, zoom, userLocation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter valid doctors with coordinates and ensure they're within Morocco bounds
  const validDoctors = doctors.filter(doctor => {
    const lat = parseFloat(doctor.latitude);
    const lng = parseFloat(doctor.longitude);
    
    if (isNaN(lat) || isNaN(lng)) return false;
    
    return (
      lat >= MOROCCO_BOUNDS.minLat && 
      lat <= MOROCCO_BOUNDS.maxLat &&
      lng >= MOROCCO_BOUNDS.minLng && 
      lng <= MOROCCO_BOUNDS.maxLng
    );
  });

  // Generate the OpenStreetMap URL with proper bounds for Morocco
  const generateMapUrl = () => {
    let url = 'https://www.openstreetmap.org/export/embed.html';
    
    // If we have a selected doctor with valid coordinates, center on them
    let centerLat, centerLng;
    
    if (selectedDoctor?.latitude && selectedDoctor?.longitude) {
      centerLat = parseFloat(selectedDoctor.latitude);
      centerLng = parseFloat(selectedDoctor.longitude);
    } else if (mapCenter?.lat && mapCenter?.lng) {
      centerLat = parseFloat(mapCenter.lat);
      centerLng = parseFloat(mapCenter.lng);
    } else {
      // Default center of Morocco if no valid coordinates
      centerLat = 31.7917;
      centerLng = -7.0926;
    }
    
    // Ensure coordinates are within Morocco bounds
    centerLat = Math.max(MOROCCO_BOUNDS.minLat, Math.min(MOROCCO_BOUNDS.maxLat, centerLat));
    centerLng = Math.max(MOROCCO_BOUNDS.minLng, Math.min(MOROCCO_BOUNDS.maxLng, centerLng));
    
    // Set zoom level based on context
    let zoomLevel = zoom;
    if (selectedDoctor?.latitude && selectedDoctor?.longitude) {
      zoomLevel = 13; // Closer zoom when doctor is selected
    } else if (validDoctors.length === 1) {
      zoomLevel = 11;
    } else if (validDoctors.length > 1) {
      zoomLevel = 8;
    } else {
      zoomLevel = 6; // Default zoom for Morocco
    }
    
    // Add center and zoom parameters
    url += `?bbox=${centerLng - 0.1},${centerLat - 0.1},${centerLng + 0.1},${centerLat + 0.1}`;
    url += `&layer=mapnik`;
    
    // Add markers for valid doctors
    validDoctors.forEach((doctor, index) => {
      const lat = parseFloat(doctor.latitude);
      const lng = parseFloat(doctor.longitude);
      
      // Add marker with doctor information
      url += `&marker${index}=${lat},${lng},${encodeURIComponent(`Dr. ${doctor.prenom} ${doctor.nom}`)}`;
    });

    // Add user location if available and within Morocco
    if (userLocation?.lat && userLocation?.lng &&
        userLocation.lat >= MOROCCO_BOUNDS.minLat && 
        userLocation.lat <= MOROCCO_BOUNDS.maxLat &&
        userLocation.lng >= MOROCCO_BOUNDS.minLng && 
        userLocation.lng <= MOROCCO_BOUNDS.maxLng) {
      const userIndex = validDoctors.length;
      url += `&marker${userIndex}=${userLocation.lat},${userLocation.lng},Votre position`;
    }

    return url;
  };

  // Handle iframe loading state
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Impossible de charger la carte');
  };

  // Effect to update map when center or zoom changes
  useEffect(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = generateMapUrl();
    }
  }, [selectedDoctor, mapCenter, zoom, doctors]);

  return (
    <Box 
      component={Paper} 
      sx={{ 
        position: 'relative',
        height: 500, 
        width: '100%', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
        title="Carte des médecins"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={generateMapUrl()}
        style={{
          border: 0,
          borderRadius: '8px'
        }}
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

export default SimpleMap; 