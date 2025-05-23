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

  const getStatusColor = (status, isPast = false) => {
    // If it's a past appointment and status is still "planifié", show as default
    if (isPast && status?.toLowerCase() === 'planifié') {
      return 'default';
    }
    
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

  const getStatusLabel = (status, isPast = false) => {
    // If it's a past appointment and status is still "planifié", show "Passé"
    if (isPast && status?.toLowerCase() === 'planifié') {
      return 'Passé';
    }
    
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
    <Container maxWidth="xl" sx={{ width: '100% !important', minWidth: '800px !important' }}>
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
                bgcolor: 'grey.100',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.400'
              }}>
                <CalendarIcon sx={{ color: 'text.primary', fontSize: 28 }} />
                <Typography variant="h5" component="h2" sx={{ 
                  color: 'text.primary', 
                  fontWeight: 'bold',
                  flex: 1
                }}>
                  Rendez-vous à venir
                </Typography>
                <Chip 
                  label={`${upcomingAppointments.length} rendez-vous`}
                  color="default"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Grid container spacing={3}>
                {upcomingAppointments.map((appointment) => (
                  <Grid item xs={12} md={6} key={appointment.id}>
                    <Card sx={{ 
                      height: '100%', 
                      border: '1px solid', 
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      minWidth: '400px !important',
                      width: '100% !important',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent sx={{ p: 3, minWidth: '350px !important' }}>
                        {/* Doctor Name and Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, width: '100% !important', minWidth: '320px !important' }}>
                          <Box sx={{ flex: 1, minWidth: '200px !important' }}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, fontSize: '1.1rem !important' }}>
                              Dr. {appointment.medecin_prenom} {appointment.medecin_nom}
                            </Typography>
                            {appointment.specialite && (
                              <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.9rem !important', color: 'text.primary', fontWeight: 'medium' }}>
                                {appointment.specialite}
                              </Typography>
                            )}
                          </Box>
                          <Chip 
                            label={getStatusLabel(appointment.statut)} 
                            color={getStatusColor(appointment.statut, false)}
                            size="small"
                            sx={{ fontWeight: 'bold', minWidth: '80px !important' }}
                          />
                        </Box>

                        {/* Date and Time Information */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, border: '1px solid', borderColor: 'grey.300', width: '100% !important' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, width: '100% !important' }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', flexShrink: 0 }} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', flex: 1, fontSize: '0.95rem !important' }}>
                              {formatDate(appointment.date_heure_debut)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, width: '100% !important' }}>
                            <TimeIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', flexShrink: 0 }} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', flex: 1, fontSize: '0.95rem !important' }}>
                              {formatTime(appointment.date_heure_debut)} - {formatTime(appointment.date_heure_fin)}
                            </Typography>
                          </Box>
                          {appointment.institution_nom && (
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100% !important' }}>
                              <PlaceIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', flexShrink: 0 }} />
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', flex: 1, fontSize: '0.95rem !important' }}>
                                {appointment.institution_nom}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Additional Information */}
                        {(appointment.motif || appointment.notes_patient) && (
                          <Box sx={{ mb: 3, width: '100% !important' }}>
                            {appointment.motif && (
                              <Box sx={{ mb: 2, width: '100% !important' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, fontSize: '0.9rem !important' }}>
                                  Motif:
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  bgcolor: 'grey.200', 
                                  p: 1.5, 
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'grey.400',
                                  color: 'text.primary',
                                  fontWeight: 'medium',
                                  width: '100% !important',
                                  fontSize: '0.85rem !important',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word'
                                }}>
                                  {appointment.motif}
                                </Typography>
                              </Box>
                            )}

                            {appointment.notes_patient && (
                              <Box sx={{ width: '100% !important' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, fontSize: '0.9rem !important' }}>
                                  Notes:
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  bgcolor: 'grey.200', 
                                  p: 1.5, 
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'grey.400',
                                  color: 'text.primary',
                                  fontWeight: 'medium',
                                  width: '100% !important',
                                  fontSize: '0.85rem !important',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word'
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
                <CalendarIcon sx={{ color: 'text.primary', fontSize: 28 }} />
                <Typography variant="h5" component="h2" sx={{ 
                  color: 'text.primary', 
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
                  <Grid item xs={12} md={6} key={appointment.id}>
                    <Card sx={{ 
                      height: '100%', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      minWidth: '400px !important',
                      width: '100% !important',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }
                    }}>
                      <CardContent sx={{ p: 3, minWidth: '350px !important' }}>
                        {/* Doctor Name and Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, width: '100% !important', minWidth: '320px !important' }}>
                          <Box sx={{ flex: 1, minWidth: '200px !important' }}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, fontSize: '1.1rem !important' }}>
                              Dr. {appointment.medecin_prenom} {appointment.medecin_nom}
                            </Typography>
                            {appointment.specialite && (
                              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary', fontWeight: 'medium', fontSize: '0.9rem !important' }}>
                                {appointment.specialite}
                              </Typography>
                            )}
                          </Box>
                          <Chip 
                            label={getStatusLabel(appointment.statut, true)} 
                            color={getStatusColor(appointment.statut, true)}
                            size="small"
                            sx={{ fontWeight: 'bold', minWidth: '80px !important' }}
                          />
                        </Box>

                        {/* Date and Time Information */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, border: '1px solid', borderColor: 'grey.300', width: '100% !important' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, width: '100% !important' }}>
                            <CalendarIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', flexShrink: 0 }} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', flex: 1, fontSize: '0.95rem !important' }}>
                              {formatDate(appointment.date_heure_debut)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, width: '100% !important' }}>
                            <TimeIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', flexShrink: 0 }} />
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', flex: 1, fontSize: '0.95rem !important' }}>
                              {formatTime(appointment.date_heure_debut)} - {formatTime(appointment.date_heure_fin)}
                            </Typography>
                          </Box>
                          {appointment.institution_nom && (
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100% !important' }}>
                              <PlaceIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary', flexShrink: 0 }} />
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', flex: 1, fontSize: '0.95rem !important' }}>
                                {appointment.institution_nom}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Additional Information */}
                        {(appointment.motif || appointment.notes_patient) && (
                          <Box sx={{ mb: 2, width: '100% !important' }}>
                            {appointment.motif && (
                              <Box sx={{ mb: 2, width: '100% !important' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, fontSize: '0.9rem !important' }}>
                                  Motif:
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  bgcolor: 'grey.200', 
                                  p: 1.5, 
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'grey.400',
                                  color: 'text.primary',
                                  fontWeight: 'medium',
                                  width: '100% !important',
                                  fontSize: '0.85rem !important',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word'
                                }}>
                                  {appointment.motif}
                                </Typography>
                              </Box>
                            )}

                            {appointment.notes_patient && (
                              <Box sx={{ width: '100% !important' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5, fontSize: '0.9rem !important' }}>
                                  Notes:
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  bgcolor: 'grey.200', 
                                  p: 1.5, 
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'grey.400',
                                  color: 'text.primary',
                                  fontWeight: 'medium',
                                  width: '100% !important',
                                  fontSize: '0.85rem !important',
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word'
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