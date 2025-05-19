import React, { useState, useEffect } from 'react';
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
  ButtonGroup
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, parseISO, getHours } from 'date-fns';
import fr from 'date-fns/locale/fr';
import axios from 'axios';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';

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

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError('');
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/appointments/slots`, {
        params: {
          medecin_id: doctor.id,
          date: formattedDate
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableSlots(response.data.slots);
      if (response.data.schedule) {
        setDoctorSchedule(response.data.schedule);
      }
      if (response.data.message) {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux:', error);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des créneaux');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Prendre rendez-vous avec Dr. {doctor.prenom} {doctor.nom}
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
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={minDate}
                  maxDate={maxDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            {doctorSchedule && (
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    Horaires: {format(parseISO(doctorSchedule.heure_debut), 'HH:mm')} - {format(parseISO(doctorSchedule.heure_fin), 'HH:mm')}
                  </Typography>
                  <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AccessTimeIcon />}
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      {`${doctorSchedule.intervalle_minutes} min par consultation`}
                    </Button>
                    {doctorSchedule.a_pause_dejeuner && (
                      <Button
                        variant="outlined"
                        startIcon={<RestaurantIcon />}
                        size="small"
                        sx={{ mb: 1 }}
                      >
                        {`Pause déjeuner: ${format(parseISO(doctorSchedule.heure_debut_pause), 'HH:mm')} - ${format(parseISO(doctorSchedule.heure_fin_pause), 'HH:mm')}`}
                      </Button>
                    )}
                  </ButtonGroup>
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
                <Typography variant="h6" gutterBottom>
                  Créneaux disponibles
                </Typography>
                {loading ? (
                  <Typography>Chargement des créneaux...</Typography>
                ) : message ? (
                  <Alert severity="info">{message}</Alert>
                ) : availableSlots.length === 0 ? (
                  <Alert severity="info">Aucun créneau disponible pour cette date</Alert>
                ) : (
                  <Box>
                    {groupedSlots.morning.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                          Matin
                        </Typography>
                        <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
                          {groupedSlots.morning.map((slot) => (
                            <Button
                              key={slot.debut}
                              onClick={() => setSelectedSlot(slot)}
                              variant={selectedSlot?.debut === slot.debut ? "contained" : "outlined"}
                              sx={{ mb: 1 }}
                            >
                              {format(parseISO(slot.debut), 'HH:mm')}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </Box>
                    )}

                    {groupedSlots.afternoon.length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                          Après-midi
                        </Typography>
                        <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
                          {groupedSlots.afternoon.map((slot) => (
                            <Button
                              key={slot.debut}
                              onClick={() => setSelectedSlot(slot)}
                              variant={selectedSlot?.debut === slot.debut ? "contained" : "outlined"}
                              sx={{ mb: 1 }}
                            >
                              {format(parseISO(slot.debut), 'HH:mm')}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleBookAppointment}
          variant="contained"
          disabled={loading || !selectedSlot || !motif}
        >
          Confirmer le rendez-vous
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentBooking;