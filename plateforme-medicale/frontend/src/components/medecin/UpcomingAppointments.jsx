import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, Chip, CircularProgress, Pagination,
  Alert, IconButton, Tooltip
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Today as TodayIcon,
  MedicalServices as MedicalIcon,
  Assignment as AssignmentIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  // Status colors
  const statusColors = {
    'planifié': 'info',
    'confirmé': 'success',
    'en cours': 'warning',
    'terminé': 'default',
    'annulé': 'error',
    'patient absent': 'error'
  };

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/medecin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: rowsPerPage,
          offset: (page - 1) * rowsPerPage
        }
      });
      
      setAppointments(response.data.appointments);
      setTotalPages(Math.ceil(response.data.total / rowsPerPage));
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Impossible de récupérer les rendez-vous. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (appointments.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Aucun rendez-vous à venir
        </Typography>
        <Typography variant="body1">
          Vous n'avez pas de rendez-vous programmés pour le moment.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TodayIcon sx={{ mr: 1 }} /> Rendez-vous à venir
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Heure</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Motif</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TodayIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    {appointment.date_formatted}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    {appointment.heure_debut_formatted} - {appointment.heure_fin_formatted}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Link to={`/medecin/patients/${appointment.patient_id}/medical-record`}>
                      {appointment.patient_prenom} {appointment.patient_nom}
                    </Link>
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      ({appointment.patient_age} ans)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{appointment.motif}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlaceIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    {appointment.institution_nom}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.statut} 
                    color={statusColors[appointment.statut]} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="Détails du rendez-vous">
                      <IconButton 
                        component={Link} 
                        to={`/medecin/appointments/${appointment.id}`}
                        size="small"
                        color="primary"
                      >
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Dossier médical">
                      <IconButton 
                        component={Link} 
                        to={`/medecin/patients/${appointment.patient_id}/medical-record`}
                        size="small"
                        color="secondary"
                      >
                        <MedicalIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ajouter consultation">
                      <IconButton 
                        component={Link} 
                        to={`/medecin/appointments/${appointment.id}/consultation`}
                        size="small"
                        color="success"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Box>
  );
};

export default UpcomingAppointments; 