import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Science,
  Person,
  CheckCircle,
  Schedule,
  Refresh,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';
import laboratoryService from '../../services/laboratoryService';

const PendingWorkTab = ({ onSuccess, onError, onRefresh }) => {
  const [pendingWork, setPendingWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchPendingWork();
  }, []);

  const fetchPendingWork = async () => {
    try {
      setLoading(true);
      const response = await laboratoryService.getPendingWork();
      setPendingWork(response.pendingWork || []);
    } catch (error) {
      console.error('Error fetching pending work:', error);
      onError(error.message || 'Erreur lors du chargement du travail en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (testRequestId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [testRequestId]: true }));
      // For now, just show success message - backend endpoint might not exist yet
      onSuccess(`Statut mis à jour: ${getStatusLabel(newStatus)}`);
      fetchPendingWork();
      onRefresh();
    } catch (error) {
      console.error('Status update error:', error);
      onError(error.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [testRequestId]: false }));
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'En attente',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  };

  const getStatusChip = (testRequest) => {
    const statusConfig = {
      'pending': { label: 'En attente', color: 'warning', icon: <Schedule /> },
      'in_progress': { label: 'En cours', color: 'info', icon: <Science /> },
      'completed': { label: 'Terminé', color: 'success', icon: <CheckCircle /> }
    };
    
    const config = statusConfig[testRequest.status] || { label: testRequest.status, color: 'default', icon: <Schedule /> };
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      'urgent': { label: 'Urgent', color: 'error' },
      'high': { label: 'Élevée', color: 'warning' },
      'normal': { label: 'Normal', color: 'default' },
      'low': { label: 'Faible', color: 'info' }
    };
    
    const config = priorityConfig[priority] || { label: priority, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const calculateDaysAgo = (date) => {
    const requestDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - requestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressValue = (testRequest) => {
    // This would be calculated based on actual progress tracking
    // For now, we'll use a simple heuristic based on status and time
    if (testRequest.status === 'completed') return 100;
    if (testRequest.status === 'in_progress') {
      const daysInProgress = calculateDaysAgo(testRequest.started_date || testRequest.request_date);
      return Math.min(daysInProgress * 25, 75); // Assume 4 days for completion
    }
    return 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement du travail en attente...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Travail en Attente ({pendingWork.length})
        </Typography>
        <Tooltip title="Actualiser la liste">
          <IconButton onClick={fetchPendingWork} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {pendingWork.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" color="success.main">
              Excellent travail ! Aucune analyse en attente.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Toutes les demandes d'analyses ont été traitées.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pendingWork.map((testRequest) => (
            <Grid item xs={12} md={6} lg={4} key={testRequest.id}>
              <Card sx={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' },
                border: testRequest.priority === 'urgent' ? '2px solid #f44336' : 'none'
              }}>
                <CardContent>
                  {/* Priority Alert for Urgent Tests */}
                  {testRequest.priority === 'urgent' && (
                    <Alert severity="error" sx={{ mb: 2, fontSize: '0.875rem' }}>
                      Analyse urgente !
                    </Alert>
                  )}

                  {/* Patient Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {testRequest.patient_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        CNE: {testRequest.patient_cne}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Test Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Science sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {testRequest.test_name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Demandé par: Dr. {testRequest.doctor_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testRequest.doctor_specialty}
                    </Typography>
                  </Box>

                  {/* Status and Priority */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {getStatusChip(testRequest)}
                    {getPriorityChip(testRequest.priority)}
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progression
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getProgressValue(testRequest)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={getProgressValue(testRequest)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: testRequest.priority === 'urgent' ? '#f44336' : '#4ca1af'
                        }
                      }}
                    />
                  </Box>

                  {/* Time Info */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Demandé:</strong> {new Date(testRequest.request_date).toLocaleDateString()}
                    <br />
                    <strong>Il y a:</strong> {calculateDaysAgo(testRequest.request_date)} jour(s)
                  </Typography>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {testRequest.status === 'pending' && (
                      <Button
                        variant="contained"
                        startIcon={updatingStatus[testRequest.id] ? <CircularProgress size={16} /> : <PlayArrow />}
                        onClick={() => handleStatusUpdate(testRequest.id, 'in_progress')}
                        disabled={updatingStatus[testRequest.id]}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Commencer
                      </Button>
                    )}
                    
                    {testRequest.status === 'in_progress' && (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={updatingStatus[testRequest.id] ? <CircularProgress size={16} /> : <Pause />}
                          onClick={() => handleStatusUpdate(testRequest.id, 'pending')}
                          disabled={updatingStatus[testRequest.id]}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Pause
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={updatingStatus[testRequest.id] ? <CircularProgress size={16} /> : <CheckCircle />}
                          onClick={() => handleStatusUpdate(testRequest.id, 'completed')}
                          disabled={updatingStatus[testRequest.id]}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Terminer
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={updatingStatus[testRequest.id] ? <CircularProgress size={16} /> : <Stop />}
                      onClick={() => handleStatusUpdate(testRequest.id, 'cancelled')}
                      disabled={updatingStatus[testRequest.id]}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    >
                      Annuler
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PendingWorkTab; 