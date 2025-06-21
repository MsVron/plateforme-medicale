import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Cancel as CancelIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from 'axios';

const AppointmentCancellation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  useEffect(() => {
    const checkAppointment = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const id = searchParams.get('id');

        if (!token || !id) {
          setError('Lien d\'annulation invalide');
          setLoading(false);
          return;
        }

        // First, let's show a confirmation dialog
        setAppointmentData({ token, id });
        setLoading(false);
        setShowConfirmDialog(true);

      } catch (error) {
        console.error('Error checking appointment:', error);
        setError('Erreur lors de la vérification du rendez-vous');
        setLoading(false);
      }
    };

    checkAppointment();
  }, [location.search]);

  const handleConfirmCancellation = async () => {
    try {
      setShowConfirmDialog(false);
      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/appointments/cancel?token=${appointmentData.token}&id=${appointmentData.id}`
      );

      setResult(response.data);
      setLoading(false);

    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'annulation du rendez-vous');
      setLoading(false);
    }
  };

  const handleCancelCancellation = () => {
    setShowConfirmDialog(false);
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            {showConfirmDialog ? 'Vérification du rendez-vous...' : 'Annulation de votre rendez-vous en cours...'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Confirmation Dialog */}
      <Dialog 
        open={showConfirmDialog} 
        onClose={handleCancelCancellation}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirmer l'annulation
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir annuler votre rendez-vous médical ?
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cette action est irréversible. Une fois annulé, ce créneau sera disponible pour d'autres patients.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Si vous souhaitez reporter votre rendez-vous, nous vous recommandons de contacter directement votre médecin.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCancelCancellation}
            variant="outlined"
            sx={{ px: 3 }}
          >
            Garder le rendez-vous
          </Button>
          <Button 
            onClick={handleConfirmCancellation}
            variant="contained"
            color="error"
            sx={{ px: 3 }}
          >
            Confirmer l'annulation
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {error ? (
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
              
              <Typography variant="h4" color="error.main" gutterBottom>
                Erreur d'annulation
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                {error}
              </Typography>
              
              <Alert severity="error" sx={{ mt: 2, maxWidth: 500 }}>
                Le lien d'annulation peut avoir expiré ou être invalide. 
                Veuillez contacter directement votre médecin pour annuler votre rendez-vous.
              </Alert>
              
              <Button 
                variant="contained" 
                onClick={handleGoHome}
                sx={{ px: 4, mt: 3 }}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </CardContent>
        ) : result ? (
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <CancelIcon sx={{ fontSize: 80, color: 'error.main' }} />
              
              <Typography variant="h4" color="error.main" gutterBottom>
                Rendez-vous annulé
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                Votre rendez-vous a été annulé avec succès. Ce créneau est maintenant disponible pour d'autres patients.
              </Typography>
              
              {result?.appointment && (
                <Card sx={{ 
                  mt: 3, 
                  bgcolor: 'error.50', 
                  border: '1px solid',
                  borderColor: 'error.200',
                  maxWidth: 500,
                  width: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="error.main" gutterBottom>
                      Rendez-vous annulé
                    </Typography>
                    
                    <Box sx={{ mt: 2, textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Médecin:</strong> {result.appointment.doctor}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Date:</strong> {result.appointment.date}
                      </Typography>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Chip 
                          label="Annulé" 
                          color="error" 
                          variant="filled"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
              
              <Alert severity="info" sx={{ mt: 2, maxWidth: 500 }}>
                <Typography variant="body2">
                  <strong>Informations importantes:</strong>
                  <br />• Vous recevrez un email de confirmation d'annulation
                  <br />• Pour un suivi médical, pensez à reprendre rendez-vous
                  <br />• En cas d'urgence, contactez directement votre médecin
                </Typography>
              </Alert>
              
              <Button 
                variant="contained" 
                onClick={handleGoHome}
                sx={{ px: 4, mt: 3 }}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </CardContent>
        ) : null}
      </Card>
    </Container>
  );
};

export default AppointmentCancellation; 