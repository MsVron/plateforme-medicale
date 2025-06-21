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
  styled,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  format, 
  addDays, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWeekend,
  getDay,
  subMonths,
  addMonths,
  getDate,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';
import fr from 'date-fns/locale/fr';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HomeIcon from '@mui/icons-material/Home';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { formatDate, formatTime, formatDateTime } from '../../utils/dateUtils';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(0.5)
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 400,
  fontSize: '1rem',
  marginBottom: theme.spacing(1.5)
}));

const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '70px',
  borderRadius: '8px',
  margin: '4px',
  ...(selected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

const CalendarDayCell = styled(TableCell)(({ theme, isSelected, isCurrentMonth, isDisabled, isWeekend, isToday }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  cursor: isDisabled ? 'default' : 'pointer',
  color: isDisabled 
    ? theme.palette.text.disabled 
    : isWeekend && !isSelected
      ? theme.palette.text.secondary
      : theme.palette.text.primary,
  backgroundColor: isSelected 
    ? theme.palette.primary.main 
    : isToday && !isSelected
      ? theme.palette.grey[200]
      : 'transparent',
  borderRadius: isSelected ? '50%' : 0,
  width: '32px',
  height: '32px',
  position: 'relative',
  '&:hover': {
    backgroundColor: isDisabled 
      ? 'transparent' 
      : isSelected 
        ? theme.palette.primary.main 
        : theme.palette.action.hover,
  },
  '& > div': {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontWeight: isSelected || isToday ? 600 : 400,
    color: isSelected ? theme.palette.primary.contrastText : 'inherit',
    fontSize: '0.85rem',
  }
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const NavButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.5),
}));

const DayLabel = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontWeight: 500,
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

