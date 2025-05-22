import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import { formatDateTime } from '../../utils/dateUtils';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/medecin/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAppointments(response.data.appointments || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Erreur lors de la récupération des rendez-vous');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/medecin/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      // Update local state
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      ));
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Erreur lors de la mise à jour du statut du rendez-vous');
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'warning' },
      confirmed: { label: 'Confirmé', color: 'success' },
      completed: { label: 'Terminé', color: 'info' },
      cancelled: { label: 'Annulé', color: 'error' },
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small" 
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Mes Rendez-vous
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {appointments.length === 0 ? (
        <Typography>Aucun rendez-vous trouvé.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date et Heure</TableCell>
                <TableCell>Motif</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {appointment.patient?.prenom} {appointment.patient?.nom}
                  </TableCell>
                  <TableCell>{formatDateTime(appointment.date_heure)}</TableCell>
                  <TableCell>{appointment.motif || 'Non spécifié'}</TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell>
                    {appointment.status === 'pending' && (
                      <>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="success" 
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        >
                          Confirmer
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="error"
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        >
                          Annuler
                        </Button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="info"
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                      >
                        Marquer comme terminé
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Appointments; 