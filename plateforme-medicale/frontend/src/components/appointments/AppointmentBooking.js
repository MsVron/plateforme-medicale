import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  styled
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, parseISO, getHours } from 'date-fns';
import fr from 'date-fns/locale/fr';
import axios from 'axios';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HorizontalTimeSlider from './HorizontalTimeSlider';
import { formatDate, formatTime, formatDateTime } from '../../utils/dateUtils';
import './HorizontalTimeSlider.css';
import useTimeSlots from '../../hooks/useTimeSlots';

// Styled components for time slots
const TimeSlotList = styled('ul')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: 0,
  margin: '16px 0',
  listStyle: 'none',
  '& li': {
    display: 'inline-block'
  }
});

const TimeSlotButton = styled(Button)(({ theme }) => ({
  minWidth: '90px',
  margin: '4px',
  '&.selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    }
  }
}));

const TimeSlotSection = styled(Box)({
  marginBottom: '24px',
  '& .section-title': {
    marginBottom: '12px',
    color: 'primary.main',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
});

const AppointmentBooking = ({ doctor, onClose, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [motif, setMotif] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [doctorSchedule, setDoctorSchedule] = useState(null);

  const fetchAvailableSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const token = localStorage.getItem('token');
      
      console.log('DEBUG: Fetching slots for date:', formattedDate);
      console.log('DEBUG: Doctor ID:', doctor.id);
      
      const response = await axios.get(`/api/appointments/formatted-slots`, {
        params: {
          medecin_id: doctor.id,
          date: formattedDate
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('DEBUG: API Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.slots && Array.isArray(response.data.slots)) {
        // Add debugging for the returned slots
        console.log('DEBUG: Received slots:', response.data.slots.length);
        console.log('DEBUG: First few slots:', response.data.slots.slice(0, 3));
        
        setAvailableSlots(response.data.slots);
        if (response.data.slots.length === 0) {
          setMessage('Aucun créneau disponible pour cette date');
        }
      } else {
        console.error('DEBUG: Invalid slots data received:', response.data.slots);
        setError('Format de données invalide pour les créneaux');
      }

      if (response.data.schedule) {
        console.log('DEBUG: Received schedule:', response.data.schedule);
        setDoctorSchedule(response.data.schedule);
      }
      
      if (response.data.message) {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('DEBUG: Error fetching slots:', error);
      console.error('DEBUG: Error response data:', error.response?.data);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des créneaux');
    } finally {
      setLoading(false);
    }
  }, [doctor.id, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, fetchAvailableSlots]);

  const handleBookAppointment = async () => {
    try {
      if (!selectedSlot || !motif) {
        setError('Veuillez sélectionner un créneau et indiquer le motif de la consultation');
        return;
      }

      setLoading(true);
      setError('');

      console.log('DEBUG: Booking appointment with slot:', selectedSlot);

      const token = localStorage.getItem('token');
      await axios.post('/api/appointments', {
        medecin_id: doctor.id,
        date_heure_debut: selectedSlot.debut,
        date_heure_fin: selectedSlot.fin,
        motif,
        mode: 'présentiel',
        notes_patient: notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('DEBUG: Error booking appointment:', error);
      console.error('DEBUG: Error response data:', error.response?.data);
      setError(error.response?.data?.message || 'Erreur lors de la prise de rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const minDate = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 90);

  // Convert the availableSlots to the format expected by the HorizontalTimeSlider
  const formattedAvailableSlots = availableSlots.map(slot => ({
    debut: slot.debut,
    fin: slot.fin,
    time: slot.time || formatTime(slot.debut)
  }));

  // Debug display of formatted slots
  useEffect(() => {
    console.log('DEBUG: Formatted slots for display:', formattedAvailableSlots);
  }, [formattedAvailableSlots]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <EventAvailableIcon color="primary" />
          <Typography>
            Prendre rendez-vous avec Dr. {doctor.prenom} {doctor.nom}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date du rendez-vous"
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    setSelectedSlot(null);
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                  slotProps={{ textField: { fullWidth: true } }}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>

            {doctorSchedule && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    Horaires du médecin
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button
                      startIcon={<AccessTimeIcon />}
                      size="small"
                      variant="outlined"
                    >
                      {formatTime(doctorSchedule.heure_debut)} - 
                      {formatTime(doctorSchedule.heure_fin)}
                    </Button>
                    <Button
                      startIcon={<AccessTimeIcon />}
                      size="small"
                      variant="outlined"
                    >
                      {`${doctorSchedule.intervalle_minutes} min par consultation`}
                    </Button>
                    {doctorSchedule.a_pause_dejeuner && (
                      <Button
                        startIcon={<RestaurantIcon />}
                        size="small"
                        variant="outlined"
                      >
                        {`Pause déjeuner: ${formatTime(doctorSchedule.heure_debut_pause)} - 
                         ${formatTime(doctorSchedule.heure_fin_pause)}`}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motif de la consultation"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                required
                multiline
                rows={2}
                error={!motif && selectedSlot}
                helperText={!motif && selectedSlot ? "Le motif est requis" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes additionnelles"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={2}
                helperText="Facultatif: ajoutez des informations complémentaires pour le médecin"
              />
            </Grid>

            {selectedDate && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon color="primary" />
                  Créneaux disponibles
                </Typography>
                
                {loading ? (
                  <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                  </Box>
                ) : message ? (
                  <Alert severity="info">{message}</Alert>
                ) : formattedAvailableSlots.length === 0 ? (
                  <Alert severity="info">Aucun créneau disponible pour cette date</Alert>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <HorizontalTimeSlider
                      slots={formattedAvailableSlots}
                      selectedDate={selectedDate}
                      selectedSlot={selectedSlot}
                      onSelectSlot={setSelectedSlot}
                      loading={loading}
                    />
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleBookAppointment}
          variant="contained"
          disabled={loading || !selectedSlot || !motif}
          endIcon={loading && <CircularProgress size={20} />}
        >
          Confirmer le rendez-vous
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentBooking;