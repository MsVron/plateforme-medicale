import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import axios from 'axios';

const FavoriteButton = ({ doctorId, size = 'medium' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userObj = user ? JSON.parse(user) : null;
    
    if (token && userObj && userObj.role === 'patient') {
      setIsAuthenticated(true);
      checkFavoriteStatus();
    }
  }, [doctorId]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/patient/favorites/check/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (!isAuthenticated) {
      // Could show a login prompt here
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:5000/api/patient/favorites/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(`http://localhost:5000/api/patient/favorites/${doctorId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show the button if user is not authenticated as patient
  }

  return (
    <Tooltip title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
      <IconButton
        onClick={handleToggleFavorite}
        disabled={loading}
        size={size}
        sx={{
          color: isFavorite ? 'error.main' : 'text.secondary',
          '&:hover': {
            color: 'error.main',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        {loading ? (
          <CircularProgress size={size === 'small' ? 16 : 24} />
        ) : isFavorite ? (
          <FavoriteIcon />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton; 