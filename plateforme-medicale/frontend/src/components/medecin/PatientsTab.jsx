import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    Chip,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Pagination
} from "@mui/material";
import { 
    MedicalServices as MedicalIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    LocalHospital as HospitalIcon,
    Home as HomeIcon
} from "@mui/icons-material";
import { formatDate, formatDateTime } from "../../utils/dateUtils";
import axios from "axios";

const PatientsTab = ({ patients: initialPatients }) => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState(initialPatients || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredPatients, setFilteredPatients] = useState(patients);
    const patientsPerPage = 12;

    // Fetch patients with search
    const fetchPatients = async (search = '') => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const params = search ? { search } : {};
            
            const response = await axios.get('/medecin/patients', {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            
            // Handle both old and new response formats
            const patientsData = response.data.data || response.data.patients || [];
            setPatients(patientsData);
            setFilteredPatients(patientsData);
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Erreur lors de la récupération des patients');
        } finally {
            setLoading(false);
        }
    };

    // Search functionality
    const handleSearch = async (event) => {
        event.preventDefault();
        setPage(1);
        await fetchPatients(searchTerm);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value === '') {
            // If search is cleared, fetch all patients
            fetchPatients();
        }
    };

    // Navigation
    const handlePatientClick = (patientId) => {
        navigate(`/medecin/patients/${patientId}/dossier`);
    };

    // Pagination
    useEffect(() => {
        const totalPatients = filteredPatients.length;
        setTotalPages(Math.ceil(totalPatients / patientsPerPage));
    }, [filteredPatients]);

    const getPaginatedPatients = () => {
        const startIndex = (page - 1) * patientsPerPage;
        const endIndex = startIndex + patientsPerPage;
        return filteredPatients.slice(startIndex, endIndex);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Calculate age
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

    // Get patient type chip
    const getPatientTypeChip = (patient) => {
        if (patient.patient_type === 'Hospitalisé') {
            return (
                <Chip 
                    icon={<HospitalIcon />}
                    label="Hospitalisé"
                    color="error"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                />
            );
        } else if (patient.patient_type === 'Ancien patient hospitalisé') {
            return (
                <Chip 
                    icon={<HospitalIcon />}
                    label="Ex-hospitalisé"
                    color="warning"
                    size="small"
                />
            );
        } else {
            return (
                <Chip 
                    icon={<HomeIcon />}
                    label="Ambulatoire"
                    color="info"
                    size="small"
                />
            );
        }
    };

    // Load patients on component mount
    useEffect(() => {
        if (!initialPatients || initialPatients.length === 0) {
            fetchPatients();
        }
    }, []);

    const renderPatientCard = (patient) => (
                        <Grid item xs={12} sm={6} md={4} key={patient.id}>
                            <Card 
                                sx={{ 
                                    boxShadow: 3, 
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        boxShadow: 6,
                                        transform: "translateY(-2px)",
                                        cursor: "pointer"
                                    }
                                }}
                            >
                                <CardActionArea 
                                    onClick={() => handlePatientClick(patient.id)}
                                    sx={{ height: "100%" }}
                                >
                                    <CardContent sx={{ position: "relative", pb: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                                {patient.prenom} {patient.nom}
                                            </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {calculateAge(patient.date_naissance)} ans • {patient.sexe === 'M' ? 'Homme' : 'Femme'}
                                </Typography>
                                {/* Patient Type Chip */}
                                <Box sx={{ mb: 1 }}>
                                    {getPatientTypeChip(patient)}
                                </Box>
                            </Box>
                                            <Tooltip title="Voir le dossier médical">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ 
                                                        color: "primary.main",
                                                        "&:hover": { bgcolor: "primary.light", color: "white" }
                                                    }}
                                                >
                                                    <MedicalIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>

                        {/* Hospital Information */}
                        {patient.hospital_name && (
                            <Box sx={{ mb: 2, p: 1.5, backgroundColor: 'rgba(76, 161, 175, 0.1)', borderRadius: 1 }}>
                                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold', display: 'block' }}>
                                    🏥 {patient.hospital_name}
                                </Typography>
                                {patient.admission_date && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        Admission: {formatDate(patient.admission_date)}
                                    </Typography>
                                )}
                                {patient.admission_reason && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        Motif: {patient.admission_reason}
                                    </Typography>
                                )}
                                {patient.ward_name && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        Service: {patient.ward_name}
                                    </Typography>
                                )}
                            </Box>
                        )}
                                        
                        {/* Contact Info */}
                        <Box sx={{ mb: 2 }}>
                            {patient.telephone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2">{patient.telephone}</Typography>
                                </Box>
                            )}
                            {patient.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                        {patient.email}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Last consultation */}
                        {patient.derniere_consultation && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Dernière consultation: {formatDate(patient.derniere_consultation)}
                            </Typography>
                        )}
                                        
                                        <Box 
                                            sx={{ 
                                                position: "absolute",
                                                bottom: 8,
                                                right: 8,
                                                opacity: 0.6,
                                                fontSize: "0.75rem",
                                                color: "primary.main",
                                                fontWeight: "medium"
                                            }}
                                        >
                                            Cliquer pour voir le dossier
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
    );

    const renderPatientTable = () => (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                                 <TableHead>
                     <TableRow>
                         <TableCell>Patient</TableCell>
                         <TableCell>Type</TableCell>
                         <TableCell>Contact</TableCell>
                         <TableCell>Dernière consultation</TableCell>
                         <TableCell>Actions</TableCell>
                     </TableRow>
                 </TableHead>
                <TableBody>
                    {getPaginatedPatients().map((patient) => (
                        <TableRow key={patient.id} hover>
                            <TableCell>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                        {patient.prenom} {patient.nom}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {calculateAge(patient.date_naissance)} ans • {patient.sexe === 'M' ? 'Homme' : 'Femme'}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    {getPatientTypeChip(patient)}
                                    {patient.hospital_name && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                            🏥 {patient.hospital_name}
                                        </Typography>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    {patient.telephone && (
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                                            {patient.telephone}
                                        </Typography>
                                    )}
                                    {patient.email && (
                                        <Typography variant="caption" color="text.secondary">
                                            {patient.email}
                                        </Typography>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>
                                {patient.derniere_consultation ? 
                                    formatDate(patient.derniere_consultation) : 
                                    'Aucune'
                                }
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Voir le dossier médical">
                                    <IconButton 
                                        color="primary"
                                        onClick={() => handlePatientClick(patient.id)}
                                    >
                                        <MedicalIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: "medium", mb: 1 }}>
                        Mes Patients
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Patients avec rendez-vous ou assignations hospitalières
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Vue en cartes">
                        <IconButton 
                            color={viewMode === 'cards' ? 'primary' : 'default'}
                            onClick={() => setViewMode('cards')}
                        >
                            <ViewModuleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Vue en tableau">
                        <IconButton 
                            color={viewMode === 'table' ? 'primary' : 'default'}
                            onClick={() => setViewMode('table')}
                        >
                            <ViewListIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Search */}
            <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Rechercher un patient (prénom, nom)"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type="submit" edge="end">
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Statistics */}
            {filteredPatients.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {filteredPatients.length} patient{filteredPatients.length > 1 ? 's' : ''} trouvé{filteredPatients.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
            )}

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Content */}
            {!loading && (
                <>
                    {filteredPatients.length === 0 ? (
                        <Box 
                            sx={{ 
                                textAlign: "center", 
                                py: 6,
                                bgcolor: "grey.50",
                                borderRadius: 2,
                                border: "1px dashed",
                                borderColor: "grey.300"
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
                            <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
                                {searchTerm ? 'Aucun patient trouvé' : 'Aucun patient'}
                            </Typography>
                            <Typography sx={{ color: "text.secondary" }}>
                                {searchTerm ? 
                                    'Essayez de modifier votre recherche' : 
                                    'Aucun patient n\'a encore eu de rendez-vous avec vous.'
                                }
                            </Typography>
                            {searchTerm && (
                                <Button 
                                    variant="outlined" 
                                    onClick={() => { setSearchTerm(''); fetchPatients(); }}
                                    sx={{ mt: 2 }}
                                >
                                    Voir tous les patients
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <>
                            {viewMode === 'cards' ? (
                                <Grid container spacing={2}>
                                    {getPaginatedPatients().map(renderPatientCard)}
            </Grid>
                            ) : (
                                renderPatientTable()
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination 
                                        count={totalPages} 
                                        page={page} 
                                        onChange={handlePageChange}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default PatientsTab; 