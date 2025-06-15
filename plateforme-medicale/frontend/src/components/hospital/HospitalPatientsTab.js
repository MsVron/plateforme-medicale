import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  LocalHospital,
  ExitToApp,
  Bed,
  CalendarToday,
  Refresh,
  Visibility
} from '@mui/icons-material';
import hospitalService from '../../services/hospitalService';

const HospitalPatientsTab = ({ onSuccess, onError, onRefresh }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dischargeDialog, setDischargeDialog] = useState({
    open: false,
    assignment: null
  });
  const [dischargeForm, setDischargeForm] = useState({
    discharge_reason: '',
    discharge_notes: ''
  });
  const [discharging, setDischarging] = useState(false);

  useEffect(() => {
    fetchHospitalPatients();
  }, []);

  const fetchHospitalPatients = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getHospitalPatients();
      setPatients(response.patients || []);
    } catch (error) {
      console.error('Error fetching hospital patients:', error);
      onError(error.message || 'Erreur lors du chargement des patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDischargePatient = (assignment) => {
    setDischargeDialog({
      open: true,
      assignment: assignment
    });
    setDischargeForm({
      discharge_reason: '',
      discharge_notes: ''
    });
  };

  const handleDischargeSubmit = async () => {
    if (!dischargeForm.discharge_reason) {
      onError('Veuillez saisir le motif de sortie');
      return;
    }

    try {
      setDischarging(true);
      await hospitalService.dischargePatient(dischargeDialog.assignment.assignment_id, dischargeForm);
      onSuccess('Patient sorti avec succès');
      setDischargeDialog({ open: false, assignment: null });
      fetchHospitalPatients();
      onRefresh();
    } catch (error) {
      console.error('Discharge error:', error);
      onError(error.message || 'Erreur lors de la sortie');
    } finally {
      setDischarging(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'admitted': { label: 'Admis', color: 'success' },
      'discharged': { label: 'Sorti', color: 'default' },
      'transferred': { label: 'Transféré', color: 'warning' }
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const calculateStayDuration = (admissionDate) => {
    const admission = new Date(admissionDate);
    const now = new Date();
    const diffTime = Math.abs(now - admission);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des patients...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Patients de l'Hôpital ({patients.length})
        </Typography>
        <Tooltip title="Actualiser la liste">
          <IconButton onClick={fetchHospitalPatients} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {patients.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <LocalHospital sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucun patient actuellement dans l'hôpital
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>CNE</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lit</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Admission</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Durée</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow 
                  key={patient.id}
                  sx={{ 
                    '&:hover': { backgroundColor: 'rgba(76, 161, 175, 0.04)' },
                    '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {patient.prenom} {patient.nom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.sexe} • {new Date(patient.date_naissance).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {patient.CNE}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Dr. {patient.doctor_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {patient.doctor_specialty}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Bed sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                      <Typography variant="body2">
                        {patient.bed_number || 'Non assigné'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                      <Typography variant="body2">
                        {new Date(patient.admission_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${calculateStayDuration(patient.admission_date)} jour(s)`}
                      color="info"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getStatusChip(patient.status)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Voir dossier">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {patient.status === 'admitted' && (
                        <Tooltip title="Sortir le patient">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDischargePatient(patient)}
                          >
                            <ExitToApp />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Discharge Dialog */}
      <Dialog 
        open={dischargeDialog.open} 
        onClose={() => setDischargeDialog({ open: false, assignment: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Sortir le Patient: {dischargeDialog.assignment?.prenom} {dischargeDialog.assignment?.nom}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motif de sortie *"
                value={dischargeForm.discharge_reason}
                onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_reason: e.target.value }))}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Ex: Guérison complète, Transfert vers un autre service..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes de sortie"
                value={dischargeForm.discharge_notes}
                onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_notes: e.target.value }))}
                variant="outlined"
                multiline
                rows={4}
                placeholder="Instructions post-hospitalisation, recommandations, suivi..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDischargeDialog({ open: false, assignment: null })}
            disabled={discharging}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDischargeSubmit}
            disabled={discharging}
            startIcon={discharging ? <CircularProgress size={20} /> : <ExitToApp />}
            sx={{ fontWeight: 'bold' }}
          >
            {discharging ? 'Sortie...' : 'Confirmer la Sortie'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HospitalPatientsTab; 