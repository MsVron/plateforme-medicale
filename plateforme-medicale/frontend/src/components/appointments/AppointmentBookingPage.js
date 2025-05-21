import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  styled
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, parseISO } from 'date-fns';
import fr from 'date-fns/locale/fr';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HorizontalTimeSlider from './HorizontalTimeSlider';
import { formatDate, formatTime, formatDateTime } from '../../utils/dateUtils';
import './HorizontalTimeSlider.css';

// Styled components for time slots
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const AppointmentBookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [motif, setMotif] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState({
    hasSameDoctorAppointment: false,
    hasSameSpecialtyAppointment: false,
    sameDoctorAppointment: null,
    sameSpecialtyAppointment: null
  });
  const [appointmentsChecked, setAppointmentsChecked] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token && !!user);
  }, []);

  // Fetch doctor information
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setDoctorLoading(true);
        
        // Always try the public endpoint first
        const response = await axios.get(`/medecins/public/${doctorId}`);
        
        if (response.data) {
          setDoctor(response.data);
        } else {
          throw new Error('No doctor data returned');
        }
      } catch (error) {
        setError("Médecin non trouvé. Veuillez vérifier l'URL ou retourner à la page de recherche.");
      } finally {
        setDoctorLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  // Check for existing appointments when doctor data is loaded and user is authenticated
  useEffect(() => {
    const checkExistingAppointments = async () => {
      if (!doctor || !isAuthenticated) return;
      
      try {
        const response = await axios.get('/appointments/check-patient-appointments', {
          params: {
            medecin_id: doctor.id
          }
        });
        
        setExistingAppointments(response.data);
        setAppointmentsChecked(true);
      } catch (error) {
        // Don't show an error to the user, just continue with the booking process
      }
    };
    
    checkExistingAppointments();
  }, [doctor, isAuthenticated]);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate || !doctor) return;
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // The token will be added by axios interceptors automatically
      const response = await axios.get(`/appointments/formatted-slots`, {
        params: {
          medecin_id: doctor.id,
          date: formattedDate
        }
      });
      
      if (response.data.slots && Array.isArray(response.data.slots)) {
        setAvailableSlots(response.data.slots);
        if (response.data.slots.length === 0) {
          setMessage('Aucun créneau disponible pour cette date');
        }
      } else {
        setError('Format de données invalide pour les créneaux');
      }

      if (response.data.schedule) {
        setDoctorSchedule(response.data.schedule);
      }
      
      if (response.data.message) {
        setMessage(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Veuillez vous connecter pour accéder à cette fonctionnalité');
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la récupération des créneaux');
      }
    } finally {
      setLoading(false);
    }
  }, [doctor, selectedDate]);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, fetchAvailableSlots, doctor]);

  const handleBookAppointment = async () => {
    try {
      if (!selectedSlot || !motif) {
        setError('Veuillez sélectionner un créneau et indiquer le motif de la consultation');
        return;
      }

      setLoading(true);
      setError('');

      // The token will be added by axios interceptors automatically
      const response = await axios.post('/appointments', {
        medecin_id: doctor.id,
        date_heure_debut: selectedSlot.debut,
        date_heure_fin: selectedSlot.fin,
        motif,
        mode: 'présentiel',
        notes_patient: notes
      });
      
      // Show success message
      setMessage('Rendez-vous pris avec succès');
      
      // Return to appointments page
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);
      
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Veuillez vous connecter pour prendre rendez-vous');
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la prise de rendez-vous');
      }
    } finally {
      setLoading(false);
    }
  };

  // Date constraints
  const minDate = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), 90);

  // Convert the availableSlots to the format expected by the HorizontalTimeSlider
  const formattedAvailableSlots = availableSlots.map(slot => ({
    debut: slot.debut,
    fin: slot.fin,
    time: slot.time || formatTime(slot.debut),
    slot: slot.slot
  }));

  if (doctorLoading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!doctor && !doctorLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Médecin non trouvé. Veuillez vérifier l'URL ou retourner à la page de recherche.
          </Alert>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/patient/search')}
          >
            Retour à la recherche
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Accueil
          </Link>
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/patient/search');
            }}
          >
            Recherche
          </Link>
          <Typography color="text.primary">Prise de rendez-vous</Typography>
        </Breadcrumbs>

        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventAvailableIcon color="primary" fontSize="large" />
          Prise de rendez-vous
        </Typography>

        {!isAuthenticated && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate('/login', { state: { returnUrl: window.location.pathname } })}
              >
                Se connecter
              </Button>
            }
          >
            Vous devez être connecté pour prendre rendez-vous avec ce médecin.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {message && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}
        
        {isAuthenticated && appointmentsChecked && existingAppointments.hasSameDoctorAppointment && (
          <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningAmberIcon />}>
            Vous avez déjà un rendez-vous avec {doctor && `Dr. ${doctor.prenom} ${doctor.nom}`} le {' '}
            {formatDateTime(existingAppointments.sameDoctorAppointment.date_heure_debut)}.
          </Alert>
        )}
        
        {isAuthenticated && appointmentsChecked && existingAppointments.hasSameSpecialtyAppointment && (
          <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningAmberIcon />}>
            Vous avez déjà un rendez-vous avec {existingAppointments.sameSpecialtyAppointment.medecin_nom} 
            ({existingAppointments.sameSpecialtyAppointment.specialite}) le{' '}
            {formatDateTime(existingAppointments.sameSpecialtyAppointment.date_heure_debut)}.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations du médecin
                </Typography>
                {doctor && (
                  <>
                    <Typography variant="body1">
                      <strong>Dr. {doctor.prenom} {doctor.nom}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {doctor.specialite}
                    </Typography>
                    {doctor.adresse && (
                      <Typography variant="body2">
                        {doctor.adresse}
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Paper sx={{ p: 2, mb: 3 }}>
              <SectionTitle variant="h6">
                <AccessTimeIcon color="primary" />
                Date du rendez-vous
              </SectionTitle>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Sélectionnez une date"
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
            </Paper>
            
            {selectedDate && doctorSchedule && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <SectionTitle variant="h6">
                  <ScheduleIcon color="primary" />
                  Horaires du médecin
                </SectionTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Horaires:</strong> {formatTime(doctorSchedule.heure_debut)} - {formatTime(doctorSchedule.heure_fin)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Durée de consultation:</strong> {doctorSchedule.intervalle_minutes} minutes
                  </Typography>
                  {doctorSchedule.a_pause_dejeuner && (
                    <Typography variant="body2">
                      <strong>Pause déjeuner:</strong> {formatTime(doctorSchedule.heure_debut_pause)} - {formatTime(doctorSchedule.heure_fin_pause)}
                    </Typography>
                  )}
                </Box>
              </Paper>
            )}
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <SectionTitle variant="h6">
                <EventAvailableIcon color="primary" />
                Détails de la consultation
              </SectionTitle>
              
              <Grid container spacing={2}>
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
                    label="Notes additionnelles (facultatif)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    rows={2}
                    helperText="Informations supplémentaires pour le médecin"
                  />
                </Grid>
              </Grid>
            </Paper>
            
            {selectedDate && (
              <Paper sx={{ p: 3 }}>
                <SectionTitle variant="h6">
                  <AccessTimeIcon color="primary" />
                  Créneaux disponibles
                </SectionTitle>
                
                {loading ? (
                  <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress />
                  </Box>
                ) : message && availableSlots.length === 0 ? (
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
                    
                    {selectedSlot && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        Créneau sélectionné: {selectedSlot.time} le {selectedDate ? formatDate(selectedDate) : ''}
                      </Alert>
                    )}
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                      >
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
                    </Box>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AppointmentBookingPage; 