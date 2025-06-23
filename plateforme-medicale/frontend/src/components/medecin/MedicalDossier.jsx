import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Alert, Button, Divider, Grid, Card, CardContent,
  List, ListItem, ListItemText, Chip, IconButton, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Autocomplete,
  Snackbar, Badge, Avatar, Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  History as HistoryIcon,
  Medication as MedicationIcon,
  NoteAdd as NoteIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  Image as ImageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  DateRange as DateIcon,
  Bloodtype as BloodIcon,
  Height as HeightIcon,
  Scale as WeightIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import AnalysisRequestSection from './AnalysisRequestSection';
import PatientProfileEditor from './PatientProfileEditor';
import WeightHeightHistory from './WeightHeightHistory';
import { formatDate, formatDateTime } from '../../utils/dateUtils';

const MedicalDossier = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dossier, setDossier] = useState(null);
  const [currentMedecinId, setCurrentMedecinId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,        // Only personal information expanded by default
    treatments: false,     // Current medications
    history: false,        // Allergies and medical history
    analyses: false,       // Recent test results
    measurements: false,   // Vital signs tracking
    notes: false,          // Clinical observations
    appointments: false,   // Scheduling information
    hospitalAdmissions: false // Hospital admissions history
  });
  
  // Dialog states
  const [treatmentDialog, setTreatmentDialog] = useState({ open: false, mode: 'add', data: null });
  const [historyDialog, setHistoryDialog] = useState({ open: false, data: null });
  const [noteDialog, setNoteDialog] = useState({ open: false, data: null });
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [followUpDialog, setFollowUpDialog] = useState({ open: false });
  
  // Form states
  const [treatmentForm, setTreatmentForm] = useState({
    nom_medicament: '',
    medicament_id: null,
    posologie: '',
    date_debut: '',
    date_fin: '',
    est_permanent: false,
    instructions: '',
    rappel_prise: false,
    frequence_rappel: ''
  });
  
  const [historyForm, setHistoryForm] = useState({
    type: 'medical',
    description: '',
    date_debut: '',
    date_fin: '',
    est_chronique: false
  });
  
  const [noteForm, setNoteForm] = useState({
    contenu: '',
    est_important: false,
    categorie: 'general',
    date_note: new Date().toISOString().split('T')[0]
  });

  const [followUpForm, setFollowUpForm] = useState({
    date: '',
    time: '',
    duration: 30,
    motif: '',
    notes_medecin: ''
  });
  
  // Autocomplete data
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  
  // Feedback states
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDossier();
    getCurrentMedecinId();
  }, [patientId]);

  const fetchDossier = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/medecin/patients/${patientId}/dossier`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDossier(response.data);
    } catch (err) {
      console.error('Error fetching medical dossier:', err);
      setError(err.response?.data?.message || 'Impossible de récupérer le dossier médical. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMedecinId = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/medecin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentMedecinId(response.data.medecin.id);
    } catch (err) {
      console.error('Error getting current medecin ID:', err);
    }
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  // Treatment management functions
  const handleAddTreatment = () => {
    setTreatmentForm({
      nom_medicament: '',
      medicament_id: null,
      posologie: '',
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: '',
      est_permanent: false,
      instructions: '',
      rappel_prise: false,
      frequence_rappel: ''
    });
    setTreatmentDialog({ open: true, mode: 'add', data: null });
  };

  const handleEditTreatment = (treatment) => {
    setTreatmentForm({
      nom_medicament: treatment.nom_commercial || treatment.nom_molecule,
      medicament_id: treatment.medicament_id,
      posologie: treatment.posologie,
      date_debut: treatment.date_debut ? treatment.date_debut.split('T')[0] : '',
      date_fin: treatment.date_fin ? treatment.date_fin.split('T')[0] : '',
      est_permanent: treatment.est_permanent,
      instructions: treatment.instructions || '',
      rappel_prise: treatment.rappel_prise || false,
      frequence_rappel: treatment.frequence_rappel || ''
    });
    setTreatmentDialog({ open: true, mode: 'edit', data: treatment });
  };

  const handleSaveTreatment = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = treatmentDialog.mode === 'add' 
        ? `/medecin/patients/${patientId}/treatments`
        : `/medecin/patients/${patientId}/treatments/${treatmentDialog.data.id}`;
      
      const method = treatmentDialog.mode === 'add' ? 'post' : 'put';
      
      await axios[method](url, treatmentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: `Traitement ${treatmentDialog.mode === 'add' ? 'ajouté' : 'modifié'} avec succès`,
        severity: 'success'
      });
      
      setTreatmentDialog({ open: false, mode: 'add', data: null });
      fetchDossier(); // Refresh data
    } catch (err) {
      console.error('Error saving treatment:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erreur lors de la sauvegarde du traitement',
        severity: 'error'
      });
    }
  };

  const handleDeleteTreatment = async (treatmentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce traitement ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/medecin/patients/${patientId}/treatments/${treatmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: 'Traitement supprimé avec succès',
        severity: 'success'
      });
      
      fetchDossier(); // Refresh data
    } catch (err) {
      console.error('Error deleting treatment:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erreur lors de la suppression du traitement',
        severity: 'error'
      });
    }
  };

  // Medical history management
  const handleAddHistory = () => {
    setHistoryForm({
      type: 'medical',
      description: '',
      date_debut: '',
      date_fin: '',
      est_chronique: false
    });
    setHistoryDialog({ open: true, data: null });
  };

  const handleSaveHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/medecin/patients/${patientId}/medical-history`, historyForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: 'Antécédent médical ajouté avec succès',
        severity: 'success'
      });
      
      setHistoryDialog({ open: false, data: null });
      fetchDossier(); // Refresh data
    } catch (err) {
      console.error('Error saving medical history:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erreur lors de la sauvegarde de l\'antécédent médical',
        severity: 'error'
      });
    }
  };

  // Note management
  const handleAddNote = () => {
    setNoteForm({
      contenu: '',
      est_important: false,
      categorie: 'general',
      date_note: new Date().toISOString().split('T')[0]
    });
    setNoteDialog({ open: true, data: null });
  };

  const handleEditNote = (note) => {
    setNoteForm({
      contenu: note.contenu,
      est_important: note.est_important,
      categorie: note.categorie,
      date_note: note.date_creation ? note.date_creation.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setNoteDialog({ open: true, data: note });
  };

  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (noteDialog.data) {
        // Edit existing note
        await axios.put(`/medecin/patients/${patientId}/notes/${noteDialog.data.id}`, noteForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Note modifiée avec succès',
          severity: 'success'
        });
      } else {
        // Add new note
        await axios.post(`/medecin/patients/${patientId}/notes`, noteForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Note ajoutée avec succès',
          severity: 'success'
        });
      }
      
      setNoteDialog({ open: false, data: null });
      fetchDossier(); // Refresh data
    } catch (err) {
      console.error('Error saving note:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erreur lors de la sauvegarde de la note',
        severity: 'error'
      });
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/medecin/patients/${patientId}/notes/${noteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({
          open: true,
          message: 'Note supprimée avec succès',
          severity: 'success'
        });
        fetchDossier(); // Refresh data
      } catch (err) {
        console.error('Error deleting note:', err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Erreur lors de la suppression de la note',
          severity: 'error'
        });
      }
    }
  };

  // Medication search for autocomplete
  const searchMedications = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/medecin/medications/search?search=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(response.data.medications || []);
    } catch (err) {
      console.error('Error searching medications:', err);
    }
  };

  // Profile editor handlers
  const handleEditProfile = () => {
    setProfileEditorOpen(true);
  };

  const handleProfileSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
    fetchDossier(); // Refresh the dossier to show updated information
  };

  const handleProfileError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  // Follow-up appointment functions
  const handleOpenFollowUpDialog = () => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFollowUpForm({
      date: tomorrow.toISOString().split('T')[0],
      time: '09:00',
      duration: 30,
      motif: 'Rendez-vous de suivi',
      notes_medecin: ''
    });
    setFollowUpDialog({ open: true });
  };

  const handleSaveFollowUpAppointment = async () => {
    try {
      if (!followUpForm.date || !followUpForm.time || !followUpForm.motif) {
        setSnackbar({ 
          open: true, 
          message: 'Date, heure et motif sont requis', 
          severity: 'error' 
        });
        return;
      }

      // Create datetime objects
      const appointmentDateTime = new Date(`${followUpForm.date}T${followUpForm.time}`);
      const endDateTime = new Date(appointmentDateTime.getTime() + followUpForm.duration * 60000);

      const token = localStorage.getItem('token');
      await axios.post(`/medecin/patients/${patientId}/follow-up-appointment`, {
        date_heure_debut: appointmentDateTime.toISOString(),
        date_heure_fin: endDateTime.toISOString(),
        motif: followUpForm.motif,
        notes_medecin: followUpForm.notes_medecin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({ 
        open: true, 
        message: 'Rendez-vous de suivi créé avec succès', 
        severity: 'success' 
      });
      
      setFollowUpDialog({ open: false });
      
      // Reset form
      setFollowUpForm({
        date: '',
        time: '',
        duration: 30,
        motif: '',
        notes_medecin: ''
      });

      // Refresh dossier to show new appointment
      fetchDossier();
      
    } catch (err) {
      console.error('Error creating follow-up appointment:', err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Erreur lors de la création du rendez-vous de suivi', 
        severity: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dossier) {
    return (
      <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
        Aucune information disponible pour ce patient.
      </Alert>
    );
  }

  const { 
    patient, 
    allergies: patientAllergies = [], 
    antecedents = [], 
    traitements = [], 
    consultations = [], 
    constantes = [], 
    appointments = [], 
    notes = [], 
    analyses = [], 
    imageries = [], 
    documents = [], 
    hospitalAdmissions = [],
    summary 
  } = dossier;

  // Debug logging
  console.log('Notes data:', notes);
  console.log('Notes length:', notes ? notes.length : 'undefined');
  console.log('Hospital admissions data:', hospitalAdmissions);
  console.log('Hospital admissions count:', hospitalAdmissions ? hospitalAdmissions.length : 'undefined');
  console.log('Summary data:', summary);
  console.log('Appointments count:', summary?.appointmentsPastYear, summary?.totalAppointments);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header with patient info and alerts */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <PersonIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {patient.prenom} {patient.nom}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {calculateAge(patient.date_naissance)} ans • {patient.sexe === 'M' ? 'Homme' : 'Femme'}
              </Typography>
              {patient.CNE && (
                <Typography variant="body2" color="textSecondary">
                  CIN: {patient.CNE}
                </Typography>
              )}
            </Box>
          </Box>
          
          {/* Alert badges */}
          <Stack direction="row" spacing={1}>
            {summary.hasActiveAlerts && (
              <Badge badgeContent={patientAllergies.filter(a => a.severite === 'sévère' || a.severite === 'mortelle').length} color="error">
                <Chip
                  icon={<WarningIcon />}
                  label="Allergies sévères"
                  color="error"
                  variant="filled"
                />
              </Badge>
            )}
            <Chip
              icon={<MedicalIcon />}
              label={`${summary.totalTreatments || 0} traitements`}
              color="primary"
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
            <Chip
              icon={<AssignmentIcon />}
              label={
                summary.appointmentsPastYear > 0 
                  ? `${summary.appointmentsPastYear} rendez-vous (1 an)` 
                  : `${summary.totalAppointments || 0} rendez-vous`
              }
              color="primary"
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
            {summary.totalConsultations > 0 && (
              <Chip
                icon={<MedicalIcon />}
                label={`${summary.totalConsultations} consultations`}
                color="secondary"
                variant="outlined"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
            )}
          </Stack>
        </Box>
        
        {/* Quick contact info */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {patient.telephone && (
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{patient.telephone}</Typography>
              </Box>
            </Grid>
          )}
          {patient.email && (
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{patient.email}</Typography>
              </Box>
            </Grid>
          )}
          {patient.ville && (
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{patient.ville}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Medical Dossier Sections */}
      <Box sx={{ width: '100%' }}>
        {/* 1. Personal Information Section - FIRST (Administrative details) */}
        <Accordion 
          expanded={expandedSections.personal} 
          onChange={() => handleSectionToggle('personal')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Informations Personnelles</Typography>
              </Box>
              <IconButton 
                color="primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProfile();
                }}
                sx={{ mr: 2 }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Informations de base
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Date de naissance" 
                      secondary={`${formatDate(patient.date_naissance)} (${calculateAge(patient.date_naissance)} ans)`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="CIN"
                      secondary={patient.CNE || 'Non renseigné'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Groupe sanguin" 
                      secondary={patient.groupe_sanguin || 'Non renseigné'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Profession" 
                      secondary={patient.profession || 'Non renseignée'} 
                    />
                  </ListItem>
                  {patient.a_handicap && (
                    <ListItem>
                      <ListItemText 
                        primary="Situation de handicap" 
                        secondary={
                          <Box>
                            <Chip 
                              size="small" 
                              color="info" 
                              label={`${
                                patient.type_handicap === 'autre' 
                                  ? (patient.type_handicap_autre || 'Autre (non précisé)') 
                                  : (patient.type_handicap || 'Non spécifié')
                              } - ${patient.niveau_handicap || 'Non spécifié'}`}
                              sx={{ mr: 1, mb: 1 }}
                            />
                            {patient.autonomie_niveau && (
                              <Chip 
                                size="small" 
                                color="secondary" 
                                label={`Autonomie: ${patient.autonomie_niveau.replace('_', ' ')}`}
                                sx={{ mr: 1, mb: 1 }}
                              />
                            )}
                            {patient.description_handicap && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {patient.description_handicap}
                              </Typography>
                            )}
                          </Box>
                        } 
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Informations de contact
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Adresse" 
                      secondary={patient.adresse || 'Non renseignée'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Ville" 
                      secondary={`${patient.ville || 'Non renseignée'}${patient.code_postal ? ` (${patient.code_postal})` : ''}`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Pays" 
                      secondary={patient.pays || 'Non renseigné'} 
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contact d'urgence
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Nom" 
                      secondary={patient.contact_urgence_nom || 'Non renseigné'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Téléphone" 
                      secondary={patient.contact_urgence_telephone || 'Non renseigné'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Relation" 
                      secondary={patient.contact_urgence_relation || 'Non renseignée'} 
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Habitudes de vie
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Consommation d'alcool" 
                      secondary={patient.consommation_alcool || 'Non renseigné'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Activité physique" 
                      secondary={patient.activite_physique || 'Non renseigné'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Fumeur" 
                      secondary={
                        patient.est_fumeur === true || patient.est_fumeur === 1 ? 'Oui' : 
                        patient.est_fumeur === false || patient.est_fumeur === 0 ? 'Non' : 
                        'Non renseigné'
                      } 
                    />
                  </ListItem>
                </List>
              </Grid>

              {/* Allergy Notes */}
              {patient.allergies_notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notes sur les allergies
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    p: 2, 
                    bgcolor: 'warning.light', 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'warning.main'
                  }}>
                    {patient.allergies_notes}
                  </Typography>
                </Grid>
              )}

              {/* Accessibility and Medical Equipment */}
              {patient.a_handicap && (patient.besoins_accessibilite || patient.equipements_medicaux) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Besoins spéciaux
                  </Typography>
                  <Grid container spacing={2}>
                    {patient.besoins_accessibilite && (
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom color="info.main">
                            Besoins d'accessibilité
                          </Typography>
                          <Typography variant="body2">
                            {patient.besoins_accessibilite}
                          </Typography>
                        </Card>
                      </Grid>
                    )}
                    {patient.equipements_medicaux && (
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom color="info.main">
                            Équipements médicaux
                          </Typography>
                          <Typography variant="body2">
                            {patient.equipements_medicaux}
                          </Typography>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
              
              {/* Latest vital signs */}
              {constantes && constantes.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Dernières constantes vitales ({formatDate(constantes[0].date_mesure)})
                  </Typography>
                  <Grid container spacing={2}>
                    {constantes[0].poids && (
                      <Grid item xs={6} md={2}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                          <WeightIcon color="primary" />
                          <Typography variant="body2">Poids</Typography>
                          <Typography variant="h6">{constantes[0].poids} kg</Typography>
                        </Card>
                      </Grid>
                    )}
                    {constantes[0].taille && (
                      <Grid item xs={6} md={2}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                          <HeightIcon color="primary" />
                          <Typography variant="body2">Taille</Typography>
                          <Typography variant="h6">{constantes[0].taille} cm</Typography>
                        </Card>
                      </Grid>
                    )}
                    {constantes[0].imc && (
                      <Grid item xs={6} md={2}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="body2">IMC</Typography>
                          <Typography variant="h6">{constantes[0].imc}</Typography>
                        </Card>
                      </Grid>
                    )}
                    {constantes[0].tension_arterielle_systolique && constantes[0].tension_arterielle_diastolique && (
                      <Grid item xs={6} md={2}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                          <BloodIcon color="error" />
                          <Typography variant="body2">Tension</Typography>
                          <Typography variant="h6">
                            {constantes[0].tension_arterielle_systolique}/{constantes[0].tension_arterielle_diastolique}
                          </Typography>
                        </Card>
                      </Grid>
                    )}
                    {constantes[0].temperature && (
                      <Grid item xs={6} md={2}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="body2">Température</Typography>
                          <Typography variant="h6">{constantes[0].temperature}°C</Typography>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 2. Treatments Section - Current medications */}
        <Accordion 
          expanded={expandedSections.treatments} 
          onChange={() => handleSectionToggle('treatments')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicationIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Traitements en cours</Typography>
                <Chip 
                  label={traitements.length} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }} 
                />
              </Box>
              <IconButton 
                color="primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddTreatment();
                }}
                sx={{ mr: 2 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {traitements.length === 0 ? (
              <Typography color="text.secondary">Aucun traitement en cours</Typography>
            ) : (
              <Grid container spacing={2}>
                {traitements.map((treatment) => (
                  <Grid item xs={12} md={6} key={treatment.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" color="primary">
                              {treatment.nom_commercial || treatment.nom_molecule}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {treatment.posologie}
                            </Typography>
                            <Typography variant="body2">
                              Du {formatDate(treatment.date_debut)} 
                              {treatment.date_fin ? ` au ${formatDate(treatment.date_fin)}` : ' (permanent)'}
                            </Typography>
                            {treatment.instructions && (
                              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                {treatment.instructions}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              Prescrit par Dr. {treatment.medecin_prenom} {treatment.medecin_nom}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditTreatment(treatment)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteTreatment(treatment.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 3. Medical History & Allergies Section - CRITICAL FOR SAFETY */}
        <Accordion 
          expanded={expandedSections.history} 
          onChange={() => handleSectionToggle('history')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HistoryIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Historique Médical & Allergies</Typography>
                <Chip 
                  label={antecedents.length + patientAllergies.length} 
                  size="small" 
                  color="secondary" 
                  sx={{ ml: 2 }} 
                />
              </Box>
              <IconButton 
                color="primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddHistory();
                }}
                sx={{ mr: 2 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {/* Allergies - Show first as they're critical for safety */}
            {patientAllergies.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon sx={{ mr: 1 }} />
                  Allergies (CRITIQUE)
                </Typography>
                <Grid container spacing={1}>
                  {patientAllergies.map((allergy, index) => (
                    <Grid item key={index}>
                      <Chip
                        icon={<WarningIcon />}
                        label={`${allergy.allergie_nom} (${allergy.severite})`}
                        color={allergy.severite === 'sévère' || allergy.severite === 'mortelle' ? 'error' : 'warning'}
                        variant="outlined"
                        size="medium"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Medical History */}
            {antecedents.length === 0 ? (
              <Typography color="text.secondary">Aucun antécédent médical enregistré</Typography>
            ) : (
              <List>
                {antecedents.map((antecedent) => (
                  <ListItem key={antecedent.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={antecedent.type} 
                            size="small" 
                            color={antecedent.type === 'medical' ? 'primary' : antecedent.type === 'chirurgical' ? 'secondary' : 'default'}
                            sx={{ mr: 1 }}
                          />
                          {antecedent.est_chronique && (
                            <Chip label="Chronique" size="small" color="warning" sx={{ mr: 1 }} />
                          )}
                          <Typography variant="body1">{antecedent.description}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          {antecedent.date_debut && (
                            <Typography variant="caption">
                              Début: {formatDate(antecedent.date_debut)}
                              {antecedent.date_fin && ` - Fin: ${formatDate(antecedent.date_fin)}`}
                            </Typography>
                          )}
                          {antecedent.medecin_prenom && (
                            <Typography variant="caption" display="block">
                              Enregistré par Dr. {antecedent.medecin_prenom} {antecedent.medecin_nom}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 4. Analysis Requests Section - Request test results */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <AnalysisRequestSection 
            patientId={patientId}
            analyses={analyses}
            imagingResults={imageries}
            onRefresh={fetchDossier}
          />
        </Paper>

        {/* 5. Weight/Height History Section - Vital signs tracking */}
        <Accordion 
          expanded={expandedSections.measurements} 
          onChange={() => handleSectionToggle('measurements')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WeightIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Historique Poids/Taille</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <WeightHeightHistory 
              patientId={patientId}
              onSuccess={handleProfileSuccess}
              onError={handleProfileError}
            />
          </AccordionDetails>
        </Accordion>

        {/* 6. Notes Section - Clinical observations */}
        <Accordion 
          expanded={expandedSections.notes} 
          onChange={() => handleSectionToggle('notes')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NoteIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Notes Médicales</Typography>
                {notes && notes.length > 0 && (
                  <Chip 
                    label={notes.length} 
                    size="small" 
                    color="secondary" 
                    sx={{ ml: 2 }} 
                  />
                )}
              </Box>
              <IconButton 
                color="primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNote();
                }}
                sx={{ mr: 2 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {!notes || notes.length === 0 ? (
              <Typography color="text.secondary">Aucune note médicale</Typography>
            ) : (
              <List>
                {notes.map((note) => (
                  <ListItem key={note.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {note.est_important && (
                            <WarningIcon color="warning" sx={{ mr: 1 }} />
                          )}
                          <Typography variant="body1">{note.contenu}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption">
                            {formatDateTime(note.date_creation)} - Dr. {note.medecin_prenom} {note.medecin_nom}
                          </Typography>
                          <Chip 
                            label={note.categorie} 
                            size="small" 
                            variant="outlined" 
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                    />
                    {/* Show edit/delete buttons only if current doctor created the note */}
                    {currentMedecinId && note.medecin_id === currentMedecinId && (
                      <Box sx={{ ml: 2 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditNote(note)}
                          title="Modifier la note"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteNote(note.id)}
                          title="Supprimer la note"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 7. Appointments Section - Scheduling information */}
        <Accordion 
          expanded={expandedSections.appointments} 
          onChange={() => handleSectionToggle('appointments')}
          sx={{ mb: 2 }}
        >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Rendez-vous</Typography>
              {appointments && appointments.length > 0 && (
                <Chip 
                  label={appointments.length} 
                  size="small" 
                  color="info" 
                  sx={{ ml: 2 }} 
                />
              )}
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={(e) => {
                e.stopPropagation(); // Prevent accordion from toggling
                handleOpenFollowUpDialog();
              }}
              sx={{ mr: 3 }}
            >
              Rendez-vous de suivi
            </Button>
          </Box>
        </AccordionSummary>
          <AccordionDetails>
            {appointments.length === 0 ? (
              <Typography color="text.secondary">Aucun rendez-vous enregistré</Typography>
            ) : (
              <List>
                {appointments.slice(0, 10).map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body1">{appointment.motif}</Typography>
                          <Chip 
                            label={appointment.statut} 
                            size="small" 
                            color={
                              appointment.statut === 'terminé' ? 'success' :
                              appointment.statut === 'confirmé' ? 'primary' :
                              appointment.statut === 'annulé' ? 'error' : 'default'
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {formatDateTime(appointment.date_heure_debut)}
                          </Typography>
                          <Typography variant="caption">
                            Dr. {appointment.medecin_prenom} {appointment.medecin_nom}
                            {appointment.specialite_nom && ` - ${appointment.specialite_nom}`}
                          </Typography>
                          {appointment.institution_nom && (
                            <Typography variant="caption" display="block">
                              {appointment.institution_nom}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>

        {/* 8. Hospital Admissions Section - Hospital admission history */}
        <Accordion 
          expanded={expandedSections.hospitalAdmissions} 
          onChange={() => handleSectionToggle('hospitalAdmissions')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HospitalIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Historique Hospitalier</Typography>
              {hospitalAdmissions && hospitalAdmissions.length > 0 && (
                <Chip 
                  label={hospitalAdmissions.length} 
                  size="small" 
                  color="warning" 
                  sx={{ ml: 2 }} 
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {hospitalAdmissions.length === 0 ? (
              <Typography color="text.secondary">Aucune hospitalisation enregistrée</Typography>
            ) : (
              <List>
                {hospitalAdmissions.map((admission) => (
                  <ListItem key={admission.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {admission.admission_reason}
                          </Typography>
                          <Chip 
                            label={admission.status === 'active' ? 'En cours' : 
                                  admission.status === 'discharged' ? 'Sortie' : 
                                  admission.status === 'transferred' ? 'Transféré' : admission.status} 
                            size="small" 
                            color={
                              admission.status === 'active' ? 'warning' :
                              admission.status === 'discharged' ? 'success' :
                              admission.status === 'transferred' ? 'info' : 'default'
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <strong>Admission:</strong> {formatDateTime(admission.admission_date)}
                              </Typography>
                              {admission.discharge_date && (
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <strong>Sortie:</strong> {formatDateTime(admission.discharge_date)}
                                </Typography>
                              )}
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <strong>Durée:</strong> {admission.duration_days} jour{admission.duration_days > 1 ? 's' : ''}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <strong>Hôpital:</strong> {admission.hospital_name}
                                {admission.hospital_city && ` - ${admission.hospital_city}`}
                              </Typography>
                              {admission.primary_doctor && (
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <strong>Médecin:</strong> Dr. {admission.primary_doctor}
                                  {admission.primary_doctor_specialty && ` (${admission.primary_doctor_specialty})`}
                                </Typography>
                              )}
                              {admission.ward_name && (
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <strong>Service:</strong> {admission.ward_name}
                                  {admission.bed_number && ` - Lit ${admission.bed_number}`}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                          {admission.discharge_reason && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                              <strong>Motif de sortie:</strong> {admission.discharge_reason}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Follow-up Appointment Dialog */}
      <Dialog 
        open={followUpDialog.open} 
        onClose={() => setFollowUpDialog({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DateIcon sx={{ mr: 1, color: 'primary.main' }} />
            Programmer un rendez-vous de suivi
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Date du rendez-vous *"
                type="date"
                value={followUpForm.date}
                onChange={(e) => setFollowUpForm(prev => ({ ...prev, date: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0] // Minimum date is today
                }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Heure *"
                type="time"
                value={followUpForm.time}
                onChange={(e) => setFollowUpForm(prev => ({ ...prev, time: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Durée (minutes)"
                type="number"
                value={followUpForm.duration}
                onChange={(e) => setFollowUpForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                fullWidth
                inputProps={{
                  min: 15,
                  max: 180,
                  step: 15
                }}
                helperText="Durée en minutes (15-180 min, par pas de 15)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Motif du rendez-vous *"
                value={followUpForm.motif}
                onChange={(e) => setFollowUpForm(prev => ({ ...prev, motif: e.target.value }))}
                fullWidth
                placeholder="ex: Contrôle post-consultation, Suivi traitement..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Notes médicales"
                value={followUpForm.notes_medecin}
                onChange={(e) => setFollowUpForm(prev => ({ ...prev, notes_medecin: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                placeholder="Notes internes pour le suivi du patient..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setFollowUpDialog({ open: false })}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveFollowUpAppointment}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!followUpForm.date || !followUpForm.time || !followUpForm.motif}
          >
            Programmer le rendez-vous
          </Button>
        </DialogActions>
      </Dialog>

      {/* Treatment Dialog */}
      <Dialog 
        open={treatmentDialog.open} 
        onClose={() => setTreatmentDialog({ open: false, mode: 'add', data: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {treatmentDialog.mode === 'add' ? 'Ajouter un traitement' : 'Modifier le traitement'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={medications}
                getOptionLabel={(option) => typeof option === 'string' ? option : `${option.nom_commercial} (${option.nom_molecule})`}
                value={treatmentForm.nom_medicament}
                onInputChange={(event, newValue) => {
                  setTreatmentForm(prev => ({ ...prev, nom_medicament: newValue }));
                  if (newValue && newValue.length >= 2) {
                    searchMedications(newValue);
                  }
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'object' && newValue) {
                    setTreatmentForm(prev => ({ 
                      ...prev, 
                      nom_medicament: newValue.nom_commercial,
                      medicament_id: newValue.id 
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Médicament *"
                    placeholder="Rechercher un médicament..."
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Posologie *"
                value={treatmentForm.posologie}
                onChange={(e) => setTreatmentForm(prev => ({ ...prev, posologie: e.target.value }))}
                fullWidth
                placeholder="ex: 1 comprimé matin et soir"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Date de début *"
                type="date"
                value={treatmentForm.date_debut}
                onChange={(e) => setTreatmentForm(prev => ({ ...prev, date_debut: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Date de fin"
                type="date"
                value={treatmentForm.date_fin}
                onChange={(e) => setTreatmentForm(prev => ({ ...prev, date_fin: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={treatmentForm.est_permanent}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={treatmentForm.est_permanent}
                    onChange={(e) => setTreatmentForm(prev => ({ 
                      ...prev, 
                      est_permanent: e.target.checked,
                      date_fin: e.target.checked ? '' : prev.date_fin
                    }))}
                  />
                }
                label="Traitement permanent"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Instructions"
                value={treatmentForm.instructions}
                onChange={(e) => setTreatmentForm(prev => ({ ...prev, instructions: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                placeholder="Instructions particulières pour le patient..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setTreatmentDialog({ open: false, mode: 'add', data: null })}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveTreatment}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!treatmentForm.nom_medicament || !treatmentForm.posologie || !treatmentForm.date_debut}
          >
            {treatmentDialog.mode === 'add' ? 'Ajouter' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Medical History Dialog */}
      <Dialog 
        open={historyDialog.open} 
        onClose={() => setHistoryDialog({ open: false, data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ajouter un antécédent médical</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type d'antécédent *</InputLabel>
                <Select
                  value={historyForm.type}
                  onChange={(e) => setHistoryForm(prev => ({ ...prev, type: e.target.value }))}
                  label="Type d'antécédent *"
                >
                  <MenuItem value="medical">Médical</MenuItem>
                  <MenuItem value="chirurgical">Chirurgical</MenuItem>
                  <MenuItem value="familial">Familial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description *"
                value={historyForm.description}
                onChange={(e) => setHistoryForm(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                placeholder="Décrivez l'antécédent médical..."
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Date de début"
                type="date"
                value={historyForm.date_debut}
                onChange={(e) => setHistoryForm(prev => ({ ...prev, date_debut: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Date de fin"
                type="date"
                value={historyForm.date_fin}
                onChange={(e) => setHistoryForm(prev => ({ ...prev, date_fin: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={historyForm.est_chronique}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={historyForm.est_chronique}
                    onChange={(e) => setHistoryForm(prev => ({ 
                      ...prev, 
                      est_chronique: e.target.checked,
                      date_fin: e.target.checked ? '' : prev.date_fin
                    }))}
                  />
                }
                label="Condition chronique"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setHistoryDialog({ open: false, data: null })}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveHistory}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!historyForm.type || !historyForm.description}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Note Dialog */}
      <Dialog 
        open={noteDialog.open} 
        onClose={() => setNoteDialog({ open: false, data: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {noteDialog.data ? 'Modifier la note médicale' : 'Ajouter une note médicale'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Contenu de la note *"
                value={noteForm.contenu}
                onChange={(e) => setNoteForm(prev => ({ ...prev, contenu: e.target.value }))}
                fullWidth
                multiline
                rows={4}
                placeholder="Rédigez votre note médicale..."
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Date de la note"
                type="date"
                value={noteForm.date_note}
                onChange={(e) => setNoteForm(prev => ({ ...prev, date_note: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={noteForm.categorie}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, categorie: e.target.value }))}
                  label="Catégorie"
                >
                  <MenuItem value="general">Général</MenuItem>
                  <MenuItem value="diagnostic">Diagnostic</MenuItem>
                  <MenuItem value="traitement">Traitement</MenuItem>
                  <MenuItem value="suivi">Suivi</MenuItem>
                  <MenuItem value="urgence">Urgence</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noteForm.est_important}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, est_important: e.target.checked }))}
                  />
                }
                label="Important"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setNoteDialog({ open: false, data: null })}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveNote}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!noteForm.contenu}
          >
            {noteDialog.data ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient Profile Editor */}
      <PatientProfileEditor
        open={profileEditorOpen}
        onClose={() => setProfileEditorOpen(false)}
        patient={patient}
        onSuccess={handleProfileSuccess}
        onError={handleProfileError}
      />

      {/* Snackbar for feedback */}
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
  );
};

export default MedicalDossier; 