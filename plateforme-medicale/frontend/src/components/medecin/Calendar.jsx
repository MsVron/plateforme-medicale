import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  Today as TodayIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format, addDays, startOfWeek, addWeeks, subWeeks, parseISO, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

const Calendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, availabilitiesRes, absencesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/medecin/appointments', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:5000/api/medecin/disponibilites', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:5000/api/medecin/absences', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        
        setAppointments(appointmentsRes.data.appointments || []);
        setAvailabilities(availabilitiesRes.data.availabilities || []);
        setAbsences(absencesRes.data.absences || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Erreur lors de la récupération des données du calendrier');
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentWeek]);

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToToday = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const getDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    return days;
  };

  const getAppointmentsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(appointment => {
      const appointmentDate = format(parseISO(appointment.date_heure), 'yyyy-MM-dd');
      return appointmentDate === dateStr;
    });
  };

  const isAbsent = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return absences.some(absence => {
      const startDate = format(parseISO(absence.date_debut), 'yyyy-MM-dd');
      const endDate = format(parseISO(absence.date_fin), 'yyyy-MM-dd');
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const getAvailabilityForDay = (date) => {
    const dayOfWeek = format(date, 'EEEE', { locale: fr });
    return availabilities.filter(availability => 
      availability.jour_semaine.toLowerCase() === dayOfWeek.toLowerCase()
    );
  };

  const renderAppointment = (appointment) => {
    const time = format(parseISO(appointment.date_heure), 'HH:mm');
    return (
      <Paper 
        key={appointment.id}
        sx={{ 
          p: 1, 
          mb: 1, 
          bgcolor: appointment.status === 'confirmed' ? '#e3f2fd' : 
                  appointment.status === 'completed' ? '#e8f5e9' : 
                  appointment.status === 'cancelled' ? '#ffebee' : '#fff3e0'
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {time} - {appointment.patient?.prenom} {appointment.patient?.nom}
        </Typography>
        <Typography variant="caption" display="block">
          {appointment.motif || 'Consultation'}
        </Typography>
      </Paper>
    );
  };

  const renderDay = (date) => {
    const dayAppointments = getAppointmentsForDay(date);
    const dayAvailabilities = getAvailabilityForDay(date);
    const absent = isAbsent(date);
    
    return (
      <Grid item xs key={date.toString()}>
        <Paper 
          sx={{ 
            p: 2, 
            height: '100%', 
            bgcolor: isToday(date) ? '#f5f5f5' : 'white',
            borderTop: isToday(date) ? '3px solid #2196f3' : 'none'
          }}
        >
          <Typography 
            variant="subtitle1" 
            fontWeight={isToday(date) ? 'bold' : 'normal'}
            sx={{ mb: 1 }}
          >
            {format(date, 'EEEE dd', { locale: fr })}
          </Typography>
          
          {absent ? (
            <Alert severity="warning" sx={{ mb: 1 }}>Absence</Alert>
          ) : dayAvailabilities.length === 0 ? (
            <Alert severity="info" sx={{ mb: 1 }}>Non disponible</Alert>
          ) : (
            dayAvailabilities.map(availability => (
              <Typography key={availability.id} variant="caption" display="block" sx={{ mb: 1 }}>
                Disponible: {availability.heure_debut} - {availability.heure_fin}
              </Typography>
            ))
          )}
          
          {dayAppointments.map(renderAppointment)}
          
          {dayAppointments.length === 0 && !absent && dayAvailabilities.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Aucun rendez-vous
            </Typography>
          )}
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <CalendarIcon sx={{ mr: 1 }} />
        <Typography variant="h4">
          Calendrier
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          startIcon={<TodayIcon />} 
          variant="outlined" 
          onClick={goToToday}
          sx={{ mr: 1 }}
        >
          Aujourd'hui
        </Button>
        <Button 
          startIcon={<NavigateBeforeIcon />} 
          variant="outlined" 
          onClick={prevWeek}
          sx={{ mr: 1 }}
        >
          Semaine précédente
        </Button>
        <Button 
          endIcon={<NavigateNextIcon />} 
          variant="outlined" 
          onClick={nextWeek}
        >
          Semaine suivante
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {getDaysOfWeek().map(renderDay)}
        </Grid>
      )}
    </Box>
  );
};

export default Calendar; 