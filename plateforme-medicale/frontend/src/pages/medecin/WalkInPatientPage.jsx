import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  CircularProgress,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { datePickerProps } from '../../utils/dateUtils';
import moroccanCities from '../../utils/moroccanCities';
import {
  validateCNERequired,
  validateCNEConfirmation,
  validatePhoneNumber,
  validatePostalCode,
  validateBirthDate,
  isValidEmail
} from '../../utils/formValidation';
import axios from 'axios';

const WalkInPatientPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    date_naissance: null,
    sexe: '',
    CNE: '',
    CNE_confirm: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'Maroc',
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [patientCredentials, setPatientCredentials] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      date_naissance: newValue
    }));
    
    if (errors.date_naissance) {
      setErrors(prev => ({
        ...prev,
        date_naissance: ''
      }));
    }
  };

  const handleCityChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      ville: newValue || ''
    }));
  };

  // Function to prevent pasting in CNE confirmation field
  const handleCNEConfirmPaste = (e) => {
    e.preventDefault();
    return false;
  };

  // Function to get field color based on validation state
  const getCNEFieldColor = (fieldName) => {
    if (!touchedFields[fieldName] || !formData[fieldName]) {
      return {};
    }
    
    if (fieldName === 'CNE_confirm') {
      const isValid = formData.CNE && formData.CNE_confirm && formData.CNE === formData.CNE_confirm;
      return isValid ? {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#4caf50' },
          '&:hover fieldset': { borderColor: '#4caf50' },
          '&.Mui-focused fieldset': { borderColor: '#4caf50' }
        }
      } : {};
    }
    
    if (fieldName === 'CNE' && formData.CNE_confirm) {
      const isValid = formData.CNE && formData.CNE_confirm && formData.CNE === formData.CNE_confirm;
      return isValid ? {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#4caf50' },
          '&:hover fieldset': { borderColor: '#4caf50' },
          '&.Mui-focused fieldset': { borderColor: '#4caf50' }
        }
      } : {};
    }
    
    return {};
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'prenom':
      case 'nom':
        if (!value || value.trim().length === 0) {
          error = `Le ${name} est requis`;
        } else if (value.trim().length < 2) {
          error = `Le ${name} doit contenir au moins 2 caractères`;
        } else if (value.trim().length > 50) {
          error = `Le ${name} ne doit pas dépasser 50 caractères`;
        } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
          error = `Le ${name} ne doit contenir que des lettres, espaces, tirets et apostrophes`;
        }
        break;
        
      case 'CNE':
        // CIN is mandatory for patients directs
        const cneValidation = validateCNERequired(value);
        if (!cneValidation.isValid) {
          error = cneValidation.errorMessage;
        }
        // Also validate CIN confirmation if it exists
        if (formData.CNE_confirm) {
          const confirmValidation = validateCNEConfirmation(value, formData.CNE_confirm);
          if (!confirmValidation.isValid) {
            setErrors(prevErrors => ({
              ...prevErrors,
              CNE_confirm: confirmValidation.errorMessage
            }));
          } else {
            setErrors(prevErrors => ({
              ...prevErrors,
              CNE_confirm: ''
            }));
          }
        }
        break;
        
      case 'CNE_confirm':
        const cneConfirmValidation = validateCNEConfirmation(formData.CNE, value);
        error = cneConfirmValidation.errorMessage;
        break;
        
      case 'date_naissance':
        if (!value) {
          error = 'La date de naissance est requise';
        } else {
          const dateValidation = validateBirthDate(value);
          if (!dateValidation.isValid) {
            error = dateValidation.errorMessage;
          }
        }
        break;
        
      case 'sexe':
        if (!value) {
          error = 'Le sexe est requis';
        }
        break;
        
      case 'email':
        if (value && !isValidEmail(value)) {
          error = 'Format d\'email invalide';
        }
        break;
        
      case 'telephone':
        if (value) {
          const phoneValidation = validatePhoneNumber(value);
          if (!phoneValidation.isValid) {
            error = phoneValidation.errorMessage;
          }
        }
        break;
        
      case 'code_postal':
        if (value) {
          const postalValidation = validatePostalCode(value);
          if (!postalValidation.isValid) {
            error = postalValidation.errorMessage;
          }
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
    
    return !error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });
    validateField(name, value);
  };

  const validate = () => {
    // Mark all required fields as touched
    const requiredFields = ['prenom', 'nom', 'date_naissance', 'sexe', 'CNE'];
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);
    
    // Validate all fields
    let isValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      const fieldIsValid = validateField(key, value);
      if (!fieldIsValid) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('.Mui-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/patient/direct`,
        {
          ...formData,
          date_naissance: formData.date_naissance ? formData.date_naissance.toISOString().split('T')[0] : null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setPatientCredentials(response.data.credentials);
      setRegistrationSuccess(true);
      
      // Scroll to success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription du patient direct:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        if (error.response.data && error.response.data.message) {
          setSubmitError(error.response.data.message);
          
          // Handle field-specific errors
          if (error.response.data.field) {
            setErrors(prev => ({
              ...prev,
              [error.response.data.field]: error.response.data.message
            }));
            setTouchedFields(prev => ({
              ...prev,
              [error.response.data.field]: true
            }));
          }
        } else {
          setSubmitError(`Erreur: ${error.response.status} - Une erreur est survenue lors de l'inscription.`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        setSubmitError('Erreur de connexion au serveur. Veuillez vérifier votre connexion internet et réessayer.');
      } else {
        console.error('Error message:', error.message);
        setSubmitError('Une erreur est survenue lors de l\'inscription du patient. Veuillez réessayer plus tard.');
      }
      
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector('.MuiAlert-root');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      prenom: '',
      nom: '',
      date_naissance: null,
      sexe: '',
      CNE: '',
      CNE_confirm: '',
      telephone: '',
      email: '',
      adresse: '',
      ville: '',
      code_postal: '',
      pays: 'Maroc',
    });
    setErrors({});
    setTouchedFields({});
    setSubmitError('');
    setRegistrationSuccess(false);
    setPatientCredentials(null);
  };

  const shouldShowError = (fieldName) => touchedFields[fieldName] && errors[fieldName];

  if (registrationSuccess && patientCredentials) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/medecin')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Patient inscrit avec succès !
          </Typography>
        </Box>

        <Alert severity="success" sx={{ mb: 3 }}>
          Le patient a été inscrit avec succès. Voici ses identifiants de connexion :
        </Alert>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Identifiants de connexion
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nom d'utilisateur :
              </Typography>
              <Chip 
                label={patientCredentials.username} 
                color="primary" 
                variant="outlined"
                sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Mot de passe :
              </Typography>
              <Chip 
                label={patientCredentials.password} 
                color="secondary" 
                variant="outlined"
                sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </Box>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Important :</strong> Communiquez ces identifiants au patient. 
                Le mot de passe correspond à son CIN et peut être modifié après la première connexion.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleReset}
            startIcon={<PersonAddIcon />}
          >
            Inscrire un autre patient
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/medecin')}
          >
            Retour au tableau de bord
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/medecin')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
            Inscription Patient sur place
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Inscrire un nouveau patient présent au cabinet
          </Typography>
        </Box>
      </Box>
      
      <Paper elevation={2} sx={{ p: 4 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          {/* Informations personnelles */}
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
            Informations personnelles
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              required
              fullWidth
              id="prenom"
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('prenom')}
              helperText={shouldShowError('prenom') ? errors.prenom : ''}
            />
            
            <TextField
              required
              fullWidth
              id="nom"
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('nom')}
              helperText={shouldShowError('nom') ? errors.nom : ''}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date de naissance *"
                value={formData.date_naissance}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    error={shouldShowError('date_naissance')}
                    helperText={shouldShowError('date_naissance') ? errors.date_naissance : ''}
                  />
                )}
                {...datePickerProps}
                maxDate={new Date()}
              />
            </LocalizationProvider>
            
            <FormControl 
              fullWidth 
              required 
              error={shouldShowError('sexe')}
            >
              <InputLabel id="sexe-label">Sexe</InputLabel>
              <Select
                labelId="sexe-label"
                id="sexe"
                name="sexe"
                value={formData.sexe}
                label="Sexe"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value="M">Homme</MenuItem>
                <MenuItem value="F">Femme</MenuItem>
              </Select>
              {shouldShowError('sexe') && (
                <FormHelperText error>{errors.sexe}</FormHelperText>
              )}
            </FormControl>
          </Box>
          
          <TextField
            required
            fullWidth
            id="CNE"
            label="CIN"
            name="CNE"
            value={formData.CNE}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError('CNE')}
            helperText={shouldShowError('CNE') ? errors.CNE : "Format: 1 ou 2 lettres suivies d'au moins 6 caractères (ex: AB123456)"}
            sx={{ mb: 3, ...getCNEFieldColor('CNE') }}
          />
          
          {/* CIN Confirmation */}
          <TextField
            required
            fullWidth
            id="CNE_confirm"
            label="Confirmer le CIN"
            name="CNE_confirm"
            value={formData.CNE_confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            onPaste={handleCNEConfirmPaste}
            error={shouldShowError('CNE_confirm')}
            helperText={shouldShowError('CNE_confirm') ? errors.CNE_confirm : "Saisissez à nouveau le CIN pour confirmation (copier-coller désactivé)"}
            sx={{ mb: 3, ...getCNEFieldColor('CNE_confirm') }}
          />
          
          {/* Informations de contact */}
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
            Informations de contact
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              id="telephone"
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('telephone')}
              helperText={shouldShowError('telephone') ? errors.telephone : "Format: +212612345678 ou 0612345678"}
              placeholder="ex: +212612345678"
            />
            
            <TextField
              fullWidth
              id="email"
              label="Email (optionnel)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('email')}
              helperText={shouldShowError('email') ? errors.email : ''}
            />
          </Box>
          
          {/* Adresse */}
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
            Adresse (optionnel)
          </Typography>
          
          <TextField
            fullWidth
            id="adresse"
            label="Adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Autocomplete
              id="ville"
              options={moroccanCities}
              value={formData.ville}
              onChange={handleCityChange}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Ville" 
                  fullWidth
                />
              )}
              freeSolo
            />
            
            <TextField
              fullWidth
              id="code_postal"
              label="Code postal"
              name="code_postal"
              value={formData.code_postal}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('code_postal')}
              helperText={shouldShowError('code_postal') ? errors.code_postal : ''}
            />
          </Box>
          
          <Typography sx={{ mb: 3 }} variant="caption" color="text.secondary">
            Les champs marqués d'un * sont obligatoires
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined"
              onClick={() => navigate('/medecin')}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              disabled={isSubmitting}
              sx={{ minWidth: 150 }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Inscription...
                </>
              ) : 'Inscrire le patient'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default WalkInPatientPage; 