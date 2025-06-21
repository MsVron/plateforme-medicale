import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper
} from '@mui/material';
import {
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { appointmentEmailService } from '../../services/appointmentEmailService';

const AppointmentEmailManagement = () => {
  const [serviceStatus, setServiceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [triggering, setTriggering] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchServiceStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const status = await appointmentEmailService.getReminderServiceStatus();
      setServiceStatus(status);
      setLastUpdate(new Date());
    } catch (error) {
      setError(error.message || 'Erreur lors de la récupération du statut du service');
    } finally {
      setLoading(false);
    }
  };

  const triggerManualCheck = async () => {
    try {
      setTriggering(true);
      setError('');
      const result = await appointmentEmailService.triggerReminderCheck();
      
      // Show success message and refresh status
      alert(`Vérification manuelle déclenchée avec succès. ${result.message || ''}`);
      await fetchServiceStatus();
    } catch (error) {
      setError(error.message || 'Erreur lors du déclenchement de la vérification');
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    fetchServiceStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchServiceStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (isRunning) => {
    return isRunning ? 'success' : 'error';
  };

  const getStatusText = (isRunning) => {
    return isRunning ? 'Actif' : 'Inactif';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmailIcon />
        Gestion des Emails de Rendez-vous
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Service Status Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon />
                Statut du Service de Rappels
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress />
                </Box>
              ) : serviceStatus ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getStatusText(serviceStatus.isRunning)}
                      color={getStatusColor(serviceStatus.isRunning)}
                      icon={serviceStatus.isRunning ? <CheckCircleIcon /> : <ErrorIcon />}
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Dernière vérification"
                        secondary={serviceStatus.lastCheck || 'Jamais'}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Rappels envoyés aujourd'hui"
                        secondary={serviceStatus.remindersSentToday || 0}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Prochaine vérification"
                        secondary={serviceStatus.nextCheck || 'Dans 1 heure'}
                      />
                    </ListItem>
                  </List>
                </>
              ) : (
                <Alert severity="warning">
                  Impossible de récupérer le statut du service
                </Alert>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchServiceStatus}
                  disabled={loading}
                >
                  Actualiser
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  onClick={triggerManualCheck}
                  disabled={triggering || loading}
                >
                  {triggering ? 'En cours...' : 'Vérifier maintenant'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon />
                Informations sur le Service
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Fréquence de vérification"
                    secondary="Toutes les heures"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Rappels automatiques"
                    secondary="24 heures avant le rendez-vous"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Types d'emails"
                    secondary="Confirmation, rappels, annulation"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Dernière mise à jour"
                    secondary={lastUpdate.toLocaleString('fr-FR')}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fonctionnalités Email Actives
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Confirmation</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email automatique à la prise de RDV
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                    <ScheduleIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Rappels</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rappel automatique 24h avant
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                    <CheckCircleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Confirmation par email</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lien de confirmation dans l'email
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.50' }}>
                    <ErrorIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6">Annulation par email</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lien d'annulation dans l'email
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppointmentEmailManagement; 