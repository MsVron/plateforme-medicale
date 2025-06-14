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
  Rating,
  Tabs,
  Tab
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Favorite as FavoriteIcon,
  Search as SearchIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  HealthAndSafety as HealthIcon,
  Timeline as TimelineIcon,
  AccountBox as AccountBoxIcon,
  Star as StarIcon
} from '@mui/icons-material';

const StatsPatients = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState(0);
  const [ageGroup, setAgeGroup] = useState('all');
  const [region, setRegion] = useState('all');
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    newPatients: 0,
    verifiedPatients: 0,
    patientActivity: [],
    demographicBreakdown: [],
    healthTrends: [],
    favoriteMetrics: [],
    bookingPatterns: [],
    ageDistribution: [],
    genderDistribution: [],
    locationDistribution: [],
    engagementMetrics: [],
    topConditions: [],
    patientJourney: []
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchPatientStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/superadmin/stats/patients?period=${period}&ageGroup=${ageGroup}&region=${region}`, {
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
        console.error('Error fetching patient statistics:', error);
        // Fallback to basic stats if API fails
        const fallbackStats = {
          totalPatients: 0,
          activePatients: 0,
          newPatients: 0,
          verifiedPatients: 0,
          patientActivity: [],
          demographicBreakdown: [],
          healthTrends: [],
          locationDistribution: [],
          engagementMetrics: [],
          topConditions: [],
          patientJourney: []
        };
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientStats();
  }, [period, ageGroup, region]);

  const getActivityIcon = (iconName) => {
    const icons = {
      search: <SearchIcon />,
      event: <EventIcon />,
      timeline: <TimelineIcon />,
      favorite: <FavoriteIcon />,
      star: <StarIcon />
    };
    return icons[iconName] || <AccountBoxIcon />;
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/superadmin/export/patients?period=${period}&ageGroup=${ageGroup}&region=${region}`, {
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
        a.download = `patient-statistics-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting patient statistics:', error);
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
          Engagement des Patients
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Analyse complète de l'activité, démographie et tendances de santé des patients
        </Typography>
        
        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Période</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <MenuItem value="week">7 derniers jours</MenuItem>
              <MenuItem value="month">30 derniers jours</MenuItem>
              <MenuItem value="quarter">3 derniers mois</MenuItem>
              <MenuItem value="year">12 derniers mois</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ bgcolor: 'white', color: 'primary.main' }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportData}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
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
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Patients
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalPatients.toLocaleString()}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Patients Actifs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.activePatients.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {((stats.activePatients / stats.totalPatients) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <HealthIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Nouveaux Patients
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.newPatients.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Ce mois
                  </Typography>
                </Box>
                <PersonAddIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: 'black' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Patients Vérifiés
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.verifiedPatients.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {((stats.verifiedPatients / stats.totalPatients) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <SecurityIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Activité" />
          <Tab label="Démographie" />
          <Tab label="Santé" />
          <Tab label="Engagement" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Grid container spacing={3}>
        {/* Activity Tab */}
        {activeTab === 0 && (
          <>
            {/* Patient Activity */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Activité des Patients
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={stats.patientActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Booking Patterns */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  Tendances de Réservation
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <ComposedChart data={stats.bookingPatterns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="bookings" fill="#43e97b" name="Réservations" />
                    <Line yAxisId="right" type="monotone" dataKey="success" stroke="#ff7300" name="Taux de succès %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Patient Journey */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  Parcours Patient
                </Typography>
                <Grid container spacing={2}>
                  {stats.patientJourney.map((stage, index) => (
                    <Grid item xs={12} sm={6} md={2} key={index}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {stage.patients.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {stage.stage}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stage.conversion}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={stage.conversion} 
                          sx={{ mt: 1 }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Demographics Tab */}
        {activeTab === 1 && (
          <>
            {/* Age Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Distribution par Âge
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={stats.ageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {stats.ageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Gender Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Distribution par Genre
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={stats.genderDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {stats.genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Geographic Distribution */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  Distribution Géographique
                </Typography>
                <Grid container spacing={2}>
                  {stats.locationDistribution.map((location, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {location.region}
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', my: 1 }}>
                          {location.patients.toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={location.percentage} 
                            sx={{ flexGrow: 1 }}
                          />
                          <Typography variant="body2">{location.percentage}%</Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Health Tab */}
        {activeTab === 2 && (
          <>
            {/* Health Trends */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <HealthIcon sx={{ mr: 1 }} />
                  Tendances de Santé
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Condition</TableCell>
                        <TableCell align="right">Nombre</TableCell>
                        <TableCell align="right">Pourcentage</TableCell>
                        <TableCell align="right">Tendance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.healthTrends.map((condition, index) => (
                        <TableRow key={index}>
                          <TableCell>{condition.condition}</TableCell>
                          <TableCell align="right">{condition.count.toLocaleString()}</TableCell>
                          <TableCell align="right">{condition.percentage}%</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={condition.trend}
                              size="small"
                              color={condition.trend.startsWith('+') ? 'error' : 'success'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Top Conditions */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Principales Consultations
                </Typography>
                {stats.topConditions.map((condition, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {condition.condition}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {condition.specialty}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      {condition.count.toLocaleString()} cas
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </>
        )}

        {/* Engagement Tab */}
        {activeTab === 3 && (
          <>
            {/* Engagement Metrics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Métriques d'Engagement
                </Typography>
                {stats.engagementMetrics.map((metric, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">{metric.metric}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {metric.value}
                          {metric.metric.includes('Temps') ? ' min' : 
                           metric.metric.includes('Taux') ? '%' : ''}
                        </Typography>
                        <Chip 
                          label={`+${metric.change}%`}
                          size="small"
                          color={metric.change > 0 ? 'success' : 'error'}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(metric.value, 100)} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Favorite Metrics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon sx={{ mr: 1 }} />
                  Métriques des Favoris
                </Typography>
                {stats.favoriteMetrics.map((metric, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {metric.metric}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                      {typeof metric.value === 'number' && metric.value % 1 !== 0 
                        ? metric.value.toFixed(1) 
                        : metric.value.toLocaleString()}
                      {metric.percentage !== null && metric.percentage !== undefined ? '%' : ''}
                    </Typography>
                    {metric.percentage !== null && metric.percentage !== undefined && (
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.percentage} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    )}
                  </Box>
                ))}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default StatsPatients; 