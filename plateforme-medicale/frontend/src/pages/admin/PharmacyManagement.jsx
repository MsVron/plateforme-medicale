import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    TextField,
    Alert,
    Box,
    Grid,
    IconButton,
    Tooltip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Chip
} from '@mui/material';
import { 
    LocalPharmacy as Pharmacy, 
    Add as Plus,
    Edit as Edit,
    Delete as Trash2,
    LocationOn as MapPin,
    Phone,
    Email,
    Schedule as Clock
} from '@mui/icons-material';

const PharmacyManagement = () => {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [pharmacyDialog, setPharmacyDialog] = useState({ open: false, mode: 'add', data: null });
    
    const [pharmacyForm, setPharmacyForm] = useState({
        nom: '',
        adresse: '',
        ville: '',
        code_postal: '',
        pays: 'Maroc',
        telephone: '',
        email_contact: '',
        site_web: '',
        description: '',
        horaires_ouverture: ''
    });

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const fetchPharmacies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/institutions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const pharmacyData = data.filter(inst => inst.type === 'pharmacie');
                setPharmacies(pharmacyData);
            } else {
                setError('Erreur lors de la récupération des pharmacies');
            }
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
            setError('Erreur lors de la récupération des pharmacies');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPharmacy = () => {
        setPharmacyForm({
            nom: '',
            adresse: '',
            ville: '',
            code_postal: '',
            pays: 'Maroc',
            telephone: '',
            email_contact: '',
            site_web: '',
            description: '',
            horaires_ouverture: ''
        });
        setPharmacyDialog({ open: true, mode: 'add', data: null });
    };

    const handleEditPharmacy = (pharmacy) => {
        setPharmacyForm({
            nom: pharmacy.nom || '',
            adresse: pharmacy.adresse || '',
            ville: pharmacy.ville || '',
            code_postal: pharmacy.code_postal || '',
            pays: pharmacy.pays || 'Maroc',
            telephone: pharmacy.telephone || '',
            email_contact: pharmacy.email_contact || '',
            site_web: pharmacy.site_web || '',
            description: pharmacy.description || '',
            horaires_ouverture: pharmacy.horaires_ouverture || ''
        });
        setPharmacyDialog({ open: true, mode: 'edit', data: pharmacy });
    };

    const handleSavePharmacy = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = pharmacyDialog.mode === 'add' 
                ? '/api/admin/institutions'
                : `/api/admin/institutions/${pharmacyDialog.data.id}`;
            
            const method = pharmacyDialog.mode === 'add' ? 'POST' : 'PUT';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...pharmacyForm,
                    type: 'pharmacie'
                })
            });

            if (response.ok) {
                setSuccess(`Pharmacie ${pharmacyDialog.mode === 'add' ? 'ajoutée' : 'modifiée'} avec succès`);
                setPharmacyDialog({ open: false, mode: 'add', data: null });
                fetchPharmacies();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving pharmacy:', error);
            setError('Erreur lors de la sauvegarde de la pharmacie');
        }
    };

    const handleDeletePharmacy = async (pharmacyId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pharmacie ?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/admin/institutions/${pharmacyId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setSuccess('Pharmacie supprimée avec succès');
                    fetchPharmacies();
                    setTimeout(() => setSuccess(''), 3000);
                } else {
                    setError('Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Error deleting pharmacy:', error);
                setError('Erreur lors de la suppression de la pharmacie');
            }
        }
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
                    <Pharmacy sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
                        Gestion des Pharmacies
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={handleAddPharmacy}
                >
                    Ajouter Pharmacie
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

            <Grid container spacing={3}>
                {pharmacies.map((pharmacy) => (
                    <Grid item xs={12} md={6} lg={4} key={pharmacy.id}>
                        <Card>
                            <CardHeader
                                title={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Pharmacy />
                                        <Typography variant="h6">{pharmacy.nom}</Typography>
                                    </Box>
                                }
                                action={
                                    <Box>
                                        <Tooltip title="Modifier">
                                            <IconButton onClick={() => handleEditPharmacy(pharmacy)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Supprimer">
                                            <IconButton 
                                                onClick={() => handleDeletePharmacy(pharmacy.id)}
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
                                        label="Pharmacie" 
                                        color="success" 
                                        size="small"
                                        icon={<Pharmacy />}
                                    />
                                </Box>
                                
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <MapPin sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {pharmacy.adresse}, {pharmacy.ville}
                                    </Typography>
                                </Box>
                                
                                {pharmacy.telephone && (
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            {pharmacy.telephone}
                                        </Typography>
                                    </Box>
                                )}
                                
                                {pharmacy.email_contact && (
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            {pharmacy.email_contact}
                                        </Typography>
                                    </Box>
                                )}

                                {pharmacy.description && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {pharmacy.description}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {pharmacies.length === 0 && (
                <Card>
                    <CardContent>
                        <Box textAlign="center" py={4}>
                            <Pharmacy sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                Aucune pharmacie enregistrée
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Commencez par ajouter une pharmacie au système.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Dialog 
                open={pharmacyDialog.open} 
                onClose={() => setPharmacyDialog({ open: false, mode: 'add', data: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {pharmacyDialog.mode === 'add' ? 'Ajouter' : 'Modifier'} une Pharmacie
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nom de la pharmacie"
                                value={pharmacyForm.nom}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, nom: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adresse"
                                value={pharmacyForm.adresse}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, adresse: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Ville"
                                value={pharmacyForm.ville}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, ville: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Code postal"
                                value={pharmacyForm.code_postal}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, code_postal: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Téléphone"
                                value={pharmacyForm.telephone}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, telephone: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email de contact"
                                type="email"
                                value={pharmacyForm.email_contact}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, email_contact: e.target.value})}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Site web"
                                value={pharmacyForm.site_web}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, site_web: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={pharmacyForm.description}
                                onChange={(e) => setPharmacyForm({...pharmacyForm, description: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPharmacyDialog({ open: false, mode: 'add', data: null })}>
                        Annuler
                    </Button>
                    <Button onClick={handleSavePharmacy} variant="contained">
                        {pharmacyDialog.mode === 'add' ? 'Ajouter' : 'Modifier'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PharmacyManagement; 