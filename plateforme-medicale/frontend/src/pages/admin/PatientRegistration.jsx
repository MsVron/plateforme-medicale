import React, { useState } from 'react';
import {
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
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PersonAdd as UserPlus } from '@mui/icons-material';
import axios from 'axios';

const PatientRegistration = () => {
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
        profession: '',
        contact_urgence_nom: '',
        contact_urgence_telephone: '',
        contact_urgence_relation: '',
        groupe_sanguin: '',
        taille_cm: '',
        poids_kg: '',
        est_fumeur: false,
        consommation_alcool: 'non',
        activite_physique: 'sédentaire',
        allergies_notes: '',
        antecedents_medicaux: ''
    });

    const [errors, setErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [patientCredentials, setPatientCredentials] = useState(null);

    const moroccanCities = [
        'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 'Meknès', 'Oujda',
        'Kénitra', 'Tétouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Béni Mellal',
        'Nador', 'Taza', 'Settat', 'Berrechid', 'Khémisset', 'Inezgane', 'Ksar El Kebir',
        'Larache', 'Guelmim', 'Berkane', 'Taourirt', 'Bouskoura', 'Fquih Ben Salah',
        'Dcheira El Jihadia', 'Oued Zem'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
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

    const handleCNEConfirmPaste = (e) => {
        e.preventDefault();
        return false;
    };

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
                } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
                    error = `Le ${name} ne doit contenir que des lettres`;
                }
                break;
                
            case 'CNE':
                if (!value.trim()) {
                    error = 'Le CIN est requis';
                } else if (!/^[A-Za-z]{1,2}[A-Za-z0-9]{6,18}$/.test(value.trim())) {
                    error = 'Format CIN invalide (ex: A123456 ou AB1234567)';
                }
                if (formData.CNE_confirm) {
                    if (value !== formData.CNE_confirm) {
                        setErrors(prevErrors => ({
                            ...prevErrors,
                            CNE_confirm: 'Les CIN ne correspondent pas'
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
                if (!value.trim()) {
                    error = 'La confirmation du CIN est requise';
                } else if (value !== formData.CNE) {
                    error = 'Les CIN ne correspondent pas';
                }
                break;
                
            case 'date_naissance':
                if (!value) {
                    error = 'La date de naissance est requise';
                } else {
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    
                    if (birthDate > today) {
                        error = 'La date de naissance ne peut pas être dans le futur';
                    } else if (age > 120) {
                        error = 'Âge invalide (plus de 120 ans)';
                    }
                }
                break;
                
            case 'sexe':
                if (!value) {
                    error = 'Le sexe est requis';
                }
                break;
                
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Format d\'email invalide';
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
        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouchedFields(allTouched);
        
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
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/admin/patients/register-onsite',
                {
                    ...formData,
                    date_naissance: formData.date_naissance ? formData.date_naissance.toISOString().split('T')[0] : null
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data.credentials) {
                setPatientCredentials(response.data.credentials);
            }
            
            setRegistrationSuccess(true);
            setSubmitError('');
            
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            if (error.response?.data?.message) {
                setSubmitError(error.response.data.message);
            } else {
                setSubmitError('Une erreur est survenue lors de l\'inscription du patient');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
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
            profession: '',
            contact_urgence_nom: '',
            contact_urgence_telephone: '',
            contact_urgence_relation: '',
            groupe_sanguin: '',
            taille_cm: '',
            poids_kg: '',
            est_fumeur: false,
            consommation_alcool: 'non',
            activite_physique: 'sédentaire',
            allergies_notes: '',
            antecedents_medicaux: ''
        });
        setErrors({});
        setTouchedFields({});
        setSubmitError('');
        setRegistrationSuccess(false);
        setPatientCredentials(null);
    };

    const shouldShowError = (fieldName) => touchedFields[fieldName] && errors[fieldName];

    if (registrationSuccess) {
        return (
            <Box sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <UserPlus sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1">
                        Enregistrement Patient sur Site
                    </Typography>
                </Box>

                <Card>
                    <CardContent>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Patient enregistré avec succès !
                            </Typography>
                            <Typography variant="body2">
                                Le patient {formData.prenom} {formData.nom} a été ajouté à la base de données.
                            </Typography>
                        </Alert>

                        {patientCredentials && (
                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Identifiants de connexion
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Nom d'utilisateur:</strong> {patientCredentials.username}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Mot de passe temporaire:</strong> {patientCredentials.password}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Veuillez communiquer ces identifiants au patient de manière sécurisée.
                                </Typography>
                            </Alert>
                        )}

                        <Button variant="contained" onClick={handleClose}>
                            Enregistrer un autre patient
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <UserPlus sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" component="h1">
                    Enregistrement Patient sur Site
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit}>
                        {submitError && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {submitError}
                            </Alert>
                        )}

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Informations personnelles
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="prenom"
                                    label="Prénom *"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={shouldShowError('prenom')}
                                    helperText={shouldShowError('prenom') ? errors.prenom : ''}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="nom"
                                    label="Nom *"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={shouldShowError('nom')}
                                    helperText={shouldShowError('nom') ? errors.nom : ''}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date de naissance *"
                                        value={formData.date_naissance}
                                        onChange={handleDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                name="date_naissance"
                                                onBlur={handleBlur}
                                                error={shouldShowError('date_naissance')}
                                                helperText={shouldShowError('date_naissance') ? errors.date_naissance : ''}
                                                required
                                            />
                                        )}
                                        maxDate={new Date()}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={shouldShowError('sexe')}>
                                    <InputLabel>Sexe *</InputLabel>
                                    <Select
                                        name="sexe"
                                        value={formData.sexe}
                                        label="Sexe *"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <MenuItem value="M">Homme</MenuItem>
                                        <MenuItem value="F">Femme</MenuItem>
                                    </Select>
                                    {shouldShowError('sexe') && (
                                        <FormHelperText>{errors.sexe}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="CNE"
                                    name="CNE"
                                    label="CIN *"
                                    value={formData.CNE}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={shouldShowError('CNE')}
                                    helperText={shouldShowError('CNE') ? errors.CNE : 'Format: A123456 ou AB1234567'}
                                    variant="outlined"
                                    sx={getCNEFieldColor('CNE')}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="CNE_confirm"
                                    name="CNE_confirm"
                                    label="Confirmer CIN *"
                                    value={formData.CNE_confirm}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onPaste={handleCNEConfirmPaste}
                                    error={shouldShowError('CNE_confirm')}
                                    helperText={shouldShowError('CNE_confirm') ? errors.CNE_confirm : 'Retapez le CIN (copier-coller désactivé)'}
                                    variant="outlined"
                                    sx={getCNEFieldColor('CNE_confirm')}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={shouldShowError('email')}
                                    helperText={shouldShowError('email') ? errors.email : 'Optionnel - pour créer un compte'}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="telephone"
                                    label="Téléphone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="adresse"
                                    label="Adresse"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={moroccanCities}
                                    value={formData.ville}
                                    onChange={handleCityChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="ville"
                                            label="Ville"
                                            fullWidth
                                        />
                                    )}
                                    freeSolo
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    name="profession"
                                    label="Profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                    Informations médicales (optionnel)
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Groupe sanguin</InputLabel>
                                    <Select
                                        name="groupe_sanguin"
                                        value={formData.groupe_sanguin}
                                        label="Groupe sanguin"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="A+">A+</MenuItem>
                                        <MenuItem value="A-">A-</MenuItem>
                                        <MenuItem value="B+">B+</MenuItem>
                                        <MenuItem value="B-">B-</MenuItem>
                                        <MenuItem value="AB+">AB+</MenuItem>
                                        <MenuItem value="AB-">AB-</MenuItem>
                                        <MenuItem value="O+">O+</MenuItem>
                                        <MenuItem value="O-">O-</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="est_fumeur"
                                            checked={formData.est_fumeur}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="Patient fumeur"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="allergies_notes"
                                    label="Notes sur les allergies"
                                    multiline
                                    rows={2}
                                    value={formData.allergies_notes}
                                    onChange={handleChange}
                                    placeholder="Allergies connues, réactions, etc."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <UserPlus />}
                                    >
                                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer Patient'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PatientRegistration; 