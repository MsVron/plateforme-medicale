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
  validateCNEConfirmationOptional,
  validateEmail,
  validateName,
  validateBloodGroup,
  validateAlcoholConsumption,
  validatePhysicalActivity,
  validateWeight,
  validateHeight,
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
    pays: 'Maroc', // Updated to match common usage, but will validate against DB
    CNE: '',
    CNE_confirm: '',
    // Additional fields matching database schema
    adresse: '',
    contact_urgence_nom: '',
    contact_urgence_telephone: '',
    contact_urgence_relation: '',
    groupe_sanguin: '',
    taille_cm: '',
    poids_kg: '',
    est_fumeur: false,
    consommation_alcool: 'non',
    activite_physique: 'sédentaire',
    profession: '',
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ENUM options matching database schema
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const alcoholConsumptionOptions = [
    { value: 'non', label: 'Non' },
    { value: 'occasionnel', label: 'Occasionnel' },
    { value: 'régulier', label: 'Régulier' },
    { value: 'quotidien', label: 'Quotidien' }
  ];
  const physicalActivityOptions = [
    { value: 'sédentaire', label: 'Sédentaire' },
    { value: 'légère', label: 'Légère' },
    { value: 'modérée', label: 'Modérée' },
    { value: 'intense', label: 'Intense' }
  ];

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
        const nameValidation = validateName(value, name);
        error = nameValidation.errorMessage;
        break;
        
      case 'email':
        const emailValidation = validateEmail(value);
        error = emailValidation.errorMessage;
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
        // Also validate CNE confirmation if it exists
        if (formData.CNE_confirm) {
          const confirmValidation = validateCNEConfirmationOptional(value, formData.CNE_confirm);
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
        const cneConfirmValidation = validateCNEConfirmationOptional(formData.CNE, value);
        error = cneConfirmValidation.errorMessage;
        break;

      case 'groupe_sanguin':
        const bloodGroupValidation = validateBloodGroup(value);
        error = bloodGroupValidation.errorMessage;
        break;

      case 'consommation_alcool':
        const alcoholValidation = validateAlcoholConsumption(value);
        error = alcoholValidation.errorMessage;
        break;

      case 'activite_physique':
        const activityValidation = validatePhysicalActivity(value);
        error = activityValidation.errorMessage;
        break;

      case 'poids_kg':
        const weightValidation = validateWeight(value);
        error = weightValidation.errorMessage;
        break;

      case 'taille_cm':
        const heightValidation = validateHeight(value);
        error = heightValidation.errorMessage;
        break;

      case 'contact_urgence_nom':
        if (value && value.length > 100) {
          error = 'Le nom du contact d\'urgence ne doit pas dépasser 100 caractères';
        }
        break;

      case 'contact_urgence_telephone':
        if (value) {
          const contactPhoneValidation = validatePhoneNumber(value);
          error = contactPhoneValidation.errorMessage;
        }
        break;

      case 'contact_urgence_relation':
        if (value && value.length > 50) {
          error = 'La relation ne doit pas dépasser 50 caractères';
        }
        break;

      case 'profession':
        if (value && value.length > 100) {
          error = 'La profession ne doit pas dépasser 100 caractères';
        }
        break;

      case 'adresse':
        if (value && value.length > 255) {
          error = 'L\'adresse ne doit pas dépasser 255 caractères';
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else {
        setSubmitError('Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowError = (fieldName) => touchedFields[fieldName] && errors[fieldName];

  if (registrationSuccess) {
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
          <Typography component="h1" variant="h4" sx={{ mb: 1, color: '#4ca1af' }}>
            Inscription réussie !
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              background: 'linear-gradient(45deg, #4ca1af 30%, #c4e0e5 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #3a8a99 30%, #b0d4d9 90%)',
              },
            }}
          >
            Se connecter
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
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
          {/* Basic Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Informations de base
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
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date de naissance *"
                value={formData.date_naissance}
                onChange={handleDateChange}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    error: shouldShowError('date_naissance'),
                    helperText: shouldShowError('date_naissance') ? errors.date_naissance : ''
                  } 
                }}
                {...datePickerProps}
              />
            </LocalizationProvider>
            
            <FormControl fullWidth required error={shouldShowError('sexe')}>
              <InputLabel>Sexe</InputLabel>
              <Select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Sexe"
              >
                <MenuItem value="M">Masculin</MenuItem>
                <MenuItem value="F">Féminin</MenuItem>
              </Select>
              {shouldShowError('sexe') && (
                <FormHelperText>{errors.sexe}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Account Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Informations de compte
          </Typography>
          
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
            helperText={shouldShowError('nom_utilisateur') ? errors.nom_utilisateur : 'Entre 3 et 50 caractères, lettres, chiffres, points et tirets bas uniquement'}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
              helperText={shouldShowError('mot_de_passe') ? errors.mot_de_passe : ''}
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
            />
            
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
            />
          </Box>

          {/* Contact Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
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
              helperText={shouldShowError('telephone') ? errors.telephone : 'Format: +212612345678 ou 0612345678'}
            />
            
            <Autocomplete
              fullWidth
              options={moroccanCities}
              value={formData.ville || null}
              onChange={(event, newValue) => {
                setFormData(prev => ({ ...prev, ville: newValue || '' }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ville"
                  name="ville"
                  onBlur={handleBlur}
                />
              )}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              id="adresse"
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('adresse')}
              helperText={shouldShowError('adresse') ? errors.adresse : ''}
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

          {/* CNE Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Carte Nationale d'Étudiant (Optionnel)
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              id="CNE"
              label="CNE"
              name="CNE"
              value={formData.CNE}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('CNE')}
              helperText={shouldShowError('CNE') ? errors.CNE : '1-2 lettres suivies de 6-18 caractères alphanumériques'}
              sx={getCNEFieldColor('CNE')}
            />
            
            <TextField
              fullWidth
              id="CNE_confirm"
              label="Confirmer CNE"
              name="CNE_confirm"
              value={formData.CNE_confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('CNE_confirm')}
              helperText={shouldShowError('CNE_confirm') ? errors.CNE_confirm : ''}
              sx={getCNEFieldColor('CNE_confirm')}
              onPaste={(e) => e.preventDefault()}
            />
          </Box>

          {/* Medical Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Informations médicales (Optionnel)
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl fullWidth error={shouldShowError('groupe_sanguin')}>
              <InputLabel>Groupe sanguin</InputLabel>
              <Select
                name="groupe_sanguin"
                value={formData.groupe_sanguin}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Groupe sanguin"
              >
                <MenuItem value="">Non spécifié</MenuItem>
                {bloodGroupOptions.map((group) => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </Select>
              {shouldShowError('groupe_sanguin') && (
                <FormHelperText>{errors.groupe_sanguin}</FormHelperText>
              )}
            </FormControl>
            
            <TextField
              fullWidth
              id="taille_cm"
              label="Taille (cm)"
              name="taille_cm"
              type="number"
              value={formData.taille_cm}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('taille_cm')}
              helperText={shouldShowError('taille_cm') ? errors.taille_cm : 'Entre 30 et 300 cm'}
            />
            
            <TextField
              fullWidth
              id="poids_kg"
              label="Poids (kg)"
              name="poids_kg"
              type="number"
              step="0.1"
              value={formData.poids_kg}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('poids_kg')}
              helperText={shouldShowError('poids_kg') ? errors.poids_kg : 'Entre 0.01 et 999.99 kg'}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl fullWidth error={shouldShowError('consommation_alcool')}>
              <InputLabel>Consommation d'alcool</InputLabel>
              <Select
                name="consommation_alcool"
                value={formData.consommation_alcool}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Consommation d'alcool"
              >
                {alcoholConsumptionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
              {shouldShowError('consommation_alcool') && (
                <FormHelperText>{errors.consommation_alcool}</FormHelperText>
              )}
            </FormControl>
            
            <FormControl fullWidth error={shouldShowError('activite_physique')}>
              <InputLabel>Activité physique</InputLabel>
              <Select
                name="activite_physique"
                value={formData.activite_physique}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Activité physique"
              >
                {physicalActivityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
              {shouldShowError('activite_physique') && (
                <FormHelperText>{errors.activite_physique}</FormHelperText>
              )}
            </FormControl>
          </Box>

          {/* Emergency Contact */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Contact d'urgence (Optionnel)
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              id="contact_urgence_nom"
              label="Nom du contact d'urgence"
              name="contact_urgence_nom"
              value={formData.contact_urgence_nom}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('contact_urgence_nom')}
              helperText={shouldShowError('contact_urgence_nom') ? errors.contact_urgence_nom : ''}
            />
            
            <TextField
              fullWidth
              id="contact_urgence_telephone"
              label="Téléphone du contact d'urgence"
              name="contact_urgence_telephone"
              value={formData.contact_urgence_telephone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('contact_urgence_telephone')}
              helperText={shouldShowError('contact_urgence_telephone') ? errors.contact_urgence_telephone : ''}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              id="contact_urgence_relation"
              label="Relation"
              name="contact_urgence_relation"
              value={formData.contact_urgence_relation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('contact_urgence_relation')}
              helperText={shouldShowError('contact_urgence_relation') ? errors.contact_urgence_relation : 'Ex: Père, Mère, Conjoint(e)'}
            />
            
            <TextField
              fullWidth
              id="profession"
              label="Profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              onBlur={handleBlur}
              error={shouldShowError('profession')}
              helperText={shouldShowError('profession') ? errors.profession : ''}
            />
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #4ca1af 30%, #c4e0e5 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #3a8a99 30%, #b0d4d9 90%)',
              },
              '&:disabled': {
                background: '#ccc',
              },
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