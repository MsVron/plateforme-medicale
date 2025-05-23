import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import { formatDateTime, formatDate, formatTime } from '../../utils/dateUtils';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/patient/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const allAppointments = response.data;
      const now = new Date();
      
      // Separate upcoming and past appointments
      const upcoming = allAppointments.filter(appointment => 
        new Date(appointment.date_heure_debut) >= now && 
        !['annulé', 'terminé'].includes(appointment.statut?.toLowerCase())
      ).sort((a, b) => new Date(a.date_heure_debut) - new Date(b.date_heure_debut));
      
      const past = allAppointments.filter(appointment => 
        new Date(appointment.date_heure_debut) < now || 
        ['annulé', 'terminé'].includes(appointment.statut?.toLowerCase())
      ).sort((a, b) => new Date(b.date_heure_debut) - new Date(a.date_heure_debut));
      
      setAppointments(allAppointments);
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      setError('Impossible de récupérer vos rendez-vous. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/patient/appointments/${appointmentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state - move cancelled appointment from upcoming to past
      const cancelledAppointment = upcomingAppointments.find(app => app.id === appointmentId);
      if (cancelledAppointment) {
        const updatedCancelledAppointment = { ...cancelledAppointment, statut: 'annulé' };
        
        setUpcomingAppointments(upcomingAppointments.filter(app => app.id !== appointmentId));
        setPastAppointments([updatedCancelledAppointment, ...pastAppointments]);
        setAppointments(appointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, statut: 'annulé' } 
            : appointment
        ));
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      setError('Impossible d\'annuler le rendez-vous. Veuillez réessayer.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'planifié':
        return 'info';
      case 'confirmé':
        return 'success';
      case 'en cours':
        return 'warning';
      case 'terminé':
        return 'default';
      case 'annulé':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'planifié':
        return 'Planifié';
      case 'confirmé':
        return 'Confirmé';
      case 'en cours':
        return 'En cours';
      case 'terminé':
        return 'Terminé';
      case 'annulé':
        return 'Annulé';
      default:
        return status || 'Inconnu';
    }
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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          fontWeight: 'bold',
          color: 'primary.main'
        }}>
          <CalendarIcon sx={{ fontSize: 40 }} color="primary" />
          Mes rendez-vous
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', ml: 7 }}>
          Consultez et gérez vos rendez-vous médicaux
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {appointments.length === 0 ? (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: 'grey.50',
          border: '2px dashed',
          borderColor: 'grey.300'
        }}>
          <CalendarIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Aucun rendez-vous trouvé
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Vous n'avez pas encore de rendez-vous planifiés. Commencez par rechercher un médecin pour prendre votre premier rendez-vous.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<CalendarIcon />}
            href="/patient/search-doctors"
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold'
            }}
          >
            Rechercher un médecin
          </Button>
        </Paper>
      ) : (
        <>
          {/* Upcoming Appointments Section */}
          {upcomingAppointments.length > 0 && (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mt: 3, 
                mb: 3,
                p: 2,
                bgcolor: 'primary.light',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main'
              }}>
                <CalendarIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" component="h2" sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  flex: 1
                }}>
                  Rendez-vous à venir
                </Typography>
                <Chip 
                  label={`${upcomingAppointments.length} rendez-vous`}
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Grid container spacing={3}>
                {upcomingAppointments.map((appointment) => (
                  <Grid item xs={12} md={6} lg={4} key={appointment.id}>
                    <Card sx={{ 
                      height: '100%', 
                      border: '2px solid', 
                      borderColor: 'primary.light',
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Doctor Name and Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0.5 }}>
                              Dr. {appointment.medecin_prenom} {appointment.medecin_nom}
                            </Typography>
                            {appointment.specialite && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {appointment.specialite}
                              </Typography>
                            )}
                          </Box>
                          <Chip 
                            label={getStatusLabel(appointment.statut)} 
                            color={getStatusColor(appointment.statut)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>

                        {/* Date and Time Information */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {formatDate(appointment.date_heure_debut)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <TimeIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {formatTime(appointment.date_heure_debut)} - {formatTime(appointment.date_heure_fin)}
                            </Typography>
                          </Box>
                          {appointment.institution_nom && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PlaceIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {appointment.institution_nom}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Additional Information */}
                        {(appointment.motif || appointment.notes_patient) && (
                          <Box sx={{ mb: 3 }}>
                            {appointment.motif && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                  Motif:
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  bgcolor: 'info.light', 
                                  p: 1, 
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'info.main'
                                }}>
                                  {appointment.motif}
                                </Typography>
                              </Box>
                            )}

                            {appointment.notes_patient && (
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                  Notes:
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  bgcolor: 'warning.light', 
                                  p: 1, 
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'warning.main'
                                }}>
                                  {appointment.notes_patient}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                          {appointment.statut?.toLowerCase() === 'planifié' && (
                            <Tooltip title="Annuler le rendez-vous">
                              <IconButton 
                                color="error" 
                                size="medium"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                sx={{
                                  bgcolor: 'error.light',
                                  '&:hover': {
                                    bgcolor: 'error.main',
                                    color: 'white'
                                  }
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {/* Past Appointments Section */}
          {pastAppointments.length > 0 && (
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mt: 5, 
                mb: 3,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.400'
              }}>
                <CalendarIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                <Typography variant="h5" component="h2" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 'bold',
                  flex: 1
                }}>
                  Rendez-vous passés
                </Typography>
                <Chip 
                  label={`${pastAppointments.length} rendez-vous`}
                  color="default"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Grid container spacing={3}>
                {pastAppointments.map((appointment) => (
                  <Grid item xs={12} md={6} lg={4} key={appointment.id}>
                    <Card sx={{ 
                      height: '100%', 
                      opacity: 0.85,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.300'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Doctor Name and Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 0.5 }}>
                              Dr. {appointment.medecin_prenom} {appointment.medecin_nom}
                            </Typography>
                            {appointment.specialite && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {appointment.specialite}
                              </Typography>
                            )}
                          </Box>
                          <Chip 
                            label={getStatusLabel(appointment.statut)} 
                            color={getStatusColor(appointment.statut)}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>

                        {/* Date and Time Information */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                            <Typography variant="body1" color="text.secondary">
                              {formatDate(appointment.date_heure_debut)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <TimeIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                            <Typography variant="body1" color="text.secondary">
                              {formatTime(appointment.date_heure_debut)} - {formatTime(appointment.date_heure_fin)}
                            </Typography>
                          </Box>
                          {appointment.institution_nom && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PlaceIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                              <Typography variant="body1" color="text.secondary">
                                {appointment.institution_nom}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Additional Information */}
                        {(appointment.motif || appointment.notes_patient) && (
                          <Box sx={{ mb: 2 }}>
                            {appointment.motif && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 0.5 }}>
                                  Motif:
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  bgcolor: 'grey.200', 
                                  p: 1, 
                                  borderRadius: 1
                                }}>
                                  {appointment.motif}
                                </Typography>
                              </Box>
                            )}

                            {appointment.notes_patient && (
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 0.5 }}>
                                  Notes:
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  bgcolor: 'grey.200', 
                                  p: 1, 
                                  borderRadius: 1
                                }}>
                                  {appointment.notes_patient}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default PatientAppointments; 