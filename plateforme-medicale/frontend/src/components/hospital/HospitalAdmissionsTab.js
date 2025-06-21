import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  Autocomplete,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ExitToApp as DischargeIcon,
  Visibility as ViewIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import hospitalService from '../../services/hospitalService';

const HospitalAdmissionsTab = ({ onStatsUpdate }) => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchingPatients, setSearchingPatients] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [admissionForm, setAdmissionForm] = useState({
    patient_id: null,
    patient: null,
    admission_date: new Date(),
    reason: '',
    reason_type: 'emergency', // emergency, surgery, treatment
    department: '',
    notes: ''
  });

  const [dischargeForm, setDischargeForm] = useState({
    discharge_date: new Date(),
    discharge_reason: '',
    discharge_notes: '',
    follow_up_required: false
  });

  const reasonTypes = [
    { value: 'emergency', label: 'Urgence', color: 'error' },
    { value: 'surgery', label: 'Chirurgie', color: 'warning' },
    { value: 'treatment', label: 'Traitement', color: 'info' },
    { value: 'observation', label: 'Observation', color: 'default' }
  ];

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getHospitalAdmissions();
      setAdmissions(response.data || []);
    } catch (error) {
      console.error('Error loading admissions:', error);
      setSnackbar({ open: true, message: 'Erreur lors du chargement des admissions', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    try {
      setSearchingPatients(true);
      const response = await hospitalService.searchPatients({ 
        search: searchTerm,
        limit: 10 
      });
      return response.data || [];
    } catch (error) {
      console.error('Error searching patients:', error);
      return [];
    } finally {
      setSearchingPatients(false);
    }
  };

  const handleOpenAdmissionDialog = () => {
    setAdmissionForm({
      patient_id: null,
      patient: null,
      admission_date: new Date(),
      reason: '',
      reason_type: 'emergency',
      department: '',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleOpenDischargeDialog = (admission) => {
    setSelectedAdmission(admission);
    setDischargeForm({
      discharge_date: new Date(),
      discharge_reason: '',
      discharge_notes: '',
      follow_up_required: false
    });
    setDischargeDialogOpen(true);
  };

  const handleAdmitPatient = async () => {
    if (!admissionForm.patient_id || !admissionForm.reason) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs requis', severity: 'error' });
      return;
    }

    try {
      await hospitalService.admitPatient(admissionForm.patient_id, {
        admission_date: admissionForm.admission_date.toISOString(),
        reason: admissionForm.reason,
        reason_type: admissionForm.reason_type,
        department: admissionForm.department,
        notes: admissionForm.notes
      });

      setSnackbar({ open: true, message: 'Patient admis avec succès', severity: 'success' });
      setDialogOpen(false);
      loadAdmissions();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error admitting patient:', error);
      setSnackbar({ open: true, message: 'Erreur lors de l\'admission', severity: 'error' });
    }
  };

  const handleDischargePatient = async () => {
    if (!selectedAdmission || !dischargeForm.discharge_reason) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs requis', severity: 'error' });
      return;
    }

    try {
      await hospitalService.dischargePatient(selectedAdmission.id, {
        discharge_date: dischargeForm.discharge_date.toISOString(),
        discharge_reason: dischargeForm.discharge_reason,
        discharge_notes: dischargeForm.discharge_notes,
        follow_up_required: dischargeForm.follow_up_required
      });

      setSnackbar({ open: true, message: 'Patient sorti avec succès', severity: 'success' });
      setDischargeDialogOpen(false);
      setSelectedAdmission(null);
      loadAdmissions();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error discharging patient:', error);
      setSnackbar({ open: true, message: 'Erreur lors de la sortie', severity: 'error' });
    }
  };

  const getStatusChip = (admission) => {
    if (admission.discharge_date) {
      return <Chip label="Sorti" color="default" size="small" />;
    }
    return <Chip label="Hospitalisé" color="primary" size="small" />;
  };

  const getReasonTypeChip = (reasonType) => {
    const type = reasonTypes.find(t => t.value === reasonType);
    return (
      <Chip 
        label={type?.label || reasonType} 
        color={type?.color || 'default'} 
        size="small" 
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  const calculateStayDuration = (admissionDate, dischargeDate) => {
    const start = new Date(admissionDate);
    const end = dischargeDate ? new Date(dischargeDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            Admissions Hospitalières
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdmissionDialog}
            sx={{ fontWeight: 'bold' }}
          >
            Nouvelle Admission
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date d'admission</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Motif</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durée</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        Aucune admission trouvée
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  admissions.map((admission) => (
                    <TableRow key={admission.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {admission.patient_prenom} {admission.patient_nom}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            CIN: {admission.patient_cne}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(admission.admission_date)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{admission.reason}</Typography>
                        {admission.department && (
                          <Typography variant="caption" color="text.secondary">
                            Département: {admission.department}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{getReasonTypeChip(admission.reason_type)}</TableCell>
                      <TableCell>
                        {calculateStayDuration(admission.admission_date, admission.discharge_date)}
                      </TableCell>
                      <TableCell>{getStatusChip(admission)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!admission.discharge_date && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenDischargeDialog(admission)}
                              title="Sortir le patient"
                            >
                              <DischargeIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Admission Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <HospitalIcon sx={{ mr: 1 }} />
              Nouvelle Admission
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={patients}
                  getOptionLabel={(option) => `${option.prenom} ${option.nom} (${option.CNE})`}
                  loading={searchingPatients}
                  onInputChange={async (event, newInputValue) => {
                    if (newInputValue) {
                      const results = await searchPatients(newInputValue);
                      setPatients(results);
                    }
                  }}
                  onChange={(event, newValue) => {
                    setAdmissionForm(prev => ({
                      ...prev,
                      patient_id: newValue?.id || null,
                      patient: newValue
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Rechercher un patient *"
                      placeholder="Tapez le nom, prénom ou CIN"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Date et heure d'admission *"
                  value={admissionForm.admission_date}
                  onChange={(date) => setAdmissionForm(prev => ({ ...prev, admission_date: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de motif *</InputLabel>
                  <Select
                    value={admissionForm.reason_type}
                    onChange={(e) => setAdmissionForm(prev => ({ ...prev, reason_type: e.target.value }))}
                    label="Type de motif *"
                  >
                    {reasonTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motif d'admission *"
                  value={admissionForm.reason}
                  onChange={(e) => setAdmissionForm(prev => ({ ...prev, reason: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Département"
                  value={admissionForm.department}
                  onChange={(e) => setAdmissionForm(prev => ({ ...prev, department: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={admissionForm.notes}
                  onChange={(e) => setAdmissionForm(prev => ({ ...prev, notes: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleAdmitPatient}>
              Admettre le Patient
            </Button>
          </DialogActions>
        </Dialog>

        {/* Discharge Dialog */}
        <Dialog open={dischargeDialogOpen} onClose={() => setDischargeDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <DischargeIcon sx={{ mr: 1 }} />
              Sortie de Patient
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedAdmission && (
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6">
                  {selectedAdmission.patient_prenom} {selectedAdmission.patient_nom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admis le: {formatDate(selectedAdmission.admission_date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Motif: {selectedAdmission.reason}
                </Typography>
              </Box>
            )}
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Date et heure de sortie *"
                  value={dischargeForm.discharge_date}
                  onChange={(date) => setDischargeForm(prev => ({ ...prev, discharge_date: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motif de sortie *"
                  value={dischargeForm.discharge_reason}
                  onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_reason: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes de sortie"
                  value={dischargeForm.discharge_notes}
                  onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_notes: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDischargeDialogOpen(false)}>Annuler</Button>
            <Button variant="contained" color="error" onClick={handleDischargePatient}>
              Confirmer la Sortie
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default HospitalAdmissionsTab; 