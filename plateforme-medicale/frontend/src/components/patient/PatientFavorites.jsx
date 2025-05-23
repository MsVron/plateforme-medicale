import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientFavorites = () => {
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteDoctors();
  }, []);

  const fetchFavoriteDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/patient/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoriteDoctors(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins favoris:', error);
      setError('Impossible de récupérer vos médecins favoris. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patient/favorites/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setFavoriteDoctors(favoriteDoctors.filter(doctor => doctor.id !== doctorId));
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      setError('Impossible de supprimer ce médecin de vos favoris. Veuillez réessayer.');
    }
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/book-appointment/${doctorId}`);
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Cardiologie': 'error',
      'Dermatologie': 'warning',
      'Neurologie': 'info',
      'Pédiatrie': 'success',
      'Psychiatrie': 'secondary',
      'Orthopédie': 'primary',
      'Gynécologie': 'error',
      'Ophtalmologie': 'info',
      'ORL': 'warning',
      'Médecine générale': 'default'
    };
    return colors[specialty] || 'default';
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FavoriteIcon color="primary" />
          Mes médecins favoris
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Accédez rapidement à vos médecins préférés et prenez rendez-vous
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {favoriteDoctors.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FavoriteBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun médecin favori
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Vous n'avez pas encore ajouté de médecins à vos favoris.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/patient/search-doctors')}>
            Rechercher un médecin
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {favoriteDoctors.map((doctor) => (
            <Grid item xs={12} md={6} lg={4} key={doctor.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        bgcolor: 'primary.main'
                      }}
                    >
                      {doctor.prenom?.[0]}{doctor.nom?.[0]}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2">
                        Dr. {doctor.prenom} {doctor.nom}
                      </Typography>
                      <Chip 
                        label={doctor.specialite}
                        color={getSpecialtyColor(doctor.specialite)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    <Tooltip title="Retirer des favoris">
                      <IconButton 
                        color="error"
                        onClick={() => handleRemoveFromFavorites(doctor.id)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {doctor.institution_nom && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.institution_nom}
                      </Typography>
                    </Box>
                  )}

                  {doctor.ville && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.ville}
                      </Typography>
                    </Box>
                  )}

                  {doctor.telephone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.telephone}
                      </Typography>
                    </Box>
                  )}

                  {doctor.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.email}
                      </Typography>
                    </Box>
                  )}

                  {doctor.experience_annees && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Expérience:</strong> {doctor.experience_annees} ans
                    </Typography>
                  )}

                  {doctor.tarif_consultation && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tarif:</strong> {doctor.tarif_consultation} DH
                    </Typography>
                  )}

                  {doctor.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <StarIcon fontSize="small" sx={{ mr: 0.5, color: 'warning.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.rating}/5 ({doctor.reviews_count || 0} avis)
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    startIcon={<CalendarIcon />}
                    onClick={() => handleBookAppointment(doctor.id)}
                  >
                    Prendre rendez-vous
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PatientFavorites; 