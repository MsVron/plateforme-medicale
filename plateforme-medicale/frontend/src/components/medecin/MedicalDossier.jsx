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

const MedicalDossier = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dossier, setDossier] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    treatments: false,
    history: false,
    appointments: false,
    notes: false,
    analyses: false
  });
  
  // Dialog states
  const [treatmentDialog, setTreatmentDialog] = useState({ open: false, mode: 'add', data: null });
  const [historyDialog, setHistoryDialog] = useState({ open: false, data: null });
  const [noteDialog, setNoteDialog] = useState({ open: false, data: null });
  
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
    categorie: 'general'
  });
  
  // Autocomplete data
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  
  // Feedback states
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDossier();
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      categorie: 'general'
    });
    setNoteDialog({ open: true, data: null });
  };

  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/medecin/patients/${patientId}/notes`, noteForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: 'Note ajoutée avec succès',
        severity: 'success'
      });
      
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

  const { patient, allergies: patientAllergies, antecedents, traitements, consultations, constantes, appointments, notes, analyses, imageries, documents, summary } = dossier;

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
                {calculateAge(patient.date_naissance)} ans • {patient.sexe === 'M' ? 'Homme' : patient.sexe === 'F' ? 'Femme' : 'Autre'}
              </Typography>
              {patient.CNE && (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  CNE: {patient.CNE}
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
              label={`${summary.totalTreatments} traitements`}
              color="primary"
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
            <Chip
              icon={<AssignmentIcon />}
              label={`${summary.totalConsultations} consultations`}
              color="primary"
              variant="outlined"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
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
        {/* Personal Information Section */}
        <Accordion 
          expanded={expandedSections.personal} 
          onChange={() => handleSectionToggle('personal')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Informations Personnelles</Typography>
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
                      secondary={formatDate(patient.date_naissance)} 
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
                    {constantes[0].frequence_cardiaque && (
                      <Grid item xs={6} md={2}>
                        <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="body2">Pouls</Typography>
                          <Typography variant="h6">{constantes[0].frequence_cardiaque} bpm</Typography>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Treatments Section */}
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

        {/* Medical History Section */}
        <Accordion 
          expanded={expandedSections.history} 
          onChange={() => handleSectionToggle('history')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HistoryIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">Historique Médical</Typography>
                <Chip 
                  label={antecedents.length} 
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
            {/* Allergies */}
            {patientAllergies.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom color="error">
                  Allergies
                </Typography>
                <Grid container spacing={1}>
                  {patientAllergies.map((allergy, index) => (
                    <Grid item key={index}>
                      <Chip
                        icon={<WarningIcon />}
                        label={`${allergy.allergie_nom} (${allergy.severite})`}
                        color={allergy.severite === 'sévère' || allergy.severite === 'mortelle' ? 'error' : 'warning'}
                        variant="outlined"
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

        {/* Appointments Section */}
        <Accordion 
          expanded={expandedSections.appointments} 
          onChange={() => handleSectionToggle('appointments')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Rendez-vous</Typography>
              <Chip 
                label={appointments.length} 
                size="small" 
                color="info" 
                sx={{ ml: 2 }} 
              />
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

        {/* Notes Section */}
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
                <Chip 
                  label={notes.length} 
                  size="small" 
                  color="secondary" 
                  sx={{ ml: 2 }} 
                />
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
            {notes.length === 0 ? (
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
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Analyses Section */}
        <Accordion 
          expanded={expandedSections.analyses} 
          onChange={() => handleSectionToggle('analyses')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScienceIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Analyses et Examens</Typography>
              <Chip 
                label={analyses.length + imageries.length} 
                size="small" 
                color="info" 
                sx={{ ml: 2 }} 
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Analyses */}
              {analyses.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Analyses biologiques
                  </Typography>
                  <List dense>
                    {analyses.slice(0, 5).map((analyse) => (
                      <ListItem key={analyse.id}>
                        <ListItemText
                          primary={analyse.type_analyse}
                          secondary={
                            <Box>
                              <Typography variant="caption">
                                {formatDate(analyse.date_realisation || analyse.date_prescription)}
                              </Typography>
                              {analyse.est_normal !== null && (
                                <Chip 
                                  label={analyse.est_normal ? 'Normal' : 'Anormal'} 
                                  size="small" 
                                  color={analyse.est_normal ? 'success' : 'warning'}
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
              
              {/* Imageries */}
              {imageries.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Imagerie médicale
                  </Typography>
                  <List dense>
                    {imageries.slice(0, 5).map((imagerie) => (
                      <ListItem key={imagerie.id}>
                        <ListItemText
                          primary={imagerie.type_imagerie}
                          secondary={
                            <Typography variant="caption">
                              {formatDate(imagerie.date_realisation || imagerie.date_prescription)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>

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
        <DialogTitle>Ajouter une note médicale</DialogTitle>
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
            
            <Grid item xs={8}>
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
            
            <Grid item xs={4}>
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
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

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