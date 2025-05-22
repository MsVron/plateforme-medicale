import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import { formatDateTime, formatDate, formatTime } from '../../utils/dateUtils';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/patient/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      setError('Impossible de récupérer vos rendez-vous. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/patient/appointments/${appointmentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, statut: 'annulé' } 
          : appointment
      ));
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      setError('Impossible d\'annuler le rendez-vous. Veuillez réessayer.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'planifié':
        return 'info';
      case 'confirmé':
        return 'success';
      case 'en cours':
        return 'warning';
      case 'terminé':
        return 'default';
      case 'annulé':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'planifié':
        return 'Planifié';
      case 'confirmé':
        return 'Confirmé';
      case 'en cours':
        return 'En cours';
      case 'terminé':
        return 'Terminé';
      case 'annulé':
        return 'Annulé';
      default:
        return status || 'Inconnu';
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon color="primary" />
          Mes rendez-vous
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Consultez et gérez vos rendez-vous médicaux
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun rendez-vous trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Vous n'avez pas encore de rendez-vous planifiés.
          </Typography>
          <Button variant="contained" href="/patient/search-doctors">
            Rechercher un médecin
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      Dr. {appointment.medecin_prenom} {appointment.medecin_nom}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(appointment.statut)} 
                      color={getStatusColor(appointment.statut)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDate(appointment.date_heure_debut)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatTime(appointment.date_heure_debut)} - {formatTime(appointment.date_heure_fin)}
                      </Typography>
                    </Box>
                    {appointment.institution_nom && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PlaceIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {appointment.institution_nom}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {appointment.motif && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Motif:</strong> {appointment.motif}
                    </Typography>
                  )}

                  {appointment.notes_patient && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Notes:</strong> {appointment.notes_patient}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {appointment.statut?.toLowerCase() === 'planifié' && (
                      <Tooltip title="Annuler le rendez-vous">
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PatientAppointments; 