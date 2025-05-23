import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PreferencePatientsDirectsToggle = () => {
  const [preference, setPreference] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPreference();
  }, []);

  const fetchPreference = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching preference with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${API_URL}/medecin/walk-in-preference`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Preference response:', response.data);
      setPreference(response.data.accepte_patients_walk_in);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching preference:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      setError('Impossible de récupérer la préférence patients directs');
      setLoading(false);
    }
  };

  const updatePreference = async (newPreference) => {
    setUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      console.log('Updating preference to:', newPreference);
      
      const response = await axios.put(`${API_URL}/medecin/walk-in-preference`, 
        { accepte_patients_walk_in: newPreference },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Update response:', response.data);
      setPreference(newPreference);
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating preference:', err);
      console.error('Error response:', err.response?.data);
      
      setError(
        err.response?.data?.message || 
        'Erreur lors de la mise à jour de la préférence'
      );
      // Revert the switch if update failed
      setPreference(!newPreference);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggle = (event) => {
    const newPreference = event.target.checked;
    setPreference(newPreference);
    updatePreference(newPreference);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {preference ? (
          <PersonAddIcon sx={{ mr: 1, color: 'success.main' }} />
        ) : (
          <BlockIcon sx={{ mr: 1, color: 'error.main' }} />
        )}
        <Typography variant="h6">
          Patients directs
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configurez si vous acceptez les patients sans rendez-vous préalable.
        Cette préférence sera visible par les patients lors de la recherche de médecins.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel          control={            <Switch              checked={preference}              onChange={handleToggle}              disabled={updating}              color="success"              size="small"            />          }          label={            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>              <Typography variant="body2">                {preference ? 'Accepter les patients sans rendez-vous' : 'Ne pas accepter les patients sans rendez-vous'}              </Typography>              {updating && <CircularProgress size={16} />}            </Box>          }        />

        <Chip
          label={preference ? 'Accepte patients directs' : 'Pas de patients directs'}
          color={preference ? 'success' : 'default'}
          variant={preference ? 'filled' : 'outlined'}
          size="small"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Préférence mise à jour avec succès
        </Alert>
      )}

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Note:</strong> Cette préférence affecte la visibilité de votre profil 
          dans les recherches de patients. Les patients pourront voir si vous acceptez 
          les consultations sans rendez-vous préalable.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PreferencePatientsDirectsToggle; 