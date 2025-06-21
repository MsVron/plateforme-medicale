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
    CircularProgress
} from '@mui/material';
import {
    Business as Building,
    Add as Plus,
    Edit as Edit,
    Delete as Trash2,
    People as Users,
    MedicalServices as Stethoscope,
    Search
} from '@mui/icons-material';

const InstitutionManagement = () => {
    const [institutions, setInstitutions] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    
    // Dialog states
    const [institutionDialog, setInstitutionDialog] = useState({ open: false, mode: 'add', data: null });
    const [doctorDialog, setDoctorDialog] = useState({ open: false, institutionId: null });
    
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
        type: 'hôpital'
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

    const fetchInstitutions = async () => {
        try {
            const response = await axios.get('/admin/institutions');
            setInstitutions(response.data);
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
            type: 'hôpital'
        });
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
            type: institution.type || 'hôpital'
        });
        setInstitutionDialog({ open: true, mode: 'edit', data: institution });
    };

    const handleSaveInstitution = async () => {
        try {
            if (institutionDialog.mode === 'add') {
                await axios.post('/admin/institutions', institutionForm);
                setSuccess('Institution ajoutée avec succès');
            } else {
                await axios.put(`/admin/institutions/${institutionDialog.data.id}`, institutionForm);
                setSuccess('Institution modifiée avec succès');
            }
            
            setInstitutionDialog({ open: false, mode: 'add', data: null });
            fetchInstitutions();
            setTimeout(() => setSuccess(''), 3000);
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
                    <Typography variant="h4" component="h1">
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
                        <Grid container spacing={3}>
                            {institutions.map((institution) => (
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
                                            {institutions.length}
                                        </Typography>
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
                                            {institutions.reduce((total, inst) => total + (inst.doctors?.length || 0), 0)}
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
                                                const count = institutions.filter(inst => inst.type === type).length;
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
                            <TextField
                                fullWidth
                                label="Ville"
                                value={institutionForm.ville}
                                onChange={(e) => setInstitutionForm({...institutionForm, ville: e.target.value})}
                                required
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
        </Box>
    );
};

export default InstitutionManagement; 