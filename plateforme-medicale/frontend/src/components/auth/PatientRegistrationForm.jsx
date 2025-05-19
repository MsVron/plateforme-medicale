import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import moroccanCities from '../../utils/moroccanCities';
import {
  validateUsername,
  validatePassword,
  validateBirthDate,
  validatePhoneNumber,
  validatePostalCode,
  validateCNE,
  isValidEmail,
} from '../../utils/formValidation';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { datePickerProps } from '../../utils/dateUtils';

const PatientRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    nom_utilisateur: '',
    mot_de_passe: '',
    mot_de_passe_confirm: '',
    date_naissance: '',
    sexe: '',
    telephone: '',
    ville: '',
    code_postal: '',
    CNE: '',
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Mark field as touched
    if (!touchedFields[name]) {
      setTouchedFields({ ...touchedFields, [name]: true });
    }
    
    // Generate username from first and last name
    if (name === 'prenom' || name === 'nom') {
      if (formData.prenom && name === 'nom') {
        const generatedUsername = `${formData.prenom.toLowerCase()}.${value.toLowerCase()}`;
        setFormData({ ...formData, [name]: value, nom_utilisateur: generatedUsername });
        // Validate the generated username
        validateField('nom_utilisateur', generatedUsername);
      } else if (formData.nom && name === 'prenom') {
        const generatedUsername = `${value.toLowerCase()}.${formData.nom.toLowerCase()}`;
        setFormData({ ...formData, [name]: value, nom_utilisateur: generatedUsername });
        // Validate the generated username
        validateField('nom_utilisateur', generatedUsername);
      }
    }
    
    // Validate the field
    validateField(name, value);
  };

  const handleCityChange = (event, newValue) => {
    setFormData({ ...formData, ville: newValue || '' });
    // Mark field as touched
    if (!touchedFields.ville) {
      setTouchedFields({ ...touchedFields, ville: true });
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'prenom':
      case 'nom':
        if (!value) {
          error = `Le ${name} est requis`;
        } else if (value.length < 2) {
          error = `Le ${name} doit contenir au moins 2 caractères`;
        }
        break;
        
      case 'email':
        if (!value) {
          error = "L'email est requis";
        } else if (!isValidEmail(value)) {
          error = "Format d'email invalide";
        }
        break;
        
      case 'nom_utilisateur':
        const usernameValidation = validateUsername(value);
        error = usernameValidation.errorMessage;
        break;
        
      case 'mot_de_passe':
        const passwordValidation = validatePassword(value);
        error = passwordValidation.errorMessage;
        break;
        
      case 'mot_de_passe_confirm':
        if (!value) {
          error = 'La confirmation du mot de passe est requise';
        } else if (value !== formData.mot_de_passe) {
          error = 'Les mots de passe ne correspondent pas';
        }
        break;
        
      case 'date_naissance':
        const dateValidation = validateBirthDate(value);
        error = dateValidation.errorMessage;
        break;
        
      case 'sexe':
        if (!value) {
          error = 'Le sexe est requis';
        }
        break;
        
      case 'telephone':
        const phoneValidation = validatePhoneNumber(value);
        error = phoneValidation.errorMessage;
        break;
        
      case 'code_postal':
        const postalCodeValidation = validatePostalCode(value);
        error = postalCodeValidation.errorMessage;
        break;
        
      case 'CNE':
        const cneValidation = validateCNE(value);
        error = cneValidation.errorMessage;
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

  const validate = () => {
    // Mark all fields as touched
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector('.Mui-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      console.log('Sending registration data:', formData);
      console.log('API URL:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register/patient`);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register/patient`, 
        formData
      );
      
      console.log('Registration successful:', response.data);
      setRegistrationSuccess(true);
      // Don't navigate - show success message instead
    } catch (error) {
      console.error('Registration error details:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        if (error.response.data && error.response.data.message) {
          setSubmitError(error.response.data.message);
        } else {
          setSubmitError(`Erreur: ${error.response.status} - Une erreur est survenue lors de l'inscription.`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        setSubmitError('Erreur de connexion au serveur. Veuillez vérifier votre connexion internet et réessayer.');
      } else {
        console.error('Error message:', error.message);
        setSubmitError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard.');
      }
      
      // Scroll to error message
      const errorElement = document.querySelector('.MuiAlert-root');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            p: 4,
            borderRadius: 5,
            boxShadow: '0 4px 20px rgba(44, 62, 80, 0.1)',
          }}
        >
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <Typography component="h2" variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Inscription réussie!
            </Typography>
            <Typography sx={{ mt: 4 }}>
              Un email de vérification a été envoyé à <strong>{formData.email}</strong>. 
              Veuillez cliquer sur le lien dans l'email pour activer votre compte.
            </Typography>
            <Box sx={{ mt: 6 }}>
              <Link to="/login" style={{ color: '#4ca1af', textDecoration: 'none' }}>
                Retour à la page de connexion
              </Link>
            </Box>
          </div>
        </Box>
      </Container>
    );
  }

  const shouldShowError = (fieldName) => touchedFields[fieldName] && errors[fieldName];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginY: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          p: 4,
          borderRadius: 5,
          boxShadow: '0 4px 20px rgba(44, 62, 80, 0.1)',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 1 }} id='title'>
          BluePulse
        </Typography>
        <Typography component="h2" variant="h5" sx={{ mb: 3 }} id='subtitle'>
          Créer un compte patient
        </Typography>
        
        {submitError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {submitError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* Prénom */}
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
            sx={{ mb: 3 }}
          />
          
          {/* Nom */}
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
            sx={{ mb: 3 }}
          />
          
          {/* Email */}
          <TextField
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError('email')}
            helperText={shouldShowError('email') ? errors.email : ''}
            sx={{ mb: 3 }}
          />
          
          {/* Date de naissance */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date de naissance *"
              value={formData.date_naissance}
              onChange={(newValue) => {
                handleChange({
                  target: {
                    name: 'date_naissance',
                    value: newValue
                  }
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  fullWidth
                  error={shouldShowError('date_naissance')}
                  helperText={shouldShowError('date_naissance') ? errors.date_naissance : ''}
                  sx={{ mb: 3 }}
                />
              )}
              {...datePickerProps}
              maxDate={new Date()}
            />
          </LocalizationProvider>
          
          {/* Téléphone */}
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
            sx={{ mb: 3 }}
          />
          
          {/* Nom d'utilisateur */}
          <TextField
            required
            fullWidth
            id="nom_utilisateur"
            label="Nom d'utilisateur"
            name="nom_utilisateur"
            value={formData.nom_utilisateur}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError('nom_utilisateur')}
            helperText={shouldShowError('nom_utilisateur') ? errors.nom_utilisateur : "Généré automatiquement à partir de votre prénom et nom, mais vous pouvez le modifier"}
            sx={{ mb: 3 }}
          />
          
          {/* Ville - Autocomplete */}
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
                error={shouldShowError('ville')}
                helperText={shouldShowError('ville') ? errors.ville : ''}
                onBlur={() => setTouchedFields({ ...touchedFields, ville: true })}
              />
            )}
            sx={{ mb: 3 }}
            freeSolo
          />
          
          {/* Code postal */}
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
            sx={{ mb: 3 }}
          />
          
          {/* CNE */}
          <TextField
            fullWidth
            id="CNE"
            label="CNE"
            name="CNE"
            value={formData.CNE}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError('CNE')}
            helperText={shouldShowError('CNE') ? errors.CNE : "Format: 1 ou 2 lettres suivies d'au moins 6 caractères"}
            sx={{ mb: 3 }}
          />
          
          {/* Sexe */}
          <FormControl 
            fullWidth 
            required 
            error={shouldShowError('sexe')} 
            sx={{ mb: 3 }}
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
          
          {/* Mot de passe */}
          <TextField
            required
            fullWidth
            id="mot_de_passe"
            label="Mot de passe"
            name="mot_de_passe"
            type={showPassword ? 'text' : 'password'}
            value={formData.mot_de_passe}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError('mot_de_passe')}
            helperText={shouldShowError('mot_de_passe') ? errors.mot_de_passe : 'Doit contenir au moins 6 caractères, avec au moins une lettre et un chiffre'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          
          {/* Confirmation mot de passe */}
          <TextField
            required
            fullWidth
            id="mot_de_passe_confirm"
            label="Confirmer le mot de passe"
            name="mot_de_passe_confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.mot_de_passe_confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shouldShowError('mot_de_passe_confirm')}
            helperText={shouldShowError('mot_de_passe_confirm') ? errors.mot_de_passe_confirm : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          
          <Typography sx={{ mb: 3 }} variant="caption" color="text.secondary">
            Les champs marqués d'un * sont obligatoires
          </Typography>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mb: 2,
              bgcolor: '#4ca1af',
              color: 'white',
              '&:hover': {
                bgcolor: '#2c3e50',
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(76, 161, 175, 0.3)',
              borderRadius: '8px',
              padding: '12px 0',
              fontWeight: 'bold'
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Inscription en cours...
              </>
            ) : 'S\'inscrire'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to="/login" style={{ color: '#4ca1af', textDecoration: 'none' }}>
              Vous avez déjà un compte? Se connecter
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default PatientRegistrationForm; 