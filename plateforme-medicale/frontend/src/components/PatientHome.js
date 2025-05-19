import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, Grid, Paper, Card, CardContent, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { formatDateTime, dateTimePickerProps } from '../utils/dateUtils';

const PatientHome = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({
    date_heure: null,
    medecin_id: '',
    duree: '',
    statut: '',
    medecin_nom: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/patient/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, p: 3, bgcolor: '#fff0f5', borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Espace Patient
        </Typography>
        <Typography variant="body1" paragraph>
          Bienvenue sur votre espace patient de la plateforme médicale.
        </Typography>
        <Typography variant="body1">
          Utilisez les options ci-dessous pour naviguer dans votre espace personnel.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box>
              <SearchIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Rechercher un médecin
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Trouvez un médecin par spécialité, ville ou nom et prenez rendez-vous facilement.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<SearchIcon />}
              onClick={() => navigate('/patient/doctor-search')}
              fullWidth
            >
              Rechercher
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box>
              <CalendarMonthIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Mes rendez-vous
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Consultez, gérez et planifiez vos rendez-vous avec vos médecins.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<CalendarMonthIcon />}
              onClick={() => navigate('/patient/appointments')}
              fullWidth
            >
              Voir mes rendez-vous
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box>
              <FavoriteIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Médecins favoris
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Accédez rapidement à vos médecins préférés et à leur disponibilité.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<FavoriteIcon />}
              onClick={() => navigate('/patient/favorites')}
              fullWidth
            >
              Voir mes favoris
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Update appointment display */}
      {appointments.map((appointment) => (
        <Card key={appointment.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              Rendez-vous avec Dr. {appointment.medecin_nom}
            </Typography>
            <Typography>
              <strong>Date et heure:</strong> {formatDateTime(appointment.date_heure_debut)}
            </Typography>
            <Typography>
              <strong>Durée:</strong> {appointment.duree} minutes
            </Typography>
            <Typography>
              <strong>Statut:</strong> {appointment.statut}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Update the appointment form */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Date et heure du rendez-vous"
          value={appointmentForm.date_heure}
          onChange={(newValue) => setAppointmentForm({ ...appointmentForm, date_heure: newValue })}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          {...dateTimePickerProps}
        />
      </LocalizationProvider>
    </Container>
  );
};

export default PatientHome;
