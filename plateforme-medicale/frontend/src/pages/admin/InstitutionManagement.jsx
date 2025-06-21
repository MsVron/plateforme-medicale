import React, { useState, useEffect } from 'react';
import axios from '../../services/axiosConfig';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    TextField,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Alert,
    AlertTitle,
    Tabs,
    Tab,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import {
    Business as Building,
    Add as Plus,
    Edit as Edit,
    Delete as Trash2,
    People as Users,
    MedicalServices as Stethoscope,
    Search,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import moroccanCities from '../../utils/moroccanCities';

const InstitutionManagement = () => {
    const [institutions, setInstitutions] = useState([]);
    const [filteredInstitutions, setFilteredInstitutions] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // Function to clean text for username generation (same as backend)
    const cleanTextForUsername = (text) => {
        return text.toLowerCase()
            // French accented characters
            .replace(/[àáâãäåæ]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõöø]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ýÿ]/g, 'y')
            .replace(/[ç]/g, 'c')
            .replace(/[ñ]/g, 'n')
            // Additional French characters
            .replace(/[œ]/g, 'oe')
            .replace(/[ß]/g, 'ss')
            // Remove all non-alphanumeric characters INCLUDING SPACES
            .replace(/[^a-z0-9]/g, '');
    };

    // Special handling for institution types
    const getCleanType = (type) => {
        const lowerType = type.toLowerCase();
        if (lowerType === 'centre médical' || lowerType === 'centre medical') {
            return 'centre';
        }
        return cleanTextForUsername(type);
    };
    
    // Filter and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    
    // Dialog states
    const [institutionDialog, setInstitutionDialog] = useState({ open: false, mode: 'add', data: null });
    const [doctorDialog, setDoctorDialog] = useState({ open: false, institutionId: null });
    const [credentialsDialog, setCredentialsDialog] = useState({ open: false, credentials: null, institutionName: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    // Form states
    const [institutionForm, setInstitutionForm] = useState({
        nom: '',
        adresse: '',
        ville: '',
        code_postal: '',
        pays: 'Maroc',
        telephone: '',
        email_contact: '',
        description: '',
        type: 'hôpital',
        username: '',
        password: ''
    });

    // Institution types according to system specification
    // hôpital, clinique, centre médical -> hospital role (same functionality)
    // laboratoire -> laboratory role
    // pharmacie -> pharmacy role  
    // cabinet privé -> institution role
    const institutionTypes = [
        'hôpital',
        'clinique', 
        'centre médical',
        'cabinet privé',
        'laboratoire',
        'pharmacie'
    ];

    useEffect(() => {
        fetchInstitutions();
        fetchDoctors();
    }, []);

    // Auto-generate username when name or type changes (only for add mode)
    useEffect(() => {
        if (institutionDialog.mode === 'add' && institutionForm.nom && institutionForm.type !== 'cabinet privé') {
            const generatedUsername = `${getCleanType(institutionForm.type)}.${cleanTextForUsername(institutionForm.nom)}`;
            setInstitutionForm(prev => ({ ...prev, username: generatedUsername }));
        }
    }, [institutionForm.nom, institutionForm.type, institutionDialog.mode]);

    // Filter institutions based on search term, type, and location
    useEffect(() => {
        let filtered = institutions;

        // Filter by search term (name)
        if (searchTerm) {
            filtered = filtered.filter(institution =>
                institution.nom.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by type
        if (selectedType) {
            filtered = filtered.filter(institution => institution.type === selectedType);
        }

        // Filter by location (ville)
        if (selectedLocation) {
            filtered = filtered.filter(institution =>
                institution.ville.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        setFilteredInstitutions(filtered);
    }, [institutions, searchTerm, selectedType, selectedLocation]);

    const fetchInstitutions = async () => {
        try {
            const response = await axios.get('/admin/institutions');
            setInstitutions(response.data);
            setFilteredInstitutions(response.data);
        } catch (error) {
            console.error('Error fetching institutions:', error);
            setError('Erreur lors de la récupération des institutions');
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('/admin/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleAddInstitution = () => {
        setInstitutionForm({
            nom: '',
            adresse: '',
            ville: '',
            code_postal: '',
            pays: 'Maroc',
            telephone: '',
            email_contact: '',
            description: '',
            type: 'hôpital',
            username: '',
            password: ''
        });
        setShowPassword(false);
        setInstitutionDialog({ open: true, mode: 'add', data: null });
    };

    const handleEditInstitution = (institution) => {
        setInstitutionForm({
            nom: institution.nom || '',
            adresse: institution.adresse || '',
            ville: institution.ville || '',
            code_postal: institution.code_postal || '',
            pays: institution.pays || 'Maroc',
            telephone: institution.telephone || '',
            email_contact: institution.email_contact || '',
            description: institution.description || '',
            type: institution.type || 'hôpital',
            username: institution.username || '', // Pre-fill existing username
            password: '' // Always empty for security
        });
        setShowPassword(false);
        setInstitutionDialog({ open: true, mode: 'edit', data: institution });
    };

    const handleSaveInstitution = async () => {
        try {
            // Validate credentials for non-cabinet privé institutions
            if (institutionForm.type !== 'cabinet privé') {
                // Password is required for add mode
                if (institutionDialog.mode === 'add' && !institutionForm.password) {
                    setError('Le mot de passe est requis');
                    return;
                }
                // Validate password length if provided
                if (institutionForm.password && institutionForm.password.length < 6) {
                    setError('Le mot de passe doit contenir au moins 6 caractères');
                    return;
                }
            }

            if (institutionDialog.mode === 'add') {
                const response = await axios.post('/admin/institutions', institutionForm);
                
                if (response.data.credentials && institutionForm.type !== 'cabinet privé') {
                    // Show credentials dialog
                    setCredentialsDialog({
                        open: true,
                        credentials: response.data.credentials,
                        institutionName: institutionForm.nom
                    });
                    setSuccess('Institution ajoutée avec succès! Identifiants de connexion créés.');
                } else {
                    setSuccess('Institution ajoutée avec succès');
                }
            } else {
                await axios.put(`/admin/institutions/${institutionDialog.data.id}`, institutionForm);
                const hasCredentialUpdate = institutionForm.type !== 'cabinet privé' && (institutionForm.username || institutionForm.password);
                setSuccess(hasCredentialUpdate 
                    ? 'Institution et identifiants mis à jour avec succès' 
                    : 'Institution modifiée avec succès');
            }
            
            setInstitutionDialog({ open: false, mode: 'add', data: null });
            fetchInstitutions();
            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            console.error('Error saving institution:', error);
            setError(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'institution');
        }
    };

    const handleDeleteInstitution = async (institutionId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette institution ?')) {
            try {
                await axios.delete(`/admin/institutions/${institutionId}`);
                setSuccess('Institution supprimée avec succès');
                fetchInstitutions();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                console.error('Error deleting institution:', error);
                setError(error.response?.data?.message || 'Erreur lors de la suppression de l\'institution');
            }
        }
    };

    const handleAssignDoctor = async (institutionId, doctorId) => {
        try {
            await axios.post(`/admin/institutions/${institutionId}/doctors`, { doctorId });
            setSuccess('Médecin assigné avec succès');
            fetchInstitutions();
            setDoctorDialog({ open: false, institutionId: null });
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error assigning doctor:', error);
            setError(error.response?.data?.message || 'Erreur lors de l\'assignation du médecin');
        }
    };

    const handleRemoveDoctor = async (institutionId, doctorId) => {
        if (window.confirm('Êtes-vous sûr de vouloir retirer ce médecin de cette institution ?')) {
            try {
                await axios.delete(`/admin/institutions/${institutionId}/doctors/${doctorId}`);
                setSuccess('Médecin retiré avec succès');
                fetchInstitutions();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                console.error('Error removing doctor:', error);
                setError(error.response?.data?.message || 'Erreur lors du retrait du médecin');
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedLocation('');
    };

    // Get unique locations for filter dropdown
    const getUniqueLocations = () => {
        const locations = institutions.map(institution => institution.ville);
        return [...new Set(locations)].sort();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Building sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
                        Gestion des Institutions
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={handleAddInstitution}
                >
                    Ajouter Institution
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                </Alert>
            )}

            <Box sx={{ width: '100%' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Liste des Institutions" />
                    <Tab label="Statistiques" />
                </Tabs>

                {/* Institutions List Tab */}
                {activeTab === 0 && (
                    <Box sx={{ mt: 2 }}>
                        {/* Search and Filter Controls */}
                        <Card sx={{ mb: 3, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Rechercher et Filtrer
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Rechercher par nom"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                        }}
                                        placeholder="Nom de l'institution..."
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Type d'institution</InputLabel>
                                        <Select
                                            value={selectedType}
                                            label="Type d'institution"
                                            onChange={(e) => setSelectedType(e.target.value)}
                                        >
                                            <MenuItem value="">Tous les types</MenuItem>
                                            {institutionTypes.map(type => (
                                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Autocomplete
                                        options={getUniqueLocations()}
                                        value={selectedLocation || null}
                                        onChange={(event, newValue) => {
                                            setSelectedLocation(newValue || "");
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                label="Ville"
                                                placeholder="Filtrer par ville..."
                                            />
                                        )}
                                        freeSolo
                                        autoSelect
                                        filterOptions={(options, { inputValue }) =>
                                            options.filter(option =>
                                                option.toLowerCase().includes(inputValue.toLowerCase())
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={handleClearFilters}
                                        disabled={!searchTerm && !selectedType && !selectedLocation}
                                    >
                                        Effacer
                                    </Button>
                                </Grid>
                            </Grid>
                            
                            {/* Results Summary */}
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {filteredInstitutions.length} institution(s) trouvée(s)
                                    {institutions.length !== filteredInstitutions.length && 
                                        ` sur ${institutions.length} au total`
                                    }
                                </Typography>
                                {(searchTerm || selectedType || selectedLocation) && (
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {searchTerm && (
                                            <Chip 
                                                label={`Nom: "${searchTerm}"`} 
                                                size="small" 
                                                onDelete={() => setSearchTerm('')}
                                            />
                                        )}
                                        {selectedType && (
                                            <Chip 
                                                label={`Type: ${selectedType}`} 
                                                size="small" 
                                                onDelete={() => setSelectedType('')}
                                            />
                                        )}
                                        {selectedLocation && (
                                            <Chip 
                                                label={`Ville: ${selectedLocation}`} 
                                                size="small" 
                                                onDelete={() => setSelectedLocation('')}
                                            />
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Card>

                        {/* Institutions Grid */}
                        {filteredInstitutions.length === 0 ? (
                            <Card sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Aucune institution trouvée
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {institutions.length === 0 
                                        ? "Aucune institution n'a été ajoutée pour le moment."
                                        : "Essayez de modifier vos critères de recherche."
                                    }
                                </Typography>
                                {(searchTerm || selectedType || selectedLocation) && (
                                    <Button 
                                        variant="outlined" 
                                        onClick={handleClearFilters}
                                        sx={{ mt: 2 }}
                                    >
                                        Effacer les filtres
                                    </Button>
                                )}
                            </Card>
                        ) : (
                            <Grid container spacing={3}>
                                {filteredInstitutions.map((institution) => (
                                <Grid item xs={12} md={6} lg={4} key={institution.id}>
                                    <Card>
                                        <CardHeader
                                            title={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Building />
                                                    <Typography variant="h6">{institution.nom}</Typography>
                                                </Box>
                                            }
                                            action={
                                                <Box>
                                                    <Tooltip title="Modifier">
                                                        <IconButton onClick={() => handleEditInstitution(institution)}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer">
                                                        <IconButton 
                                                            onClick={() => handleDeleteInstitution(institution.id)}
                                                            color="error"
                                                        >
                                                            <Trash2 />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            }
                                        />
                                        <CardContent>
                                            <Box sx={{ mb: 2 }}>
                                                <Chip 
                                                    label={institution.type} 
                                                    color="primary" 
                                                    size="small" 
                                                />
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {institution.adresse}, {institution.ville}
                                            </Typography>
                                            
                                            <Typography variant="body2" gutterBottom>
                                                📞 {institution.telephone || 'Non renseigné'}
                                            </Typography>
                                            
                                            <Typography variant="body2" gutterBottom>
                                                ✉️ {institution.email_contact}
                                            </Typography>

                                            {institution.description && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {institution.description}
                                                </Typography>
                                            )}

                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Médecins ({institution.doctors?.length || 0})
                                                </Typography>
                                                
                                                {institution.doctors && institution.doctors.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                                        {institution.doctors.map((doctor) => (
                                                            <Chip
                                                                key={doctor.id}
                                                                label={`Dr. ${doctor.prenom} ${doctor.nom}`}
                                                                size="small"
                                                                onDelete={() => handleRemoveDoctor(institution.id, doctor.id)}
                                                                deleteIcon={<Trash2 />}
                                                            />
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        Aucun médecin assigné
                                                    </Typography>
                                                )}

                                                <Button
                                                    size="small"
                                                    startIcon={<Users />}
                                                    onClick={() => setDoctorDialog({ open: true, institutionId: institution.id })}
                                                >
                                                    Assigner Médecin
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                            </Grid>
                        )}
                    </Box>
                )}

                {/* Statistics Tab */}
                {activeTab === 1 && (
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Total Institutions
                                        </Typography>
                                        <Typography variant="h3" color="primary">
                                            {filteredInstitutions.length}
                                        </Typography>
                                        {institutions.length !== filteredInstitutions.length && (
                                            <Typography variant="body2" color="text.secondary">
                                                sur {institutions.length} au total
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Médecins Assignés
                                        </Typography>
                                        <Typography variant="h3" color="success.main">
                                            {filteredInstitutions.reduce((total, inst) => total + (inst.doctors?.length || 0), 0)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Types d'Institutions
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            {institutionTypes.map(type => {
                                                const count = filteredInstitutions.filter(inst => inst.type === type).length;
                                                return count > 0 ? (
                                                    <Chip 
                                                        key={type}
                                                        label={`${type}: ${count}`}
                                                        size="small"
                                                        sx={{ mr: 1, mb: 1 }}
                                                    />
                                                ) : null;
                                            })}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>

            {/* Institution Dialog */}
            <Dialog 
                open={institutionDialog.open} 
                onClose={() => setInstitutionDialog({ open: false, mode: 'add', data: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {institutionDialog.mode === 'add' ? 'Ajouter' : 'Modifier'} une Institution
                </DialogTitle>
                <DialogContent>
                    {/* Information about credential generation */}
                    {institutionDialog.mode === 'add' && (
                        <Alert 
                            severity={institutionForm.type === 'cabinet privé' ? 'info' : 'success'} 
                            sx={{ mb: 2 }}
                        >
                            <AlertTitle>
                                {institutionForm.type === 'cabinet privé' ? 'Information' : 'Identifiants de connexion'}
                            </AlertTitle>
                            {institutionForm.type === 'cabinet privé' ? (
                                'Les cabinets privés ne reçoivent pas d\'identifiants de connexion automatiques.'
                            ) : (
                                <>
                                    Des identifiants de connexion seront automatiquement générés pour cette institution.<br/>
                                    <strong>Nom d'utilisateur prévu:</strong> {institutionForm.nom ? 
                                        `${getCleanType(institutionForm.type)}.${cleanTextForUsername(institutionForm.nom)}` 
                                        : `${getCleanType(institutionForm.type)}.nomdelinstitution`}
                                </>
                            )}
                        </Alert>
                    )}
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nom de l'institution"
                                value={institutionForm.nom}
                                onChange={(e) => setInstitutionForm({...institutionForm, nom: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Type d'institution</InputLabel>
                                <Select
                                    value={institutionForm.type}
                                    label="Type d'institution"
                                    onChange={(e) => setInstitutionForm({...institutionForm, type: e.target.value})}
                                >
                                    {institutionTypes.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adresse"
                                value={institutionForm.adresse}
                                onChange={(e) => setInstitutionForm({...institutionForm, adresse: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={moroccanCities}
                                value={institutionForm.ville || null}
                                onChange={(event, newValue) => {
                                    setInstitutionForm({...institutionForm, ville: newValue || ""});
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Ville"
                                        placeholder="Sélectionnez une ville marocaine"
                                        required
                                    />
                                )}
                                freeSolo
                                autoSelect
                                filterOptions={(options, { inputValue }) =>
                                    options.filter(option =>
                                        option.toLowerCase().includes(inputValue.toLowerCase())
                                    )
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Code postal"
                                value={institutionForm.code_postal}
                                onChange={(e) => setInstitutionForm({...institutionForm, code_postal: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Pays"
                                value={institutionForm.pays}
                                onChange={(e) => setInstitutionForm({...institutionForm, pays: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Téléphone"
                                value={institutionForm.telephone}
                                onChange={(e) => setInstitutionForm({...institutionForm, telephone: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email de contact"
                                type="email"
                                value={institutionForm.email_contact}
                                onChange={(e) => setInstitutionForm({...institutionForm, email_contact: e.target.value})}
                                required
                            />
                        </Grid>

                        {/* Credentials Section - Only for non-cabinet privé */}
                        {institutionForm.type !== 'cabinet privé' && (
                            <>
                                {institutionDialog.mode === 'edit' && !institutionForm.username && (
                                    <Grid item xs={12}>
                                        <Alert severity="info">
                                            <AlertTitle>Identifiants manquants</AlertTitle>
                                            Cette institution n'a pas encore d'identifiants de connexion. 
                                            Vous pouvez en créer en remplissant les champs ci-dessous.
                                        </Alert>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom d'utilisateur"
                                        value={institutionForm.username}
                                        onChange={(e) => setInstitutionForm({...institutionForm, username: e.target.value})}
                                        InputProps={{
                                            readOnly: institutionDialog.mode === 'add',
                                        }}
                                        helperText={institutionDialog.mode === 'add' 
                                            ? "Généré automatiquement selon le format: type.nom" 
                                            : "Nom d'utilisateur actuel - vous pouvez le modifier"}
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                backgroundColor: institutionDialog.mode === 'add' ? '#f5f5f5' : 'transparent'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Mot de passe"
                                        type={showPassword ? 'text' : 'password'}
                                        value={institutionForm.password}
                                        onChange={(e) => setInstitutionForm({...institutionForm, password: e.target.value})}
                                        required={institutionDialog.mode === 'add'}
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
                                            )
                                        }}
                                        helperText={institutionDialog.mode === 'add' 
                                            ? "Minimum 6 caractères requis" 
                                            : "Laissez vide pour conserver le mot de passe actuel (min. 6 caractères si modifié)"}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={institutionForm.description}
                                onChange={(e) => setInstitutionForm({...institutionForm, description: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInstitutionDialog({ open: false, mode: 'add', data: null })}>
                        Annuler
                    </Button>
                    <Button onClick={handleSaveInstitution} variant="contained">
                        {institutionDialog.mode === 'add' ? 'Ajouter' : 'Modifier'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Doctor Assignment Dialog */}
            <Dialog 
                open={doctorDialog.open} 
                onClose={() => setDoctorDialog({ open: false, institutionId: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Assigner un Médecin</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Sélectionnez un médecin à assigner à cette institution :
                    </Typography>
                    
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {doctors.filter(doctor => 
                            !institutions
                                .find(inst => inst.id === doctorDialog.institutionId)
                                ?.doctors?.some(d => d.id === doctor.id)
                        ).map((doctor) => (
                            <Box 
                                key={doctor.id}
                                sx={{ 
                                    p: 2, 
                                    border: 1, 
                                    borderColor: 'divider', 
                                    borderRadius: 1, 
                                    mb: 1,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                                onClick={() => handleAssignDoctor(doctorDialog.institutionId, doctor.id)}
                            >
                                <Typography variant="subtitle1">
                                    Dr. {doctor.prenom} {doctor.nom}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {doctor.specialite || 'Spécialité non renseignée'}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDoctorDialog({ open: false, institutionId: null })}>
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Credentials Display Dialog */}
            <Dialog 
                open={credentialsDialog.open} 
                onClose={() => setCredentialsDialog({ open: false, credentials: null, institutionName: '' })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
                    🔑 Identifiants de Connexion Générés
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        <AlertTitle>Institution créée avec succès!</AlertTitle>
                        Les identifiants de connexion ont été générés pour <strong>{credentialsDialog.institutionName}</strong>
                    </Alert>
                    
                    <Box sx={{ 
                        bgcolor: 'grey.100', 
                        p: 3, 
                        borderRadius: 2, 
                        border: '2px solid',
                        borderColor: 'primary.main'
                    }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Identifiants de Connexion:
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Nom d'utilisateur:
                            </Typography>
                            <Typography variant="h6" sx={{ 
                                fontFamily: 'monospace', 
                                bgcolor: 'white', 
                                p: 1, 
                                borderRadius: 1,
                                border: '1px solid #ddd'
                            }}>
                                {credentialsDialog.credentials?.username}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Mot de passe temporaire:
                            </Typography>
                            <Typography variant="h6" sx={{ 
                                fontFamily: 'monospace', 
                                bgcolor: 'white', 
                                p: 1, 
                                borderRadius: 1,
                                border: '1px solid #ddd'
                            }}>
                                {credentialsDialog.credentials?.password}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        <AlertTitle>Important!</AlertTitle>
                        <Typography variant="body2">
                            • Veuillez noter ces identifiants et les transmettre de manière sécurisée à l'institution<br/>
                            • L'institution devra changer ce mot de passe lors de sa première connexion<br/>
                            • Ces identifiants permettent à l'institution d'accéder à son tableau de bord
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `Identifiants pour ${credentialsDialog.institutionName}:\nNom d'utilisateur: ${credentialsDialog.credentials?.username}\nMot de passe: ${credentialsDialog.credentials?.password}`
                            );
                        }}
                        startIcon={<Search />}
                    >
                        Copier
                    </Button>
                    <Button 
                        onClick={() => setCredentialsDialog({ open: false, credentials: null, institutionName: '' })}
                        variant="contained"
                    >
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InstitutionManagement; 