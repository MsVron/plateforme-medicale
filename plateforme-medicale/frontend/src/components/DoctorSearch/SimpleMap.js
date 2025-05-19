import React, { useState, useEffect } from 'react';import { Box, Typography, CircularProgress, Paper, Card, CardContent } from '@mui/material';import '../DoctorSearch/DoctorSearch.css';

// Morocco bounds - more accurate based on OpenStreetMap
const MOROCCO_BOUNDS = {
  minLat: 27.6,
  maxLat: 35.9,
  minLng: -13.2,
  maxLng: -1.0
};

/**
 * Simple map component for displaying doctors on OpenStreetMap via iframe
 * Avoids React context issues with Leaflet
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
    // Convert zoom level to appropriate bbox width/height
    const zoomFactor = Math.pow(2, 8 - (zoom || 5)) * 2;
    
    // Add bounds - wider for Morocco view
    let bounds;
    
    if (zoom <= 5) {
      // For zoomed out view, show all of Morocco
      bounds = `-13.2,27.6,-1.0,35.9`;
    } else {
      // For zoomed in views, center on the specified point
      const centerLat = mapCenter?.lat || 28.96;
      const centerLng = mapCenter?.lng || -9.13;
      
      // Adjust bounds based on zoom level
      bounds = `${centerLng - zoomFactor},${centerLat - zoomFactor},${centerLng + zoomFactor},${centerLat + zoomFactor}`;
    }
    
    let url = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik`;
    
    // Add markers for doctors
    validDoctors.forEach((doctor, index) => {
      if (doctor.latitude && doctor.longitude) {
        const lat = parseFloat(doctor.latitude);
        const lng = parseFloat(doctor.longitude);
        
        // Only consider coordinates within Morocco
        if (lat >= MOROCCO_BOUNDS.minLat && 
            lat <= MOROCCO_BOUNDS.maxLat &&
            lng >= MOROCCO_BOUNDS.minLng && 
            lng <= MOROCCO_BOUNDS.maxLng) {
          url += `&marker${index}=${lat},${lng}`;
        }
      }
    });
    
    // Add user location marker if available and within Morocco
    if (userLocation && 
        userLocation.lat >= MOROCCO_BOUNDS.minLat && 
        userLocation.lat <= MOROCCO_BOUNDS.maxLat &&
        userLocation.lng >= MOROCCO_BOUNDS.minLng && 
        userLocation.lng <= MOROCCO_BOUNDS.maxLng) {
      url += `&marker=color:blue|${userLocation.lat},${userLocation.lng}`;
    }
    
    // Add selected doctor marker with different color if available
    if (selectedDoctor?.latitude && selectedDoctor?.longitude) {
      const lat = parseFloat(selectedDoctor.latitude);
      const lng = parseFloat(selectedDoctor.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        url += `&marker=color:red|${lat},${lng}`;
      }
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

      {/* Doctor list */}
      {validDoctors.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            maxWidth: 250,
            maxHeight: 380,
            overflowY: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            p: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Médecins affichés sur la carte ({validDoctors.length})
          </Typography>
          {validDoctors.map(doctor => (
            <Card 
              key={doctor.id} 
              variant="outlined" 
              sx={{ 
                mb: 1, 
                backgroundColor: '#f5f9fc',
                borderColor: '#4ca1af',
                '&:hover': {
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4ca1af' }}>
                  Dr. {doctor.prenom} {doctor.nom}
                </Typography>
                <Typography variant="caption" display="block">
                  {doctor.specialite_nom}
                </Typography>
                {doctor.ville && (
                  <Typography variant="caption" display="block">
                    {doctor.ville}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SimpleMap; 