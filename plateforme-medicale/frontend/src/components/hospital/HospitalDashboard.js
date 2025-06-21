import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  LocalHospital,
  PersonAdd,
  Search,
  Bed,
  People,
  Assignment,
  Refresh,
  MedicalServices,
  MonitorHeart,
  Warning,
  Hotel,
  AssignmentInd
} from '@mui/icons-material';
import hospitalService from '../../services/hospitalService';
import PatientSearchTab from './PatientSearchTab';
import HospitalPatientsTab from './HospitalPatientsTab';
import WalkInPatientTab from './WalkInPatientTab';
import BedManagementTab from './BedManagementTab';
import SurgeryScheduleTab from './SurgeryScheduleTab';
import HospitalDoctorsTab from './HospitalDoctorsTab';

const HospitalDashboard = () => {
  const [tabValue, setTabValue] = useState(() => {
    // Set initial tab based on current path
    const path = window.location.pathname;
    if (path.includes('/patients/search')) return 0;
    if (path.includes('/patients') && !path.includes('/search')) return 1;
    if (path.includes('/patient-direct')) return 2;
    if (path.includes('/bed-management')) return 3;
    if (path.includes('/surgery-schedule')) return 4;
    if (path.includes('/doctors')) return 5;
    return 0; // default to search tab
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    admittedPatients: 0,
    availableBeds: 0,
    totalDoctors: 0,
    occupancyRate: 0,
    emergencyPatients: 0,
    scheduledSurgeries: 0,
    icuPatients: 0,
    averageStayDuration: 0,
    bedsByType: [],
    wardOccupancy: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Update tab when URL changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/patients/search')) setTabValue(0);
    else if (path.includes('/patients') && !path.includes('/search')) setTabValue(1);
    else if (path.includes('/patient-direct')) setTabValue(2);
    else if (path.includes('/bed-management')) setTabValue(3);
    else if (path.includes('/surgery-schedule')) setTabValue(4);
    else if (path.includes('/doctors')) setTabValue(5);
  }, [window.location.pathname]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const patientsData = await hospitalService.getHospitalPatients();
      const doctorsData = await hospitalService.getHospitalDoctors();
      
      // Add error handling for missing methods
      let bedsData = { totalBeds: 100, occupiedBeds: 0, bedsByType: [], wardOccupancy: [] };
      let surgeriesData = { scheduled: 0 };
      
      try {
        bedsData = await hospitalService.getBedStatistics();
      } catch (error) {
        console.warn('Bed statistics not available:', error);
      }
      
      try {
        surgeriesData = await hospitalService.getSurgeryStatistics();
      } catch (error) {
        console.warn('Surgery statistics not available:', error);
      }
      
      const patients = patientsData.patients || [];
      const admittedPatients = patients.filter(p => p.status === 'admitted' || p.status === 'active');
      const totalBeds = bedsData.totalBeds || 100;
      const occupiedBeds = bedsData.occupiedBeds || admittedPatients.length;
      
      setStats({
        totalPatients: patients.length,
        admittedPatients: admittedPatients.length,
        availableBeds: totalBeds - occupiedBeds,
        totalDoctors: doctorsData.doctors?.length || 0,
        occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        emergencyPatients: patients.filter(p => p.admission_reason?.toLowerCase().includes('urgence')).length,
        scheduledSurgeries: surgeriesData.scheduled || 0,
        icuPatients: patients.filter(p => p.ward_name?.toLowerCase().includes('icu')).length,
        averageStayDuration: calculateAverageStayDuration(patients),
        bedsByType: bedsData.bedsByType || [],
        wardOccupancy: bedsData.wardOccupancy || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageStayDuration = (patients) => {
    const activePatientsWithDates = patients.filter(p => 
      p.status === 'admitted' && p.admission_date
    );
    
    if (activePatientsWithDates.length === 0) return 0;
    
    const totalDays = activePatientsWithDates.reduce((sum, patient) => {
      const admissionDate = new Date(patient.admission_date);
      const now = new Date();
      const diffTime = Math.abs(now - admissionDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    return Math.round(totalDays / activePatientsWithDates.length);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    clearMessages();
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement du tableau de bord...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospital sx={{ fontSize: 40, color: 'white', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Tableau de Bord Hôpital
          </Typography>
        </Box>
        <Tooltip title="Actualiser les données">
          <IconButton onClick={fetchDashboardStats} sx={{ color: 'white' }}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Alert Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
          {success}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalPatients}
              </Typography>
              <Typography variant="body2">
                Total Patients
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.admittedPatients}
              </Typography>
              <Typography variant="body2">
                Patients Admis
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Bed sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.availableBeds}
              </Typography>
              <Typography variant="body2">
                Lits Disponibles
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalDoctors}
              </Typography>
              <Typography variant="body2">
                Médecins
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Hospital-Specific Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.emergencyPatients}
              </Typography>
              <Typography variant="body2">
                Urgences
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #5d4037 0%, #3e2723 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <MedicalServices sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.scheduledSurgeries}
              </Typography>
              <Typography variant="body2">
                Chirurgies Programmées
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #424242 0%, #212121 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <MonitorHeart sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.icuPatients}
              </Typography>
              <Typography variant="body2">
                Patients UCI
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #616161 0%, #424242 100%)',
            color: 'white',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Hotel sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.averageStayDuration}
              </Typography>
              <Typography variant="body2">
                Durée Moyenne (jours)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Occupancy Rate Indicator */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
          Taux d'Occupation Hospitalière
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            {stats.occupancyRate}% occupé
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={stats.occupancyRate} 
            sx={{ 
              flexGrow: 1, 
              mx: 2, 
              height: 8, 
              borderRadius: 4,
              '& .MuiLinearProgress-bar': {
                backgroundColor: stats.occupancyRate > 80 ? '#f44336' : 
                               stats.occupancyRate > 60 ? '#ff9800' : '#4caf50'
              }
            }} 
          />
          <Typography variant="body2" color="text.secondary">
            {stats.admittedPatients}/{stats.admittedPatients + stats.availableBeds} lits
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Recommandation : {stats.occupancyRate > 85 ? 'Capacité critique - Prévoir des transferts' : 
                           stats.occupancyRate > 70 ? 'Surveillance renforcée recommandée' : 
                           'Capacité normale'}
        </Typography>
      </Card>

      {/* Main Content Tabs */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                color: 'white'
              },
              '& .Mui-selected': {
                color: 'white !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'white'
              }
            }}
          >
            <Tab 
              icon={<Search />} 
              label="Rechercher Patient" 
              iconPosition="start"
            />
            <Tab 
              icon={<People />} 
              label="Patients Hôpital" 
              iconPosition="start"
            />
            <Tab 
              icon={<PersonAdd />} 
              label="Patient Direct" 
              iconPosition="start"
            />
            <Tab 
              icon={<Bed />} 
              label="Gestion des Lits" 
              iconPosition="start"
            />
            <Tab 
              icon={<MedicalServices />} 
              label="Chirurgies Programmées" 
              iconPosition="start"
            />
            <Tab 
              icon={<AssignmentInd />} 
              label="Médecins Hôpital" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <PatientSearchTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
          {tabValue === 1 && (
            <HospitalPatientsTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
          {tabValue === 2 && (
            <WalkInPatientTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
          {tabValue === 3 && (
            <BedManagementTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
              stats={stats}
            />
          )}
          {tabValue === 4 && (
            <SurgeryScheduleTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
          {tabValue === 5 && (
            <HospitalDoctorsTab 
              onSuccess={showSuccess} 
              onError={showError}
              onRefresh={fetchDashboardStats}
            />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default HospitalDashboard; 