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
      
      console.log('Fetching slots for date:', formattedDate);
      
      const response = await axios.get(`/api/appointments/slots`, {
        params: {
          medecin_id: doctor.id,
          date: formattedDate
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('API Response:', response.data);
      
      if (response.data.slots && Array.isArray(response.data.slots)) {
        setAvailableSlots(response.data.slots);
        if (response.data.slots.length === 0) {
          setMessage('Aucun créneau disponible pour cette date');
        }
      } else {
        console.error('Invalid slots data received:', response.data.slots);
        setError('Format de données invalide pour les créneaux');
      }

      if (response.data.schedule) {
        setDoctorSchedule(response.data.schedule);
      }
      if (response.data.message) {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des créneaux');
    } finally {
      setLoading(false);
    }
  }, [doctor.id]);

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
      console.error('Erreur lors de la prise de rendez-vous:', error);
      setError(error.response?.data?.message || 'Erreur lors de la prise de rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const minDate = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 90);

  // Group slots by morning/afternoon
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const hour = getHours(parseISO(slot.debut));
    if (hour < 12) {
      acc.morning.push(slot);
    } else {
      acc.afternoon.push(slot);
    }
    return acc;
  }, { morning: [], afternoon: [] });

  // Modified time slot display component
  const TimeSlots = ({ title, slots }) => {
    if (!slots || slots.length === 0) return null;
    
    return (
      <TimeSlotSection>
        <Typography variant="subtitle1" className="section-title">
          <AccessTimeIcon fontSize="small" />
          {title}
        </Typography>
        <TimeSlotList>
          {slots.map((slot) => (
            <li key={slot.debut}>
              <TimeSlotButton
                variant="outlined"
                className={selectedSlot?.debut === slot.debut ? 'selected' : ''}
                onClick={() => setSelectedSlot(slot)}
              >
                {format(parseISO(slot.debut), 'HH:mm')}
              </TimeSlotButton>
            </li>
          ))}
        </TimeSlotList>
      </TimeSlotSection>
    );
  };

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
                      {format(parseISO(`2000-01-01T${doctorSchedule.heure_debut}`), 'HH:mm')} - 
                      {format(parseISO(`2000-01-01T${doctorSchedule.heure_fin}`), 'HH:mm')}
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
                        {`Pause déjeuner: ${format(parseISO(`2000-01-01T${doctorSchedule.heure_debut_pause}`), 'HH:mm')} - 
                         ${format(parseISO(`2000-01-01T${doctorSchedule.heure_fin_pause}`), 'HH:mm')}`}
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
                ) : availableSlots.length === 0 ? (
                  <Alert severity="info">Aucun créneau disponible pour cette date</Alert>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <TimeSlots title="Matin" slots={groupedSlots.morning} />
                    <TimeSlots title="Après-midi" slots={groupedSlots.afternoon} />
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