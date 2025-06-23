import React, { useState, Suspense, lazy, useEffect } from 'react';
import './DoctorSearch.css';
import {
  Box, 
  Typography, 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Divider,
  Button,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Avatar,
  LinearProgress,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EuroIcon from '@mui/icons-material/Euro';
import PersonIcon from '@mui/icons-material/Person';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SimpleMap from './SimpleMap';
import FavoriteButton from './FavoriteButton';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatDateTime, formatTime, dateTimePickerProps, formatDate } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const MapBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '400px',
  marginBottom: theme.spacing(4),
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    zIndex: 1
  }
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
}));

const DoctorListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(76, 161, 175, 0.2)',
  },
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
}));

const DoctorAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  marginRight: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  fontSize: '1.2rem',
  fontWeight: 'bold'
}));

const PriceTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 'bold',
  borderRadius: theme.shape.borderRadius,
}));

const SearchButton = styled(Button)(({ theme }) => ({
  height: '56px', // Match the height of the input fields
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  padding: theme.spacing(0, 3),
  boxShadow: '0 4px 8px rgba(76, 161, 175, 0.15)'
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#ffffff',
  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
  marginBottom: theme.spacing(2)
}));

const ResultsTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  display: 'inline-block'
}));

const DoctorSearchView = ({
  loading,
  doctors,
  specialties,
  cities,
  error,
  filters,
  handleFilterChange,
  handleSearch,
  mapCenter,
  zoom,
  mapEnabled,
  userLocation,
  searchClicked,
  debug,
  resetSearch
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [selectedDoctorForAppointment, setSelectedDoctorForAppointment] = useState(null);
  const navigate = useNavigate();

  // Reset search state when component unmounts or filters change significantly
  useEffect(() => {
    return () => {
      if (resetSearch) resetSearch();
    };
  }, [resetSearch]);

  const handleCardClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
    setShowMap(true);
  };

  // Create specialty options with better wording
  const specialtyOptions = specialties.map(specialty => ({
    id: specialty.id,
    label: specialty.nom
  }));
  // Don't add default option - let Autocomplete handle empty state

  // Calculate proximity in km (mock function)
  const calculateProximity = (doctor) => {
    if (!userLocation) return null;
    
    // Simple distance calculation (this is just a placeholder)
    const lat1 = userLocation.lat;
    const lon1 = userLocation.lng;
    const lat2 = parseFloat(doctor.latitude);
    const lon2 = parseFloat(doctor.longitude);
    
    if (isNaN(lat2) || isNaN(lon2)) return null;
    
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    
    return Math.round(distance);
  };

  const handleBookAppointment = (doctor, e) => {
    e.stopPropagation();
    navigate(`/patient/book-appointment/${doctor.id}`);
  };

  const handleAppointmentSuccess = () => {
    // You can add any success handling here, like showing a notification
  };

  return (
    <Box sx={{ p: 3 }} className="doctor-search-container">
      <HeaderTypography variant="h4" gutterBottom className="doctor-search-header">
        Rechercher un médecin
      </HeaderTypography>
      
      {error && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderLeft: '4px solid #c62828',
            position: 'relative'
          }}
        >
          <Typography>{error}</Typography>
          {debug && (
            <IconButton 
              size="small" 
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => setShowDebug(!showDebug)}
            >
              <BugReportIcon />
            </IconButton>
          )}
        </Paper>
      )}
      
      {showDebug && debug && (
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Informations de débogage</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ maxHeight: '200px', overflow: 'auto', fontSize: '0.8rem' }}>
              {JSON.stringify(debug, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}
      
      <FiltersContainer className="filters-container">
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              options={specialtyOptions}
              getOptionLabel={(option) => option.label || ''}
              value={filters.speciality ? specialtyOptions.find(option => option.id.toString() === filters.speciality.toString()) : null}
              onChange={(event, newValue) => handleFilterChange('speciality', newValue?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Spécialité"
                  placeholder="Toutes spécialités"
                  fullWidth
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={cities}
              value={filters.city}
              onChange={(e, newValue) => handleFilterChange('city', newValue || '')}
              renderInput={(params) => (
                <TextField 
                  {...params}
                  label="Ville"
                  placeholder="Toutes villes"
                  fullWidth
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Nom du médecin"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SearchButton
                variant="contained" 
                color="primary"
                onClick={() => {
                  // Reset previous search results before new search
                  if (resetSearch) resetSearch();
                  handleSearch();
                }}
                startIcon={<SearchIcon />}
              >
                Rechercher
              </SearchButton>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
          Astuce: Vous pouvez filtrer par nom, ville ou spécialité. Chaque critère est combiné avec les autres.
        </Typography>
      </FiltersContainer>
      
      {searchClicked && (
        <>
          {loading ? (
            <Box sx={{ width: '100%', mt: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, color: 'white' }}>
                Recherche des médecins en cours...
              </Typography>
              <LinearProgress />
            </Box>
          ) : (
            <>
              <ResultsTitle variant="h6" className="results-title">
                {doctors.length} médecins trouvés
              </ResultsTitle>
              
              {showMap && selectedDoctor && mapEnabled && (
                <MapBox id="doctor-map">
                  <SimpleMap 
                    doctors={doctors}
                    selectedDoctor={selectedDoctor}
                    mapCenter={mapCenter}
                    zoom={zoom}
                    userLocation={userLocation}
                  />
                </MapBox>
              )}
              
              {doctors.length > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
                  {doctors.map((doctor) => {
                    const proximity = calculateProximity(doctor);
                    
                    return (
                      <DoctorListItem 
                        key={doctor.id} 
                        onClick={() => handleCardClick(doctor)}
                        className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                        sx={{
                          borderLeft: selectedDoctor?.id === doctor.id ? '4px solid #4ca1af' : '4px solid transparent',
                        }}
                      >
                        <Box sx={{ display: 'flex', width: '100%' }}>
                          <DoctorAvatar className="doctor-avatar">
                            {doctor.prenom[0]}{doctor.nom[0]}
                          </DoctorAvatar>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                Dr. {doctor.prenom} {doctor.nom}
                              </Typography>
                              
                              {doctor.tarif_consultation && (
                                <PriceTag 
                                  className="price-tag"
                                  icon={<span style={{ fontSize: 16, fontWeight: 'bold' }}>DH</span>} 
                                  label={`${doctor.tarif_consultation} DH`}
                                />
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalHospitalIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {doctor.specialite_nom}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {doctor.ville}
                                </Typography>
                              </Box>
                              
                              {proximity && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <MyLocationIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: 20 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {proximity} km
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                              {doctor.temps_consultation_moyen && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccessTimeIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: 20 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {doctor.temps_consultation_moyen} min
                                  </Typography>
                                </Box>
                              )}
                              
                              {doctor.accepte_patients_walk_in && (
                                <Chip 
                                  label="Accepte patients directs" 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', ml: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <FavoriteButton doctorId={doctor.id} size="small" />
                              <Button 
                                variant="outlined" 
                                color="primary" 
                                startIcon={<CalendarMonthIcon />}
                                className="action-button"
                                sx={{ whiteSpace: 'nowrap' }}
                                onClick={(e) => handleBookAppointment(doctor, e)}
                              >
                                Prendre RDV
                              </Button>
                            </Box>
                            
                            <Button 
                              variant="text" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(doctor);
                              }}
                            >
                              Voir la fiche
                            </Button>
                          </Box>
                        </Box>
                      </DoctorListItem>
                    );
                  })}
                </List>
              ) : (
                <Box textAlign="center" my={4}>
                  <Alert severity="info">
                    Aucun médecin ne correspond à votre recherche. Essayez d'élargir vos critères.
                  </Alert>
                </Box>
              )}
            </>
          )}
        </>
      )}
      
      {selectedDoctor && showDetails && (
        <Dialog 
          open={showDetails} 
          onClose={() => setShowDetails(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ borderBottom: '1px solid #eee', position: 'relative' }}>
            Dr. {selectedDoctor.prenom} {selectedDoctor.nom}
            <IconButton
              aria-label="close"
              onClick={() => setShowDetails(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Informations
                  </Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      <strong>Spécialité:</strong> {selectedDoctor.specialite_nom}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>
                      <strong>Adresse:</strong> {selectedDoctor.adresse || 'Non spécifiée'}, {selectedDoctor.ville}
                    </Typography>
                  </Box>
                  {selectedDoctor.tarif_consultation && (
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <span style={{ marginRight: 8, color: '#1976d2', fontWeight: 'bold' }}>DH</span>
                      <Typography>
                        <strong>Tarif:</strong> {selectedDoctor.tarif_consultation} DH
                      </Typography>
                    </Box>
                  )}
                  {selectedDoctor.accepte_patients_walk_in && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ mr: 1, color: 'success.main' }} />
                      <Typography>
                        <strong>Accepte les patients directs</strong>
                      </Typography>
                    </Box>
                  )}
                  {selectedDoctor.temps_consultation_moyen && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>
                        <strong>Durée consultation:</strong> {selectedDoctor.temps_consultation_moyen} min
                      </Typography>
                    </Box>
                  )}
                </Box>
                

                
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Biographie
                  </Typography>
                  <Typography>
                    {selectedDoctor.biographie || 'Aucune biographie disponible.'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <MapBox sx={{ height: 250 }}>
                  <SimpleMap 
                    doctors={[selectedDoctor]}
                    selectedDoctor={selectedDoctor}
                    mapCenter={{ lat: parseFloat(selectedDoctor.latitude) || 31.7917, lng: parseFloat(selectedDoctor.longitude) || -7.0926 }}
                    zoom={13}
                    userLocation={userLocation}
                  />
                </MapBox>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CalendarMonthIcon />}
                    size="large"
                    sx={{ px: 4 }}
                    onClick={() => {
                      setShowDetails(false);
                      navigate(`/patient/book-appointment/${selectedDoctor.id}`);
                    }}
                  >
                    Prendre rendez-vous
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default DoctorSearchView; 