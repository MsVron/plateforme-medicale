import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Search,
  Person,
  LocalHospital,
  PersonAdd,
  Edit,
  Assignment,
  ExitToApp,
  Save,
  Cancel,
  MedicalServices,
  Visibility,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import hospitalService from '../../services/hospitalService';

const PatientSearchTab = ({ onSuccess, onError, onRefresh }) => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    prenom: '',
    nom: '',
    cne: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  // Doctor Assignment Dialog State
  const [assignmentDialog, setAssignmentDialog] = useState({
    open: false,
    patient: null
  });
  const [assignmentForm, setAssignmentForm] = useState({
    doctor_ids: [],
    assignment_reason: '',
    notes: '',
    assignment_date: new Date().toISOString().slice(0, 16)
  });
  
  // Discharge Dialog State
  const [dischargeDialog, setDischargeDialog] = useState({
    open: false,
    patient: null
  });
  const [dischargeForm, setDischargeForm] = useState({
    discharge_reason: '',
    discharge_notes: '',
    follow_up_required: false,
    follow_up_date: ''
  });
  
  // Medical Record Edit State
  const [medicalRecordDialog, setMedicalRecordDialog] = useState({
    open: false,
    patient: null,
    editing: false
  });
  const [medicalRecord, setMedicalRecord] = useState({
    allergies: '',
    medical_history: '',
    current_medications: '',
    vital_signs: {
      blood_pressure: '',
      heart_rate: '',
      temperature: '',
      weight: '',
      height: ''
    },
    notes: ''
  });
  
  const [doctors, setDoctors] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [discharging, setDischarging] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);

  React.useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await hospitalService.getHospitalDoctors();
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (!searchForm.prenom && !searchForm.nom && !searchForm.cne) {
      onError('Veuillez saisir au moins un critère de recherche');
      return;
    }

    try {
      setSearching(true);
      const response = await hospitalService.searchPatients(searchForm);
      setSearchResults(response.patients || []);
      
      if (response.patients?.length === 0) {
        onError('Aucun patient trouvé avec ces critères');
      }
    } catch (error) {
      console.error('Search error:', error);
      onError(error.message || 'Erreur lors de la recherche');
    } finally {
      setSearching(false);
    }
  };

  const handleAssignToDoctor = (patient) => {
    setAssignmentDialog({
      open: true,
      patient: patient
    });
    setAssignmentForm({
      doctor_ids: [],
      assignment_reason: '',
      notes: '',
      assignment_date: new Date().toISOString().slice(0, 16)
    });
  };

  const handleAssignmentSubmit = async () => {
    if (!assignmentForm.doctor_ids.length || !assignmentForm.assignment_reason) {
      onError('Veuillez sélectionner au moins un médecin et indiquer la raison');
      return;
    }

    try {
      setAssigning(true);
      await hospitalService.assignPatientToDoctors(assignmentDialog.patient.id, assignmentForm);
      onSuccess('Patient assigné aux médecins avec succès');
      setAssignmentDialog({ open: false, patient: null });
      onRefresh();
      handleSearch(); // Refresh search results
    } catch (error) {
      console.error('Assignment error:', error);
      onError(error.message || 'Erreur lors de l\'assignation');
    } finally {
      setAssigning(false);
    }
  };

  const handleDischargePatient = (patient) => {
    setDischargeDialog({
      open: true,
      patient: patient
    });
    setDischargeForm({
      discharge_reason: '',
      discharge_notes: '',
      follow_up_required: false,
      follow_up_date: ''
    });
  };

  const handleDischargeSubmit = async () => {
    if (!dischargeForm.discharge_reason) {
      onError('Veuillez indiquer la raison de sortie');
      return;
    }

    try {
      setDischarging(true);
      await hospitalService.dischargePatient(dischargeDialog.patient.id, dischargeForm);
      onSuccess('Patient sorti avec succès');
      setDischargeDialog({ open: false, patient: null });
      onRefresh();
      handleSearch(); // Refresh search results
    } catch (error) {
      console.error('Discharge error:', error);
      onError(error.message || 'Erreur lors de la sortie');
    } finally {
      setDischarging(false);
    }
  };

  const handleEditMedicalRecord = async (patient) => {
    setMedicalRecordDialog({
      open: true,
      patient: patient,
      editing: false
    });
    
    // Fetch existing medical record
    try {
      const response = await hospitalService.getPatientMedicalRecord(patient.id);
      setMedicalRecord(response.data || {
        allergies: '',
        medical_history: '',
        current_medications: '',
        vital_signs: {
          blood_pressure: '',
          heart_rate: '',
          temperature: '',
          weight: '',
          height: ''
        },
        notes: ''
      });
    } catch (error) {
      console.error('Error fetching medical record:', error);
      // Initialize with empty record if fetch fails
      setMedicalRecord({
        allergies: '',
        medical_history: '',
        current_medications: '',
        vital_signs: {
          blood_pressure: '',
          heart_rate: '',
          temperature: '',
          weight: '',
          height: ''
        },
        notes: ''
      });
    }
  };

  const handleSaveMedicalRecord = async () => {
    try {
      setSavingRecord(true);
      await hospitalService.updatePatientMedicalRecord(medicalRecordDialog.patient.id, medicalRecord);
      onSuccess('Dossier médical mis à jour avec succès');
      setMedicalRecordDialog({ open: false, patient: null, editing: false });
    } catch (error) {
      console.error('Error saving medical record:', error);
      onError(error.message || 'Erreur lors de la sauvegarde du dossier');
    } finally {
      setSavingRecord(false);
    }
  };

  // Process assigned doctors from the backend response
  const processAssignedDoctors = (patient) => {
    if (!patient.assigned_doctors) return [];
    
    if (typeof patient.assigned_doctors === 'string' && patient.assigned_doctors.trim()) {
      // Format: "Dr. Name1:Specialty1;Dr. Name2:Specialty2"
      return patient.assigned_doctors.split(';').map(doctorInfo => {
        const [name, specialty] = doctorInfo.split(':');
        return { name: name.trim(), specialty: specialty?.trim() || '' };
      });
    }
    
    return Array.isArray(patient.assigned_doctors) ? patient.assigned_doctors : [];
  };

  const getAssignmentStatusChip = (patient) => {
    const assignedDoctors = processAssignedDoctors(patient);
    if (assignedDoctors.length > 0) {
      return (
        <Chip 
          label={`Assigné à ${assignedDoctors.length} médecin(s)`}
          color="success" 
          size="small"
          icon={<MedicalServices />}
        />
      );
    }
    return (
      <Chip 
        label="Non assigné" 
        color="default" 
        size="small"
      />
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Rechercher un Patient
      </Typography>

      {/* Search Form */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Prénom"
                value={searchForm.prenom}
                onChange={(e) => handleSearchChange('prenom', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nom"
                value={searchForm.nom}
                onChange={(e) => handleSearchChange('nom', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CIN"
                value={searchForm.cne}
                onChange={(e) => handleSearchChange('cne', e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={searching ? <CircularProgress size={20} /> : <Search />}
                onClick={handleSearch}
                disabled={searching}
                sx={{
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5
                }}
              >
                {searching ? 'Recherche...' : 'Rechercher'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Résultats de recherche ({searchResults.length})
          </Typography>
          
          <Grid container spacing={2}>
            {searchResults.map((patient) => (
              <Grid item xs={12} md={6} key={patient.id}>
                <Card sx={{ 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {patient.prenom} {patient.nom}
                        </Typography>
                      </Box>
                      {getAssignmentStatusChip(patient)}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>CIN:</strong> {patient.CNE}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Date de naissance:</strong> {new Date(patient.date_naissance).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Téléphone:</strong> {patient.telephone || 'Non renseigné'}
                    </Typography>

                    {(() => {
                      const assignedDoctors = processAssignedDoctors(patient);
                      return assignedDoctors.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Médecins assignés:
                          </Typography>
                          {assignedDoctors.map((doctor, index) => (
                            <Chip 
                              key={index}
                              label={`${doctor.name}${doctor.specialty ? ` (${doctor.specialty})` : ''}`}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      );
                    })()}

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        startIcon={<Assignment />}
                        onClick={() => handleEditMedicalRecord(patient)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Dossier médical
                      </Button>
                      
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAssignToDoctor(patient)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Assigner médecin
                      </Button>
                      
                      {processAssignedDoctors(patient).length > 0 && (
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<ExitToApp />}
                          onClick={() => handleDischargePatient(patient)}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Sortir
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No Results Message */}
      {searchResults.length === 0 && (searchForm.prenom || searchForm.nom || searchForm.cne) && !searching && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Aucun patient trouvé avec ces critères de recherche.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Le patient que vous recherchez n'est peut-être pas encore enregistré dans le système.
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/medecin/walk-in-patient')}
            sx={{ fontWeight: 'bold' }}
          >
            Ajouter un patient sur place
          </Button>
        </Alert>
      )}

      {/* Doctor Assignment Dialog */}
      <Dialog 
        open={assignmentDialog.open} 
        onClose={() => setAssignmentDialog({ open: false, patient: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Assigner le Patient: {assignmentDialog.patient?.prenom} {assignmentDialog.patient?.nom}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Médecins à assigner *</InputLabel>
                <Select
                  multiple
                  value={assignmentForm.doctor_ids}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, doctor_ids: e.target.value }))}
                  label="Médecins à assigner *"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const doctor = doctors.find(d => d.id === value);
                        return (
                          <Chip 
                            key={value} 
                            label={doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : value}
                            size="small" 
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.prenom} {doctor.nom} - {doctor.specialite}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date d'assignation"
                type="datetime-local"
                value={assignmentForm.assignment_date}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, assignment_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Raison de l'assignation *"
                value={assignmentForm.assignment_reason}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, assignment_reason: e.target.value }))}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={assignmentForm.notes}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setAssignmentDialog({ open: false, patient: null })}
            disabled={assigning}
          >
            Annuler
          </Button>
          <Button 
            variant="contained"
            onClick={handleAssignmentSubmit}
            disabled={assigning}
            startIcon={assigning ? <CircularProgress size={20} /> : <AddIcon />}
            sx={{ fontWeight: 'bold' }}
          >
            {assigning ? 'Assignation...' : 'Assigner'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discharge Dialog */}
      <Dialog open={dischargeDialog.open} onClose={() => setDischargeDialog({ open: false, patient: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <ExitToApp sx={{ mr: 1 }} />
            Sortie du Patient
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Raison de sortie *"
                value={dischargeForm.discharge_reason}
                onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_reason: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes de sortie"
                multiline
                rows={4}
                value={dischargeForm.discharge_notes}
                onChange={(e) => setDischargeForm(prev => ({ ...prev, discharge_notes: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dischargeForm.follow_up_required}
                    onChange={(e) => setDischargeForm(prev => ({ ...prev, follow_up_required: e.target.checked }))}
                  />
                }
                label="Suivi requis"
              />
            </Grid>
            {dischargeForm.follow_up_required && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date de suivi"
                  type="date"
                  value={dischargeForm.follow_up_date}
                  onChange={(e) => setDischargeForm(prev => ({ ...prev, follow_up_date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDischargeDialog({ open: false, patient: null })}>
            Annuler
          </Button>
          <Button 
            onClick={handleDischargeSubmit} 
            variant="contained" 
            color="error"
            disabled={discharging}
            startIcon={discharging ? <CircularProgress size={20} /> : <ExitToApp />}
          >
            {discharging ? 'Sortie...' : 'Confirmer la sortie'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Medical Record Dialog */}
      <Dialog open={medicalRecordDialog.open} onClose={() => setMedicalRecordDialog({ open: false, patient: null, editing: false })} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <Assignment sx={{ mr: 1 }} />
            Dossier Médical - {medicalRecordDialog.patient?.prenom} {medicalRecordDialog.patient?.nom}
            <Button
              startIcon={<Edit />}
              onClick={() => setMedicalRecordDialog(prev => ({ ...prev, editing: !prev.editing }))}
              sx={{ ml: 'auto' }}
            >
              {medicalRecordDialog.editing ? 'Annuler' : 'Modifier'}
            </Button>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Allergies"
                multiline
                rows={3}
                value={medicalRecord.allergies}
                onChange={(e) => setMedicalRecord(prev => ({ ...prev, allergies: e.target.value }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Antécédents médicaux"
                multiline
                rows={3}
                value={medicalRecord.medical_history}
                onChange={(e) => setMedicalRecord(prev => ({ ...prev, medical_history: e.target.value }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Médicaments actuels"
                multiline
                rows={3}
                value={medicalRecord.current_medications}
                onChange={(e) => setMedicalRecord(prev => ({ ...prev, current_medications: e.target.value }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Constantes vitales</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tension artérielle"
                value={medicalRecord.vital_signs?.blood_pressure || ''}
                onChange={(e) => setMedicalRecord(prev => ({ 
                  ...prev, 
                  vital_signs: { ...prev.vital_signs, blood_pressure: e.target.value }
                }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fréquence cardiaque"
                value={medicalRecord.vital_signs?.heart_rate || ''}
                onChange={(e) => setMedicalRecord(prev => ({ 
                  ...prev, 
                  vital_signs: { ...prev.vital_signs, heart_rate: e.target.value }
                }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Température"
                value={medicalRecord.vital_signs?.temperature || ''}
                onChange={(e) => setMedicalRecord(prev => ({ 
                  ...prev, 
                  vital_signs: { ...prev.vital_signs, temperature: e.target.value }
                }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Poids (kg)"
                value={medicalRecord.vital_signs?.weight || ''}
                onChange={(e) => setMedicalRecord(prev => ({ 
                  ...prev, 
                  vital_signs: { ...prev.vital_signs, weight: e.target.value }
                }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Taille (cm)"
                value={medicalRecord.vital_signs?.height || ''}
                onChange={(e) => setMedicalRecord(prev => ({ 
                  ...prev, 
                  vital_signs: { ...prev.vital_signs, height: e.target.value }
                }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes médicales"
                multiline
                rows={4}
                value={medicalRecord.notes}
                onChange={(e) => setMedicalRecord(prev => ({ ...prev, notes: e.target.value }))}
                disabled={!medicalRecordDialog.editing}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMedicalRecordDialog({ open: false, patient: null, editing: false })}>
            Fermer
          </Button>
          {medicalRecordDialog.editing && (
            <Button 
              onClick={handleSaveMedicalRecord} 
              variant="contained"
              disabled={savingRecord}
              startIcon={savingRecord ? <CircularProgress size={20} /> : <Save />}
            >
              {savingRecord ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientSearchTab; 