import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Person as PersonIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import hospitalService from '../../services/hospitalService';

// Reusable PatientSearch component for hospital use
const HospitalPatientSearch = ({ onPatientSelect }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    prenom: '',
    nom: '',
    cne: ''
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const clearSearch = () => {
    setSearchCriteria({
      prenom: '',
      nom: '',
      cne: ''
    });
    setPatients([]);
    setSearched(false);
    setError(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const { prenom, nom, cne } = searchCriteria;
    if (!prenom.trim() && !nom.trim() && !cne.trim()) {
      setError('Veuillez remplir au moins un critère de recherche');
      return;
    }

    if (prenom.trim() && prenom.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères');
      return;
    }
    if (nom.trim() && nom.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return;
    }
    if (cne.trim() && cne.trim().length < 3) {
      setError('Le CIN doit contenir au moins 3 caractères');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params = {};
      if (prenom.trim()) params.prenom = prenom.trim();
      if (nom.trim()) params.nom = nom.trim();
      if (cne.trim()) params.cne = cne.trim();
      
      const response = await hospitalService.searchPatients(params);
      setPatients(response.patients || []);
      setSearched(true);
    } catch (err) {
      console.error('Error searching patients:', err);
      setError(err.message || 'Erreur lors de la recherche. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recherche exacte par critères
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Recherche par correspondance exacte. Remplissez au moins un critère.
        </Typography>
        
        <Box component="form" onSubmit={handleSearch}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Prénom exact"
                variant="outlined"
                value={searchCriteria.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="ex: Mohamed"
                helperText="Correspondance exacte requise"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nom exact"
                variant="outlined"
                value={searchCriteria.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="ex: Alami"
                helperText="Correspondance exacte requise"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CIN exact"
                variant="outlined"
                value={searchCriteria.cne}
                onChange={(e) => handleInputChange('cne', e.target.value)}
                placeholder="ex: AB123456"
                helperText="Correspondance exacte requise"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={loading ? <CircularProgress size={20} /> : <PersonIcon />}
              disabled={loading}
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<PersonIcon />}
              onClick={clearSearch}
              disabled={loading}
            >
              Effacer
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        searched && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {patients.length} résultat{patients.length !== 1 ? 's' : ''} trouvé{patients.length !== 1 ? 's' : ''}
            </Typography>
            
            {patients.length > 0 ? (
              <Grid container spacing={2}>
                {patients.map((patient) => (
                  <Grid item xs={12} md={6} key={patient.id}>
                    <Card sx={{ 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)' },
                      cursor: 'pointer'
                    }}
                    onClick={() => onPatientSelect(patient)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {patient.prenom} {patient.nom}
                            </Typography>
                          </Box>
                          {patient.currently_assigned && (
                            <Chip 
                              label="Déjà hospitalisé" 
                              color="warning" 
                              size="small"
                            />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>CIN:</strong> {patient.CNE}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Âge:</strong> {calculateAge(patient.date_naissance)} ans
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Téléphone:</strong> {patient.telephone || 'Non renseigné'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<HospitalIcon />}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          >
                            Sélectionner pour admission
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                Aucun patient trouvé avec ces critères de recherche exacts.
              </Alert>
            )}
          </Box>
        )
      )}
    </Box>
  );
};

const HospitalAdmissionsTab = ({ onStatsUpdate }) => {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Doctor assignment states
  const [doctorAssignmentDialogOpen, setDoctorAssignmentDialogOpen] = useState(false);
  const [selectedAdmissionForDoctor, setSelectedAdmissionForDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorAssignmentForm, setDoctorAssignmentForm] = useState({
    medecin_id: '',
    assignment_reason: '',
    notes: ''
  });

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

  useEffect(() => {
    loadDoctors();
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

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await hospitalService.getHospitalDoctors();
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setSnackbar({ open: true, message: 'Erreur lors du chargement des médecins', severity: 'error' });
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSelectPatientForAdmission = (patient) => {
    // Navigate to dedicated admission page with patient data
    navigate('/hospital/patient-admission', { state: { patient } });
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
      setSnackbar({ open: true, message: 'Veuillez sélectionner un patient et remplir le motif d\'admission', severity: 'error' });
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
      setSnackbar({ 
        open: true, 
        message: error.message || 'Erreur lors de la sortie', 
        severity: 'error' 
      });
    }
  };

  const handleOpenDoctorAssignmentDialog = (admission) => {
    setSelectedAdmissionForDoctor(admission);
    setDoctorAssignmentForm({
      medecin_id: '',
      assignment_reason: '',
      notes: ''
    });
    setDoctorAssignmentDialogOpen(true);
  };

  const handleAssignDoctorToAdmission = async () => {
    if (!doctorAssignmentForm.medecin_id) {
      setSnackbar({ open: true, message: 'Veuillez sélectionner un médecin', severity: 'error' });
      return;
    }

    try {
      await hospitalService.assignDoctorToAdmission(selectedAdmissionForDoctor.id, doctorAssignmentForm);
      setSnackbar({ open: true, message: 'Médecin assigné avec succès', severity: 'success' });
      setDoctorAssignmentDialogOpen(false);
      setSelectedAdmissionForDoctor(null);
      loadAdmissions();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error assigning doctor:', error);
      setSnackbar({ open: true, message: error.message || 'Erreur lors de l\'assignation', severity: 'error' });
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

        {/* Patient Search Section */}
        <Card sx={{ mb: 3, p: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} />
            Recherche de Patient pour Admission
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Utilisez la recherche ci-dessous pour trouver un patient et l'admettre à l'hôpital
          </Typography>
          <HospitalPatientSearch onPatientSelect={handleSelectPatientForAdmission} />
        </Card>

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
                  <TableCell sx={{ fontWeight: 'bold' }}>Date de sortie</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Motif</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Médecin</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durée</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
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
                        {admission.discharge_date ? (
                          <Typography variant="body2" color="text.primary">
                            {formatDate(admission.discharge_date)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            En cours
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{admission.admission_reason}</Typography>
                        {admission.ward_name && (
                          <Typography variant="caption" color="text.secondary">
                            Département: {admission.ward_name}
                          </Typography>
                        )}
                        {admission.discharge_reason && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Sortie: {admission.discharge_reason}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {admission.medecin_nom ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {admission.medecin_nom}
                            </Typography>
                            {admission.medecin_specialite && (
                              <Typography variant="caption" color="text.secondary">
                                {admission.medecin_specialite}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Non assigné
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={calculateStayDuration(admission.admission_date, admission.discharge_date)}
                          color={admission.discharge_date ? "default" : "info"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{getStatusChip(admission)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!admission.discharge_date && (
                            <>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenDoctorAssignmentDialog(admission)}
                                title="Assigner un médecin"
                              >
                                <PersonAddIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleOpenDischargeDialog(admission)}
                                title="Sortir le patient"
                              >
                                <DischargeIcon />
                              </IconButton>
                            </>
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
            {/* Show selected patient info */}
            {admissionForm.patient && (
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6">
                  Patient sélectionné: {admissionForm.patient.prenom} {admissionForm.patient.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CIN: {admissionForm.patient.CNE} | Tél: {admissionForm.patient.telephone}
                </Typography>
              </Box>
            )}
            
            <Grid container spacing={3} sx={{ mt: 1 }}>

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
                  Motif: {selectedAdmission.admission_reason}
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

        {/* Doctor Assignment Dialog */}
        <Dialog open={doctorAssignmentDialogOpen} onClose={() => setDoctorAssignmentDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonAddIcon sx={{ mr: 1 }} />
              Assigner un Médecin
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedAdmissionForDoctor && (
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6">
                  {selectedAdmissionForDoctor.patient_prenom} {selectedAdmissionForDoctor.patient_nom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admis le: {formatDate(selectedAdmissionForDoctor.admission_date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Motif: {selectedAdmissionForDoctor.admission_reason}
                </Typography>
              </Box>
            )}
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Médecin *</InputLabel>
                  <Select
                    value={doctorAssignmentForm.medecin_id}
                    onChange={(e) => setDoctorAssignmentForm(prev => ({ ...prev, medecin_id: e.target.value }))}
                    label="Médecin *"
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.prenom} {doctor.nom} - {doctor.specialite}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Motif de l'assignation"
                  value={doctorAssignmentForm.assignment_reason}
                  onChange={(e) => setDoctorAssignmentForm(prev => ({ ...prev, assignment_reason: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={doctorAssignmentForm.notes}
                  onChange={(e) => setDoctorAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDoctorAssignmentDialogOpen(false)}>Annuler</Button>
            <Button variant="contained" color="primary" onClick={handleAssignDoctorToAdmission}>
              Assigner le Médecin
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