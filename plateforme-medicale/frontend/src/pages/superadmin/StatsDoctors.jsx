import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Alert,
  Tooltip,
  IconButton,
  Avatar,
  Rating
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  LocalHospital as DoctorIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
  WorkHistory as WorkHistoryIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Psychology as PsychologyIcon,
  MonitorHeart as CardiologyIcon,
  ChildCare as PediatricsIcon,
  Healing as HealingIcon
} from '@mui/icons-material';

const StatsDoctors = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [specialty, setSpecialty] = useState('all');
  const [region, setRegion] = useState('all');
  const [stats, setStats] = useState({
    totalDoctors: 0,
    activeDoctors: 0,
    averageRating: 0,
    totalConsultations: 0,
    doctorsBySpecialty: [],
    doctorsByExperience: [],
    topPerformers: [],
    consultationTrends: [],
    workloadDistribution: [],
    patientSatisfaction: [],
    doctorsByInstitution: [],
    specialtyPerformance: [],
    availabilityMetrics: []
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchDoctorStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/superadmin/stats/doctors?period=${period}&specialty=${specialty}&region=${region}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        console.error('Error fetching doctor statistics:', error);
        // Fallback to basic stats if API fails
        const fallbackStats = {
          totalDoctors: 0,
          activeDoctors: 0,
          averageRating: 0,
          totalConsultations: 0,
          doctorsBySpecialty: [],
          doctorsByExperience: [],
          topPerformers: [],
          doctorsByInstitution: [],
          specialtyPerformance: [],
          availabilityMetrics: []
        };
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorStats();
  }, [period, specialty, region]);

  const getSpecialtyIcon = (specialtyName) => {
    const icons = {
      'Cardiologie': <CardiologyIcon />,
      'Pédiatrie': <PediatricsIcon />,
      'Neurologie': <PsychologyIcon />,
      'Orthopédie': <HealingIcon />,
      'Dermatologie': <HealingIcon />,
      'Gynécologie': <HealingIcon />
    };
    return icons[specialtyName] || <DoctorIcon />;
  };

  const getStatusColor = (status) => {
    const colors = {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
    };
    return colors[status] || '#9E9E9E';
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/superadmin/export/doctors?period=${period}&specialty=${specialty}&region=${region}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `doctor-statistics-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting doctor statistics:', error);
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
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          Statistiques des Médecins
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Analyse complète des médecins, performance et satisfaction patients
        </Typography>
        
        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Période</InputLabel>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="quarter">Ce trimestre</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Spécialité</InputLabel>
            <Select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="all">Toutes</MenuItem>
              <MenuItem value="cardiologie">Cardiologie</MenuItem>
              <MenuItem value="pediatrie">Pédiatrie</MenuItem>
              <MenuItem value="neurologie">Neurologie</MenuItem>
              <MenuItem value="orthopédie">Orthopédie</MenuItem>
              <MenuItem value="dermatologie">Dermatologie</MenuItem>
              <MenuItem value="gynécologie">Gynécologie</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Région</InputLabel>
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="all">Toutes</MenuItem>
              <MenuItem value="casablanca">Casablanca</MenuItem>
              <MenuItem value="rabat">Rabat</MenuItem>
              <MenuItem value="marrakech">Marrakech</MenuItem>
              <MenuItem value="fes">Fès</MenuItem>
              <MenuItem value="tanger">Tanger</MenuItem>
              <MenuItem value="agadir">Agadir</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Actualiser
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportData}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Exporter
          </Button>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalDoctors.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Médecins
                  </Typography>
                </Box>
                <DoctorIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.activeDoctors.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Médecins Actifs
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.averageRating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Note Moyenne
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalConsultations.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Consultations
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Doctors by Specialty */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} />
              Répartition par Spécialité
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={stats.doctorsBySpecialty}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {stats.doctorsBySpecialty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Workload Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <WorkHistoryIcon sx={{ mr: 1 }} />
              Distribution de la Charge de Travail
            </Typography>
            <Box sx={{ mt: 2 }}>
              {stats.workloadDistribution.map((category, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{category.category}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {category.count} médecins ({category.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={category.percentage}
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: category.color
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Consultation Trends */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Évolution des Consultations
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <ComposedChart data={stats.consultationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="consultations" fill="#667eea" name="Total Consultations" />
                <Line yAxisId="right" type="monotone" dataKey="avgPerDoctor" stroke="#FF9800" strokeWidth={3} name="Moyenne par Médecin" />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ mr: 1 }} />
              Top Performers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Médecin</TableCell>
                    <TableCell>Spécialité</TableCell>
                    <TableCell align="center">Note</TableCell>
                    <TableCell align="center">Consultations</TableCell>
                    <TableCell align="center">Satisfaction</TableCell>
                    <TableCell>Institution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topPerformers.map((doctor, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {doctor.avatar}
                          </Avatar>
                          <Typography variant="body2">{doctor.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getSpecialtyIcon(doctor.specialty)}
                          label={doctor.specialty}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Rating value={doctor.rating} readOnly size="small" precision={0.1} />
                          <Typography variant="body2">{doctor.rating}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{doctor.consultations}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${doctor.satisfaction}%`}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{doctor.institution}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Patient Satisfaction by Specialty */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Satisfaction par Spécialité
            </Typography>
            {stats.patientSatisfaction.map((item, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {item.specialty}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'primary.main' }}>
                    {item.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Rating value={item.rating} readOnly size="small" precision={0.1} />
                <Typography variant="caption" color="text.secondary">
                  {item.reviews} avis
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Doctors by Institution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} />
              Médecins par Institution
            </Typography>
            <Grid container spacing={2}>
              {stats.doctorsByInstitution.map((institution, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {institution.name}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                          {institution.doctors}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          médecins
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">
                          {institution.consultations.toLocaleString()} consultations
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={institution.satisfaction} readOnly size="small" precision={0.1} />
                        <Typography variant="body2">{institution.satisfaction}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Experience Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Répartition par Expérience
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={stats.doctorsByExperience}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Specialty Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Performance par Spécialité
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <ScatterChart data={stats.specialtyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="efficiency" name="Efficacité" unit="%" />
                <YAxis dataKey="satisfaction" name="Satisfaction" domain={[4.0, 5.0]} />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={stats.specialtyPerformance} fill="#667eea" />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Availability Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} />
              Métriques de Disponibilité
            </Typography>
            <Grid container spacing={3}>
              {stats.availabilityMetrics.map((metric, index) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <Card sx={{ height: '100%', border: `2px solid ${getStatusColor(metric.status)}` }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: getStatusColor(metric.status) }}>
                        {metric.value}{metric.metric.includes('Taux') ? '%' : metric.metric.includes('Délai') ? ' jours' : 'h'}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {metric.metric}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Objectif: {metric.target}{metric.metric.includes('Taux') ? '%' : metric.metric.includes('Délai') ? ' jours' : 'h'}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((metric.value / metric.target) * 100, 100)}
                        sx={{ 
                          mt: 2, 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(metric.status)
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Insights Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Insights sur les Médecins
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Excellence:</strong> Note moyenne de {stats.averageRating} avec 94% de médecins actifs
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Attention:</strong> 4.8% des médecins sont en surcharge de travail
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Opportunité:</strong> Forte demande en pédiatrie et cardiologie
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsDoctors; 