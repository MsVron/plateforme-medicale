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
        
        console.log('=== CALENDAR DATA ===');
        console.log('Appointments:', appointmentsRes.data);
        console.log('Total appointments fetched:', appointmentsRes.data.appointments?.length || 0);
        
        // Debug: Show appointment dates
        if (appointmentsRes.data.appointments) {
          console.log('Appointment dates:');
          appointmentsRes.data.appointments.forEach(apt => {
            console.log(`  ${apt.date_heure_debut} - ${apt.patient_prenom} ${apt.patient_nom} - ${apt.statut}`);
          });
        }
        
        console.log('Availabilities:', availabilitiesRes.data);
        console.log('Absences:', absencesRes.data);
        console.log('=====================');
        
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
    console.log(`Getting appointments for ${dateStr}`);
    
    const filteredAppointments = appointments.filter(appointment => {
      try {
        if (!appointment.date_heure_debut) return false;
        const appointmentDate = format(parseISO(appointment.date_heure_debut), 'yyyy-MM-dd');
        const matches = appointmentDate === dateStr;
        
        if (matches) {
          console.log(`Found appointment for ${dateStr}:`, appointment);
        }
        
        return matches;
      } catch (error) {
        console.error('Error parsing appointment date:', appointment.date_heure_debut, error);
        return false;
      }
    });
    
    console.log(`Total appointments for ${dateStr}:`, filteredAppointments.length);
    return filteredAppointments;
  };

  const isAbsent = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return absences.some(absence => {
      try {
        if (!absence.date_debut || !absence.date_fin) return false;
        const startDate = format(parseISO(absence.date_debut), 'yyyy-MM-dd');
        const endDate = format(parseISO(absence.date_fin), 'yyyy-MM-dd');
        return dateStr >= startDate && dateStr <= endDate;
      } catch (error) {
        console.error('Error parsing absence dates:', absence, error);
        return false;
      }
    });
  };

  const getAvailabilityForDay = (date) => {
    const dayOfWeek = format(date, 'EEEE', { locale: fr });
    return availabilities.filter(availability => 
      availability.jour_semaine.toLowerCase() === dayOfWeek.toLowerCase()
    );
  };

  const renderAppointment = (appointment) => {
    try {
      if (!appointment.date_heure_debut) return null;
      const time = format(parseISO(appointment.date_heure_debut), 'HH:mm');
      return (
        <Paper 
          key={appointment.id}
          sx={{ 
            p: 1, 
            mb: 1, 
            bgcolor: appointment.statut === 'confirmé' ? '#e3f2fd' : 
                    appointment.statut === 'terminé' ? '#e8f5e9' : 
                    appointment.statut === 'annulé' ? '#ffebee' : '#fff3e0'
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {time} - {appointment.patient_prenom} {appointment.patient_nom}
          </Typography>
          <Typography variant="caption" display="block">
            {appointment.motif || 'Consultation'}
          </Typography>
        </Paper>
      );
    } catch (error) {
      console.error('Error rendering appointment:', appointment, error);
      return null;
    }
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