// Week day headers in French
const weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const AppointmentBookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
      setMessage('Rendez-vous pris avec succès ! Un email de confirmation vous a été envoyé avec les détails et les liens pour confirmer ou annuler votre rendez-vous.');
      
      // Return to appointments page
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 3000);
      
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

  // Update date constraints - allow selecting today
  const minDate = new Date(); // Start from today
  const maxDate = addDays(new Date(), 90);

  // Convert the availableSlots to the format expected by the time slot buttons
  const formattedAvailableSlots = availableSlots.map(slot => ({
    debut: slot.debut,
    fin: slot.fin,
    time: slot.time || formatTime(slot.debut),
    slot: slot.slot
  }));

  // Calendar navigation functions
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Update the generateCalendar function to use a wider container
  const generateCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    // Add week day headers
    const dayHeaders = weekDays.map((weekDay, index) => (
      <TableCell key={`header-${index}`} align="center" sx={{ padding: '4px' }}>
        <DayLabel>{weekDay}</DayLabel>
      </TableCell>
    ));

    rows.push(
      <TableRow key="header">
        {dayHeaders}
      </TableRow>
    );

    // Create calendar rows
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonthDay = isSameMonth(day, monthStart);
        const isSelectedDay = isSameDay(day, selectedDate);
        
        // Only disable past days and weekends
        const isPastDay = day < new Date().setHours(0, 0, 0, 0);
        const isDisabledDay = isPastDay || day > maxDate || isWeekend(day);
        
        const isTodayDay = isToday(day);
        
        days.push(
          <CalendarDayCell 
            key={day.toString()} 
            isSelected={isSelectedDay}
            isCurrentMonth={isCurrentMonthDay}
            isDisabled={isDisabledDay}
            isWeekend={isWeekend(day)}
            isToday={isTodayDay}
            onClick={() => {
              if (!isDisabledDay) {
                setSelectedDate(cloneDay);
                setSelectedSlot(null);
              }
            }}
          >
            <div>
              {getDate(day)}
            </div>
          </CalendarDayCell>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <TableRow key={day.toString()} sx={{ height: '32px' }}>
          {days}
        </TableRow>
      );
      days = [];
    }

    return (
      <TableContainer component={Paper} sx={{ boxShadow: 'none', mb: 3, width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            {rows}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Update the renderTimeSlots function for wider layout
  const renderTimeSlots = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" my={3} minHeight="60px" width="100%">
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (formattedAvailableSlots.length === 0) {
      return (
        <Alert severity="info" sx={{ my: 2, minHeight: "60px", width: "100%" }}>
          Aucun créneau disponible pour cette date
        </Alert>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, minHeight: "60px", width: "100%" }}>
        {formattedAvailableSlots.map((slot, index) => (
          <TimeSlotButton
            key={index}
            variant={selectedSlot && selectedSlot.debut === slot.debut ? "contained" : "outlined"}
            color="primary"
            selected={selectedSlot && selectedSlot.debut === slot.debut}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot.time}
          </TimeSlotButton>
        ))}
      </Box>
    );
  };

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

        <PageTitle>
          Réserver un rendez-vous
        </PageTitle>

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

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            {/* Informations sur le médecin */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Informations sur le médecin
              </Typography>
              {doctor && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={doctor.photo || ''} 
                      alt={`Dr. ${doctor.prenom} ${doctor.nom}`}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      {doctor.prenom?.[0]}{doctor.nom?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Dr. {doctor.prenom} {doctor.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialite}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <InfoLabel>Spécialité</InfoLabel>
                    <InfoValue>{doctor.specialite}</InfoValue>
                    
                    <InfoLabel>Localisation</InfoLabel>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                      <LocationOnIcon color="action" sx={{ mt: 0.5, mr: 1, fontSize: '1.2rem' }} />
                      <InfoValue>{doctor.adresse || 'Clinique Médicale de Paris'}</InfoValue>
                    </Box>
                    
                    <InfoLabel>Expérience</InfoLabel>
                    <InfoValue>{doctor.experience || '15 ans'}</InfoValue>
                  </Box>

                  {doctorSchedule && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ mt: 2 }}>
                        <InfoLabel>Horaires du médecin</InfoLabel>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Horaires:</strong> {formatTime(doctorSchedule.heure_debut)} - {formatTime(doctorSchedule.heure_fin)}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Durée de consultation:</strong> {doctorSchedule.intervalle_minutes} minutes
                        </Typography>
                        {doctorSchedule.a_pause_dejeuner && (
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Pause déjeuner:</strong> {formatTime(doctorSchedule.heure_debut_pause)} - {formatTime(doctorSchedule.heure_fin_pause)}
                          </Typography>
                        )}
                      </Box>
                    </>
                  )}
                </>
              )}
            </Grid>

            {/* Sélection de la date */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Sélection de la date et de l'heure
              </Typography>
              
              {/* This container maintains consistent height and now wider */}
              <Box sx={{ width: '100%', maxWidth: '500px', margin: '0 auto', minHeight: '300px' }}>
                <CalendarHeader>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                  </Typography>
                  <Box>
                    <NavButton onClick={prevMonth}>
                      <ArrowBackIosNewIcon fontSize="small" sx={{ fontSize: '0.85rem' }} />
                    </NavButton>
                    <NavButton onClick={nextMonth}>
                      <ArrowForwardIosIcon fontSize="small" sx={{ fontSize: '0.85rem' }} />
                    </NavButton>
                  </Box>
                </CalendarHeader>
                
                {generateCalendar()}
              
                {/* Time slots section with fixed height and proper width */}
                <Box sx={{ minHeight: '100px', width: '100%' }}>
                  {selectedDate && (
                    <>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Créneaux disponibles
                      </Typography>
                      {renderTimeSlots()}
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Détails du rendez-vous
          </Typography>
          
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
                label="Notes supplémentaires"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={2}
                helperText="Informations supplémentaires pour le médecin"
              />
            </Grid>
          </Grid>
          
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
              color="primary"
              disabled={loading || !selectedSlot || !motif}
              endIcon={loading && <CircularProgress size={20} />}
              sx={{ px: 4, py: 1 }}
            >
              Confirmer le rendez-vous
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentBookingPage; 