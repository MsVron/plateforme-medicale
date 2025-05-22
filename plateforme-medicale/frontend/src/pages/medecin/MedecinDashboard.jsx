import React, { useState, useEffect } from 'react';import { Container, Typography, Grid, Paper, Box, CircularProgress, Alert, Button, Fab } from '@mui/material';import { PersonAdd as PersonAddIcon } from '@mui/icons-material';import { useNavigate } from 'react-router-dom';import axios from 'axios';import UpcomingAppointments from '../../components/medecin/UpcomingAppointments';

const MedecinDashboard = () => {  const navigate = useNavigate();  const [loading, setLoading] = useState(true);  const [error, setError] = useState(null);  const [medecinData, setMedecinData] = useState(null);

  useEffect(() => {
    fetchMedecinData();
  }, []);

  const fetchMedecinData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/medecin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedecinData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching doctor data:', err);
      setError('Impossible de récupérer les données du médecin');
      setLoading(false);
    }
  };

    const handleWalkInClick = () => {    navigate('/medecin/walk-in-patient');  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bienvenue, Dr. {medecinData?.prenom} {medecinData?.nom}
        </Typography>
        
                <Button          variant="contained"          startIcon={<PersonAddIcon />}          onClick={handleWalkInClick}          sx={{            bgcolor: 'secondary.main',            '&:hover': {              bgcolor: 'secondary.dark',            }          }}        >          Patient sur place        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Rendez-vous aujourd'hui
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {medecinData?.stats?.appointmentsToday || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Patients
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {medecinData?.stats?.totalPatients || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Consultations ce mois
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {medecinData?.stats?.consultationsThisMonth || 0}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Upcoming Appointments */}
        <Grid item xs={12}>
          <UpcomingAppointments />
        </Grid>
      </Grid>

            {/* Floating Action Button for mobile */}      <Fab        color="secondary"        aria-label="add walk-in patient"        onClick={handleWalkInClick}        sx={{          position: 'fixed',          bottom: 16,          right: 16,          display: { xs: 'flex', md: 'none' } // Only show on mobile        }}      >        <PersonAddIcon />      </Fab>
    </Container>
  );
};

export default MedecinDashboard; 