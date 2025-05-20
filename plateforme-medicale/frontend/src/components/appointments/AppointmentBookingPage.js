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

const DebugSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderLeft: `4px solid ${theme.palette.info.main}`,
  '& pre': {
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    padding: theme.spacing(1),
    backgroundColor: '#e0e0e0',
    borderRadius: theme.spacing(0.5),
    fontSize: '0.85rem'
  }
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
  const [debugInfo, setDebugInfo] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        
        console.log('DEBUG: Fetching doctor with ID:', doctorId);
        
        // Always try the public endpoint first
        const response = await axios.get(`/medecins/public/${doctorId}`);
        
        if (response.data) {
          console.log('DEBUG: Doctor data retrieved successfully:', response.data);
          setDoctor(response.data);
          setDebugInfo(prev => ({ ...prev, doctor: response.data }));
        } else {
          throw new Error('No doctor data returned');
        }
      } catch (error) {
        console.error('DEBUG: Error fetching doctor:', error);
        console.error('DEBUG: Error response:', error.response);
        setError("Médecin non trouvé. Veuillez vérifier l'URL ou retourner à la page de recherche.");
        setDebugInfo(prev => ({ ...prev, doctorError: error.response?.data || error.message }));
      } finally {
        setDoctorLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate || !doctor) return;
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      console.log('DEBUG: Fetching slots for date:', formattedDate);
      console.log('DEBUG: Doctor ID:', doctor.id);
      
      setDebugInfo(prev => ({ 
        ...prev, 
        fetchRequest: { 
          doctorId: doctor.id, 
          date: formattedDate 
        } 
      }));
      
      // The token will be added by axios interceptors automatically
      const response = await axios.get(`/appointments/formatted-slots`, {
        params: {
          medecin_id: doctor.id,
          date: formattedDate
        }
      });

      console.log('DEBUG: API Response:', JSON.stringify(response.data, null, 2));
      setDebugInfo(prev => ({ ...prev, apiResponse: response.data }));
      
      if (response.data.slots && Array.isArray(response.data.slots)) {
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
      
      if (error.response?.status === 401) {
        setError('Veuillez vous connecter pour accéder à cette fonctionnalité');
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la récupération des créneaux');
      }
      
      setDebugInfo(prev => ({ ...prev, fetchError: error.response?.data || error.message }));
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

      console.log('DEBUG: Booking appointment with slot:', selectedSlot);
      setDebugInfo(prev => ({ ...prev, bookingData: {
        doctor_id: doctor.id,
        selectedSlot,
        motif,
        notes
      }}));

      // The token will be added by axios interceptors automatically
      const response = await axios.post('/appointments', {
        medecin_id: doctor.id,
        date_heure_debut: selectedSlot.debut,
        date_heure_fin: selectedSlot.fin,
        motif,
        mode: 'présentiel',
        notes_patient: notes
      });

      setDebugInfo(prev => ({ ...prev, bookingResponse: response.data }));
      
      // Show success message
      setMessage('Rendez-vous pris avec succès');
      
      // Return to appointments page
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);
      
    } catch (error) {
      console.error('DEBUG: Error booking appointment:', error);
      console.error('DEBUG: Error response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Veuillez vous connecter pour prendre rendez-vous');
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la prise de rendez-vous');
      }
      
      setDebugInfo(prev => ({ ...prev, bookingError: error.response?.data || error.message }));
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

  // Debug display of formatted slots
  useEffect(() => {
    console.log('DEBUG: Formatted slots for display:', formattedAvailableSlots);
    setDebugInfo(prev => ({ ...prev, formattedSlots: formattedAvailableSlots }));
  }, [formattedAvailableSlots]);

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
        
        {/* Debug section - only shown in development */}
        {process.env.NODE_ENV === 'development' && (
          <DebugSection>
            <Typography variant="h6" gutterBottom>Débogage</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Information de débogage pour le développement uniquement
            </Typography>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </DebugSection>
        )}
      </Box>
    </Container>
  );
};

export default AppointmentBookingPage; 