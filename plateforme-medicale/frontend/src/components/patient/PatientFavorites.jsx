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
    <Container maxWidth="xl" sx={{ width: '100% !important', minWidth: '800px !important' }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
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
            <Grid item xs={12} md={6} key={doctor.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                minWidth: '400px !important',
                width: '100% !important',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3, minWidth: '350px !important' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, width: '100% !important', minWidth: '320px !important' }}>
                    <Avatar
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        bgcolor: 'primary.main',
                        flexShrink: 0
                      }}
                    >
                      {doctor.prenom?.[0]}{doctor.nom?.[0]}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: '200px !important' }}>
                      <Typography variant="h6" component="h2" sx={{ fontSize: '1.1rem !important', fontWeight: 'bold' }}>
                        Dr. {doctor.prenom} {doctor.nom}
                      </Typography>
                      <Chip 
                        label={doctor.specialite}
                        color={getSpecialtyColor(doctor.specialite)}
                        size="small"
                        sx={{ mt: 0.5, fontSize: '0.8rem !important' }}
                      />
                    </Box>
                    <Tooltip title="Retirer des favoris">
                      <IconButton 
                        color="error"
                        onClick={() => handleRemoveFromFavorites(doctor.id)}
                        sx={{ flexShrink: 0 }}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {doctor.institution_nom && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100% !important' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontSize: '0.9rem !important' }}>
                        {doctor.institution_nom}
                      </Typography>
                    </Box>
                  )}

                  {doctor.ville && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100% !important' }}>
                      <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontSize: '0.9rem !important' }}>
                        {doctor.ville}
                      </Typography>
                    </Box>
                  )}

                  {doctor.telephone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100% !important' }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontSize: '0.9rem !important' }}>
                        {doctor.telephone}
                      </Typography>
                    </Box>
                  )}

                  {doctor.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100% !important' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontSize: '0.9rem !important', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        {doctor.email}
                      </Typography>
                    </Box>
                  )}

                  {doctor.experience_annees && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.9rem !important' }}>
                      <strong>Expérience:</strong> {doctor.experience_annees} ans
                    </Typography>
                  )}

                  {doctor.tarif_consultation && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem !important' }}>
                      <strong>Tarif:</strong> {doctor.tarif_consultation} DH
                    </Typography>
                  )}

                  {doctor.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, width: '100% !important' }}>
                      <StarIcon fontSize="small" sx={{ mr: 0.5, color: 'warning.main', flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1, fontSize: '0.9rem !important' }}>
                        {doctor.rating}/5 ({doctor.reviews_count || 0} avis)
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, width: '100% !important' }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    startIcon={<CalendarIcon />}
                    onClick={() => handleBookAppointment(doctor.id)}
                    sx={{ 
                      minWidth: '200px !important',
                      fontSize: '0.9rem !important',
                      fontWeight: 'bold'
                    }}
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