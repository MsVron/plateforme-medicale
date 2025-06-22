import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Today as TodayIcon,
  MedicalServices as MedicalIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonOff as PersonOffIcon
} from '@mui/icons-material';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, appointmentId: null, action: null });
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
      const response = await axios.get(`http://localhost:5000/api/medecin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: rowsPerPage,
          offset: (page - 1) * rowsPerPage
        }
      });
      
      console.log('=== APPOINTMENTS FETCHED ===');
      console.log('Total appointments:', response.data.appointments.length);
      console.log('Appointments data:', response.data.appointments);
      console.log('============================');
      setAppointments(response.data.appointments);
      setFilteredAppointments(response.data.appointments);
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

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(appointment =>
        appointment.patient_prenom.toLowerCase().includes(term) ||
        appointment.patient_nom.toLowerCase().includes(term) ||
        (appointment.patient_prenom + ' ' + appointment.patient_nom).toLowerCase().includes(term)
      );
      setFilteredAppointments(filtered);
    }
  };

  const handleAttendanceAction = (appointmentId, action) => {
    setConfirmDialog({ 
      open: true, 
      appointmentId, 
      action,
      title: action === 'present' ? 'Confirmer la présence' : 'Marquer comme absent',
      message: action === 'present' 
        ? 'Confirmer que le patient s\'est présenté au rendez-vous ?' 
        : 'Marquer le patient comme absent ?'
    });
  };

  const handleConfirmAttendance = async () => {
    try {
      const { appointmentId, action } = confirmDialog;
      const token = localStorage.getItem('token');
      
      const newStatus = action === 'present' ? 'en cours' : 'patient absent';
      
      await axios.put(
        `http://localhost:5000/api/medecin/appointments/${appointmentId}/status`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, statut: newStatus }
          : appointment
      );
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
      
      setConfirmDialog({ open: false, appointmentId: null, action: null });
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Erreur lors de la mise à jour du statut du rendez-vous');
      setConfirmDialog({ open: false, appointmentId: null, action: null });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, appointmentId: null, action: null });
  };

  // Check if appointment is today or in the past (for attendance tracking)
  const canTrackAttendance = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    
    // Set both dates to start of day for comparison
    today.setHours(0, 0, 0, 0);
    appointment.setHours(0, 0, 0, 0);
    
    const canTrack = appointment <= today;
    console.log('=== ATTENDANCE CHECK ===');
    console.log('Appointment date:', appointmentDate);
    console.log('Today:', today.toISOString());
    console.log('Appointment (normalized):', appointment.toISOString());
    console.log('Can track attendance:', canTrack);
    console.log('========================');
    return canTrack;
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
      <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'white' }}>
        <TodayIcon sx={{ mr: 1, color: 'white' }} /> Rendez-vous à venir
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Rechercher un patient..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: 300,
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }}
        />
      </Box>
      
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
            {filteredAppointments.map((appointment) => {
              const showAttendanceButtons = canTrackAttendance(appointment.date_heure_debut) && 
                                          appointment.statut !== 'patient absent' && 
                                          appointment.statut !== 'en cours' && 
                                          appointment.statut !== 'terminé';
              
              console.log('=== BUTTON VISIBILITY CHECK ===');
              console.log('Appointment ID:', appointment.id);
              console.log('Appointment Date:', appointment.date_heure_debut);
              console.log('Appointment Status:', appointment.statut);
              console.log('Can track attendance:', canTrackAttendance(appointment.date_heure_debut));
              console.log('Show attendance buttons:', showAttendanceButtons);
              console.log('===============================');
              
              return (
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
                    <Link to={`/medecin/patients/${appointment.patient_id}/dossier`}>
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {/* Attendance tracking buttons - only show for today's appointments or past ones */}
                      {showAttendanceButtons && (
                        <>
                          <Tooltip title="Patient présent">
                            <IconButton 
                              onClick={() => handleAttendanceAction(appointment.id, 'present')}
                              size="small"
                              color="success"
                              sx={{ minWidth: 'auto' }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Patient absent">
                      <IconButton 
                              onClick={() => handleAttendanceAction(appointment.id, 'absent')}
                        size="small"
                              color="error"
                              sx={{ minWidth: 'auto' }}
                      >
                              <PersonOffIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                        </>
                      )}
                      
                      {/* Regular action buttons */}
                    <Tooltip title="Dossier médical">
                      <IconButton 
                        component={Link} 
                        to={`/medecin/patients/${appointment.patient_id}/dossier`}
                        size="small"
                        color="secondary"
                          sx={{ minWidth: 'auto' }}
                      >
                        <MedicalIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                      <Tooltip title="Consultation">
                      <IconButton 
                        component={Link} 
                          to={`/medecin/patients/${appointment.patient_id}/dossier`}
                        size="small"
                          color="info"
                          sx={{ minWidth: 'auto' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white',
              },
              '& .Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderColor: 'white',
              },
              '& .Mui-selected:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          />
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCloseConfirmDialog}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="inherit">
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmAttendance} 
            color={confirmDialog.action === 'present' ? 'success' : 'error'}
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpcomingAppointments; 