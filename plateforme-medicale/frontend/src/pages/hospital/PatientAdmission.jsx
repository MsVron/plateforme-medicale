import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  EventNote as EventIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
  Save as SaveIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import hospitalService from '../../services/hospitalService';

const PatientAdmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPatient = location.state?.patient;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [existingAdmissionDialog, setExistingAdmissionDialog] = useState({ open: false, admission: null });

  const [admissionForm, setAdmissionForm] = useState({
    patient_id: selectedPatient?.id || null,
    patient: selectedPatient || null,
    admission_date: new Date(),
    reason: '',
    reason_type: 'emergency',
    department: '',
    notes: '',
    emergency_contact: '',
    medical_history: '',
    current_medications: '',
    allergies: '',
    insurance_info: ''
  });

  const reasonTypes = [
    { value: 'emergency', label: 'Urgence', color: 'error' },
    { value: 'surgery', label: 'Chirurgie', color: 'warning' },
    { value: 'treatment', label: 'Traitement', color: 'info' },
    { value: 'observation', label: 'Observation', color: 'default' }
  ];

  const departments = [
    'Cardiologie',
    'Neurologie',
    'Orthopédie',
    'Pédiatrie',
    'Gynécologie',
    'Urgences',
    'Chirurgie générale',
    'Médecine interne',
    'Pneumologie',
    'Gastro-entérologie'
  ];

  const steps = [
    {
      label: 'Informations Patient',
      description: 'Vérification des données patient',
      icon: <PersonIcon />
    },
    {
      label: 'Détails Admission',
      description: 'Date, motif et département',
      icon: <EventIcon />
    },
    {
      label: 'Confirmation',
      description: 'Révision et validation',
      icon: <CheckIcon />
    }
  ];

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

  const handleInputChange = (field, value) => {
    setAdmissionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!admissionForm.patient) {
          setSnackbar({ open: true, message: 'Aucun patient sélectionné', severity: 'error' });
          return false;
        }
        return true;
      case 1:
        if (!admissionForm.reason.trim()) {
          setSnackbar({ open: true, message: 'Le motif d\'admission est requis', severity: 'error' });
          return false;
        }
        if (!admissionForm.department) {
          setSnackbar({ open: true, message: 'Le département est requis', severity: 'error' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!admissionForm.patient_id || !admissionForm.reason) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs requis', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await hospitalService.admitPatient(admissionForm.patient_id, {
        admission_date: admissionForm.admission_date.toISOString(),
        reason: admissionForm.reason,
        reason_type: admissionForm.reason_type,
        department: admissionForm.department,
        notes: admissionForm.notes,
        emergency_contact: admissionForm.emergency_contact,
        medical_history: admissionForm.medical_history,
        current_medications: admissionForm.current_medications,
        allergies: admissionForm.allergies,
        insurance_info: admissionForm.insurance_info
      });

      setSnackbar({ open: true, message: 'Patient admis avec succès!', severity: 'success' });
      
      // Navigate back to admissions list after a short delay
      setTimeout(() => {
        navigate('/hospital/admissions');
      }, 2000);
    } catch (error) {
      console.error('Error admitting patient:', error);
      
      // Check if it's a duplicate admission error
      if (error.response?.data?.existingAdmission) {
        const existing = error.response.data.existingAdmission;
        setExistingAdmissionDialog({ open: true, admission: existing });
      } else {
        const errorMessage = error.response?.data?.message || 'Erreur lors de l\'admission';
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              {admissionForm.patient ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {admissionForm.patient.prenom} {admissionForm.patient.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patient sélectionné pour admission
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><BadgeIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="CIN" 
                            secondary={admissionForm.patient.CNE || 'Non renseigné'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CakeIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Âge" 
                            secondary={`${calculateAge(admissionForm.patient.date_naissance)} ans`} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Sexe" 
                            secondary={admissionForm.patient.sexe === 'M' ? 'Homme' : 'Femme'} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Téléphone" 
                            secondary={admissionForm.patient.telephone || 'Non renseigné'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Email" 
                            secondary={admissionForm.patient.email || 'Non renseigné'} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><LocationIcon color="primary" /></ListItemIcon>
                          <ListItemText 
                            primary="Adresse" 
                            secondary={admissionForm.patient.adresse || 'Non renseignée'} 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PersonAddIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Aucun patient sélectionné
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Veuillez retourner à la liste des patients pour en sélectionner un
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/hospital/admissions')}
                    startIcon={<BackIcon />}
                  >
                    Retour à la recherche
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DateTimePicker
                    label="Date et heure d'admission *"
                    value={admissionForm.admission_date}
                    onChange={(date) => handleInputChange('admission_date', date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type de motif *</InputLabel>
                    <Select
                      value={admissionForm.reason_type}
                      onChange={(e) => handleInputChange('reason_type', e.target.value)}
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
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Décrivez le motif de l'admission..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Département *</InputLabel>
                    <Select
                      value={admissionForm.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      label="Département *"
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact d'urgence"
                    value={admissionForm.emergency_contact}
                    onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                    placeholder="Nom et téléphone du contact d'urgence"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );

      case 2:
        const selectedReasonType = reasonTypes.find(t => t.value === admissionForm.reason_type);
        return (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckIcon sx={{ mr: 1, color: 'success.main' }} />
                Récapitulatif de l'admission
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6">
                    {admissionForm.patient?.prenom} {admissionForm.patient?.nom}
                  </Typography>
                  <Typography variant="body2">
                    CIN: {admissionForm.patient?.CNE} | 
                    Âge: {calculateAge(admissionForm.patient?.date_naissance)} ans
                  </Typography>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Date d'admission</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {format(admissionForm.admission_date, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={selectedReasonType?.label} 
                        color={selectedReasonType?.color}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Département</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {admissionForm.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Contact d'urgence</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {admissionForm.emergency_contact || 'Non renseigné'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Motif d'admission</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {admissionForm.reason}
                    </Typography>
                  </Grid>
                  {admissionForm.notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {admissionForm.notes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/hospital/admissions')}
            sx={{ 
              mb: 2,
              color: 'white !important',
              '& .MuiSvgIcon-root': {
                color: 'white !important'
              }
            }}
          >
            Retour aux admissions
          </Button>
          
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 'bold',
              color: 'white !important',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            <HospitalIcon sx={{ mr: 2, fontSize: 40, color: 'white !important' }} />
            Nouvelle Admission Hospitalière
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white !important',
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
            }}
          >
            Processus d'admission d'un patient à l'hôpital
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel icon={step.icon}>
                  <Typography variant="h6">{step.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                          sx={{ mt: 1, mr: 1, fontWeight: 'bold' }}
                        >
                          {loading ? 'Admission en cours...' : 'Confirmer l\'admission'}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Continuer
                        </Button>
                      )}
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Retour
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>

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

        {/* Existing Admission Dialog */}
        <Dialog 
          open={existingAdmissionDialog.open} 
          onClose={() => setExistingAdmissionDialog({ open: false, admission: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <HospitalIcon sx={{ mr: 1, color: 'warning.main' }} />
            Patient déjà admis
          </DialogTitle>
          <DialogContent>
            {existingAdmissionDialog.admission && (
              <Box>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  Ce patient est déjà admis dans cet hôpital. Veuillez vérifier les détails ci-dessous.
                </Alert>
                
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Admission existante
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date d'admission
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {new Date(existingAdmissionDialog.admission.admission_date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Médecin responsable
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {existingAdmissionDialog.admission.doctor || 'Non assigné'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Département
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {existingAdmissionDialog.admission.ward || 'Non spécifié'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Motif d'admission
                      </Typography>
                      <Typography variant="body1">
                        {existingAdmissionDialog.admission.reason}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pour admettre ce patient à nouveau, vous devez d'abord effectuer sa sortie de l'admission actuelle.
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setExistingAdmissionDialog({ open: false, admission: null })}
            >
              Fermer
            </Button>
            <Button 
              variant="contained"
              onClick={() => {
                setExistingAdmissionDialog({ open: false, admission: null });
                navigate('/hospital/admissions');
              }}
            >
              Voir les admissions
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default PatientAdmission; 