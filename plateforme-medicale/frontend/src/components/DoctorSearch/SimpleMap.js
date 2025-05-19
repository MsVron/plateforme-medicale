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

  // Filter valid doctors with coordinates
  const validDoctors = doctors.filter(doctor => {
    if (!doctor.latitude || !doctor.longitude) return false;
    const lat = parseFloat(doctor.latitude);
    const lng = parseFloat(doctor.longitude);
    return !isNaN(lat) && !isNaN(lng);
  });

  // Generate the OpenStreetMap URL with proper bounds for Morocco
  const generateMapUrl = () => {
    let url = 'https://www.openstreetmap.org/export/embed.html';
    
    // Set map center and zoom
    const centerLat = mapCenter?.lat || 28.96;
    const centerLng = mapCenter?.lng || -9.13;
    const zoomLevel = zoom || 5;
    
    // Add center and zoom parameters
    url += `?lat=${centerLat}&lon=${centerLng}&zoom=${zoomLevel}`;
    
    // Add base layer
    url += '&layer=mapnik';

    // Add markers for valid doctors
    validDoctors.forEach((doctor, index) => {
      const lat = parseFloat(doctor.latitude);
      const lng = parseFloat(doctor.longitude);
      
      if (!isNaN(lat) && !isNaN(lng) &&
          lat >= MOROCCO_BOUNDS.minLat && 
          lat <= MOROCCO_BOUNDS.maxLat &&
          lng >= MOROCCO_BOUNDS.minLng && 
          lng <= MOROCCO_BOUNDS.maxLng) {
        
        // Add marker with a unique ID
        url += `&mlat${index}=${lat}&mlon${index}=${lng}`;
        
        // Add marker name (doctor info)
        const markerName = encodeURIComponent(`Dr. ${doctor.prenom} ${doctor.nom} - ${doctor.specialite_nom}`);
        url += `&mtext${index}=${markerName}`;
      }
    });

    // Add user location if available
    if (userLocation && 
        userLocation.lat >= MOROCCO_BOUNDS.minLat && 
        userLocation.lat <= MOROCCO_BOUNDS.maxLat &&
        userLocation.lng >= MOROCCO_BOUNDS.minLng && 
        userLocation.lng <= MOROCCO_BOUNDS.maxLng) {
      const userIndex = validDoctors.length;
      url += `&mlat${userIndex}=${userLocation.lat}&mlon${userIndex}=${userLocation.lng}&mtext${userIndex}=Votre position`;
    }

    // Add layer controls and enable markers
    url += '&layers=M&show_map_markers=1';

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
    if (selectedDoctor?.latitude && selectedDoctor?.longitude) {
      const lat = parseFloat(selectedDoctor.latitude);
      const lng = parseFloat(selectedDoctor.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        // Force iframe reload when selected doctor changes
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.src = generateMapUrl();
        }
      }
    }
  }, [selectedDoctor, mapCenter, zoom]);

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