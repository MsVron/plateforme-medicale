import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  AlertTitle,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  MedicalServices as MedicalServicesIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkEmailReadIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [institutionRequests, setInstitutionRequests] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAction, setReviewAction] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    testBackendConnection();
    fetchNotifications();
    fetchPendingRequests();
  }, []);

  const testBackendConnection = async () => {
    try {
      console.log('🔍 [DEBUG] Testing backend connection...');
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/admin/superadmin/test', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 [DEBUG] Test endpoint response status:', response.status);
      
      const responseText = await response.text();
      console.log('🔍 [DEBUG] Test endpoint response:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ [SUCCESS] Backend connection test successful:', data);
      } else {
        console.error('❌ [ERROR] Backend connection test failed:', response.status, responseText);
        if (responseText.includes('<!DOCTYPE html>')) {
          console.error('❌ [ERROR] Getting HTML instead of JSON - Backend server may not be running or proxy not configured');
          console.error('❌ [ERROR] Make sure:');
          console.error('❌ [ERROR] 1. Backend server is running on port 5000');
          console.error('❌ [ERROR] 2. Frontend has proxy configured in package.json');
          console.error('❌ [ERROR] 3. Restart the frontend development server after adding proxy');
        }
      }
    } catch (error) {
      console.error('❌ [ERROR] Backend connection test error:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 [DEBUG] Fetching notifications...');
      console.log('🔍 [DEBUG] Token exists:', !!token);
      console.log('🔍 [DEBUG] Token length:', token ? token.length : 'N/A');
      
      const response = await fetch('/api/admin/superadmin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 [DEBUG] Notifications response status:', response.status);
      console.log('🔍 [DEBUG] Notifications response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('🔍 [DEBUG] Raw response text (first 500 chars):', responseText.substring(0, 500));
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('🔍 [DEBUG] Notifications data:', data);
          setNotifications(data.notifications || []);
        } catch (parseError) {
          console.error('❌ [ERROR] Failed to parse notifications JSON:', parseError);
          console.error('❌ [ERROR] Response was:', responseText);
        }
      } else {
        console.error('❌ [ERROR] Notifications request failed with status:', response.status);
        console.error('❌ [ERROR] Response text:', responseText);
      }
    } catch (error) {
      console.error('❌ [ERROR] Error fetching notifications:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 [DEBUG] Fetching pending requests...');
      console.log('🔍 [DEBUG] Token exists:', !!token);
      
      const [institutionResponse, doctorResponse] = await Promise.all([
        fetch('/api/admin/superadmin/institution-requests', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/admin/superadmin/doctor-requests', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      console.log('🔍 [DEBUG] Institution requests response status:', institutionResponse.status);
      console.log('🔍 [DEBUG] Doctor requests response status:', doctorResponse.status);

      const institutionText = await institutionResponse.text();
      const doctorText = await doctorResponse.text();
      
      console.log('🔍 [DEBUG] Institution response (first 500 chars):', institutionText.substring(0, 500));
      console.log('🔍 [DEBUG] Doctor response (first 500 chars):', doctorText.substring(0, 500));

      if (institutionResponse.ok) {
        try {
          const institutionData = JSON.parse(institutionText);
          console.log('🔍 [DEBUG] Institution requests data:', institutionData);
          setInstitutionRequests(institutionData.requests || []);
        } catch (parseError) {
          console.error('❌ [ERROR] Failed to parse institution requests JSON:', parseError);
          console.error('❌ [ERROR] Institution response was:', institutionText);
        }
      } else {
        console.error('❌ [ERROR] Institution requests failed with status:', institutionResponse.status);
      }

      if (doctorResponse.ok) {
        try {
          const doctorData = JSON.parse(doctorText);
          console.log('🔍 [DEBUG] Doctor requests data:', doctorData);
          setDoctorRequests(doctorData.requests || []);
        } catch (parseError) {
          console.error('❌ [ERROR] Failed to parse doctor requests JSON:', parseError);
          console.error('❌ [ERROR] Doctor response was:', doctorText);
        }
      } else {
        console.error('❌ [ERROR] Doctor requests failed with status:', doctorResponse.status);
      }
    } catch (error) {
      console.error('❌ [ERROR] Error fetching pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = (request, type) => {
    setSelectedRequest({ ...request, type });
    setReviewAction('approved');
    setReviewDialog(true);
  };

  const handleRejectRequest = (request, type) => {
    setSelectedRequest({ ...request, type });
    setReviewAction('rejected');
    setReviewDialog(true);
  };

  const submitReview = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = selectedRequest.type === 'institution' 
        ? '/api/admin/superadmin/review-institution-request'
        : '/api/admin/superadmin/review-doctor-request';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          action: reviewAction,
          comment: reviewComment
        })
      });

      if (response.ok) {
        setReviewDialog(false);
        setReviewComment('');
        setSelectedRequest(null);
        fetchPendingRequests();
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/superadmin/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getRequestTypeIcon = (type) => {
    return type === 'institution' ? <BusinessIcon /> : <MedicalServicesIcon />;
  };

  const getRequestTypeName = (type) => {
    return type === 'institution' ? 'Institution' : 'Médecin';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          Centre de Notifications
        </Typography>
        <Box>
          <Tooltip title="Actualiser">
            <IconButton onClick={() => { fetchNotifications(); fetchPendingRequests(); }}>
              <RefreshIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={notifications.filter(n => !n.est_lue).length} color="error">
                Notifications
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={institutionRequests.length} color="warning">
                Demandes Institutions
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={doctorRequests.length} color="warning">
                Demandes Médecins
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Notifications Tab */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Notifications Récentes
          </Typography>
          {notifications.length === 0 ? (
            <Alert severity="info">
              Aucune notification disponible
            </Alert>
          ) : (
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    mb: 1,
                    bgcolor: notification.est_lue ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    borderRadius: 1,
                    border: notification.est_lue ? '1px solid #e0e0e0' : '1px solid #1976d2'
                  }}
                >
                  <ListItemIcon>
                    <NotificationsIcon color={notification.est_lue ? 'disabled' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.titre}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notification.date_creation)}
                        </Typography>
                      </Box>
                    }
                  />
                  {!notification.est_lue && (
                    <IconButton onClick={() => markAsRead(notification.id)}>
                      <MarkEmailReadIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Institution Requests Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {institutionRequests.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                Aucune demande d'institution en attente
              </Alert>
            </Grid>
          ) : (
            institutionRequests.map((request) => (
              <Grid item xs={12} md={6} key={request.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <BusinessIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {request.request_type === 'create' ? 'Nouvelle Institution' : 
                         request.request_type === 'modify' ? 'Modification Institution' : 
                         'Suppression Institution'}
                      </Typography>
                      <Chip 
                        label={request.status} 
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Demandé par: {request.requester_name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Date: {formatDate(request.date_requested)}
                    </Typography>

                    {request.request_data && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Détails de la demande:
                        </Typography>
                        <Typography variant="body2">
                          Nom: {request.request_data.nom || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          Type: {request.request_data.type || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          Ville: {request.request_data.ville || 'N/A'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  {request.status === 'pending' && (
                    <CardActions>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApproveRequest(request, 'institution')}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleRejectRequest(request, 'institution')}
                      >
                        Rejeter
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Doctor Requests Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {doctorRequests.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                Aucune demande de médecin en attente
              </Alert>
            </Grid>
          ) : (
            doctorRequests.map((request) => (
              <Grid item xs={12} md={6} key={request.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <MedicalServicesIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {request.request_type === 'create' ? 'Nouveau Médecin' : 
                         request.request_type === 'modify' ? 'Modification Médecin' : 
                         'Suppression Médecin'}
                      </Typography>
                      <Chip 
                        label={request.status} 
                        color={getStatusColor(request.status)}
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Demandé par: {request.requester_name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Date: {formatDate(request.date_requested)}
                    </Typography>

                    {request.request_data && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Détails de la demande:
                        </Typography>
                        <Typography variant="body2">
                          Nom: {request.request_data.nom || 'N/A'} {request.request_data.prenom || ''}
                        </Typography>
                        <Typography variant="body2">
                          Spécialité: {request.request_data.specialite || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          Email: {request.request_data.email || 'N/A'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  {request.status === 'pending' && (
                    <CardActions>
                      <Button
                        size="small"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApproveRequest(request, 'doctor')}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleRejectRequest(request, 'doctor')}
                      >
                        Rejeter
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {reviewAction === 'approved' ? 'Approuver la demande' : 'Rejeter la demande'}
        </DialogTitle>
        <DialogContent>
          <Alert severity={reviewAction === 'approved' ? 'success' : 'warning'} sx={{ mb: 3 }}>
            <AlertTitle>
              {reviewAction === 'approved' 
                ? 'Vous êtes sur le point d\'approuver cette demande'
                : 'Vous êtes sur le point de rejeter cette demande'
              }
            </AlertTitle>
            Cette action sera définitive et une notification sera envoyée au demandeur.
          </Alert>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Commentaire (optionnel)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Ajoutez un commentaire pour expliquer votre décision..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={submitReview} 
            color={reviewAction === 'approved' ? 'success' : 'error'}
            variant="contained"
          >
            {reviewAction === 'approved' ? 'Approuver' : 'Rejeter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notifications; 