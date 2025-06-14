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
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  Business as BusinessIcon,
  LocalHospital as HospitalIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  AccountBalance as AccountBalanceIcon,
  MedicalServices as MedicalIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  SwapHoriz as SwapIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const StatsInstitutions = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [institutionType, setInstitutionType] = useState('all');
  const [region, setRegion] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    activeInstitutions: 0,
    newInstitutions: 0,
    totalDoctors: 0,
    institutionTypes: [],
    facilityUsage: [],
    doctorCoordination: [],
    crossReferrals: [],
    institutionGrowth: [],
    performanceMetrics: [],
    regionDistribution: [],
    capacityUtilization: [],
    patientVolume: [],
    specialtyDistribution: [],
    topPerformers: []
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchInstitutionStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/superadmin/stats/institutions?period=${period}&type=${institutionType}&region=${region}`, {
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
        console.error('Error fetching institution statistics:', error);
        // Fallback to basic stats if API fails
        const fallbackStats = {
          totalInstitutions: 0,
          activeInstitutions: 0,
          newInstitutions: 0,
          totalDoctors: 0,
          institutionTypes: [],
          facilityUsage: [],
          doctorCoordination: [],
          crossReferrals: [],
          institutionGrowth: [],
          performanceMetrics: [],
          regionDistribution: [],
          capacityUtilization: [],
          patientVolume: [],
          specialtyDistribution: [],
          topPerformers: []
        };
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutionStats();
  }, [period, institutionType, region]);

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
      const response = await fetch(`/api/admin/superadmin/export/institutions?period=${period}&region=${region}&type=${institutionType}`, {
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
        a.download = `institution-statistics-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting institution statistics:', error);
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
          Performance des Institutions
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Analyse complète de l'utilisation des installations, coordination et croissance institutionnelle
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
          <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Type</InputLabel>
            <Select value={institutionType} onChange={(e) => setInstitutionType(e.target.value)}>
              <MenuItem value="all">Tous types</MenuItem>
              <MenuItem value="hospital">Hôpitaux</MenuItem>
              <MenuItem value="clinic">Cliniques</MenuItem>
              <MenuItem value="private">Cabinets privés</MenuItem>
              <MenuItem value="medical_center">Centres médicaux</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Région</InputLabel>
            <Select value={region} onChange={(e) => setRegion(e.target.value)}>
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
                    Total Institutions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalInstitutions}
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    Institutions Actives
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.activeInstitutions}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {((stats.activeInstitutions / stats.totalInstitutions) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <HospitalIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    Nouvelles Institutions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.newInstitutions}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Ce mois
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    Total Médecins
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalDoctors}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {(stats.totalDoctors / stats.activeInstitutions).toFixed(1)} par institution
                  </Typography>
                </Box>
                <MedicalIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Vue d'ensemble" />
          <Tab label="Utilisation" />
          <Tab label="Coordination" />
          <Tab label="Performance" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Grid container spacing={3}>
        {/* Overview Tab */}
        {activeTab === 0 && (
          <>
            {/* Institution Types */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon sx={{ mr: 1 }} />
                  Types d'Institutions
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={stats.institutionTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {stats.institutionTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Institution Growth */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Croissance Institutionnelle
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <ComposedChart data={stats.institutionGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="new" fill="#43e97b" name="Nouvelles institutions" />
                    <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#ff7300" name="Croissance %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Regional Distribution */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  Distribution Régionale
                </Typography>
                <Grid container spacing={2}>
                  {stats.regionDistribution.map((region, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {region.region}
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', my: 1 }}>
                          {region.institutions}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={region.percentage} 
                            sx={{ flexGrow: 1 }}
                          />
                          <Typography variant="body2">{region.percentage}%</Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </>
        )}

        {/* Utilization Tab */}
        {activeTab === 1 && (
          <>
            {/* Facility Usage */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <AssessmentIcon sx={{ mr: 1 }} />
                  Utilisation des Installations
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Institution</TableCell>
                        <TableCell align="right">Consultations</TableCell>
                        <TableCell align="right">Médecins</TableCell>
                        <TableCell align="right">Utilisation</TableCell>
                        <TableCell align="right">Efficacité</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.facilityUsage.map((facility, index) => (
                        <TableRow key={index}>
                          <TableCell>{facility.name}</TableCell>
                          <TableCell align="right">{facility.consultations.toLocaleString()}</TableCell>
                          <TableCell align="right">{facility.doctors}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={facility.utilization} 
                                sx={{ flexGrow: 1, maxWidth: 100 }}
                              />
                              <Typography variant="body2">{facility.utilization}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={`${facility.efficiency}%`}
                              size="small"
                              color={facility.efficiency > 90 ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Capacity Utilization */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Utilisation des Capacités
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={stats.capacityUtilization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="institution" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="percentage" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Patient Volume Trends */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Évolution du Volume de Patients
                </Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={stats.patientVolume}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="volume" stroke="#43e97b" fill="#43e97b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </>
        )}

        {/* Coordination Tab */}
        {activeTab === 2 && (
          <>
            {/* Doctor Coordination */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <GroupsIcon sx={{ mr: 1 }} />
                  Coordination des Médecins
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Institution</TableCell>
                        <TableCell align="right">Coordination</TableCell>
                        <TableCell align="right">Efficacité Planning</TableCell>
                        <TableCell align="right">Conflits</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.doctorCoordination.map((coord, index) => (
                        <TableRow key={index}>
                          <TableCell>{coord.institution}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={coord.coordination} 
                                sx={{ flexGrow: 1, maxWidth: 100 }}
                                color={coord.coordination > 90 ? 'success' : 'warning'}
                              />
                              <Typography variant="body2">{coord.coordination}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">{coord.scheduleEfficiency}%</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={coord.conflicts}
                              size="small"
                              color={coord.conflicts < 5 ? 'success' : coord.conflicts < 10 ? 'warning' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Cross Referrals */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <SwapIcon sx={{ mr: 1 }} />
                  Références Croisées
                </Typography>
                {stats.crossReferrals.map((referral, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {referral.from} → {referral.to}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'primary.main', my: 1 }}>
                      {referral.count} références
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={referral.success} 
                        sx={{ flexGrow: 1 }}
                        color="success"
                      />
                      <Typography variant="caption">{referral.success}%</Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Specialty Distribution */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Distribution des Spécialités
                </Typography>
                <Grid container spacing={2}>
                  {stats.specialtyDistribution.map((specialty, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {specialty.specialty}
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>
                          {specialty.institutions}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {specialty.percentage}% des institutions
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={specialty.percentage} 
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

        {/* Performance Tab */}
        {activeTab === 3 && (
          <>
            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Métriques de Performance
                </Typography>
                {stats.performanceMetrics.map((metric, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">{metric.metric}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {metric.value}
                          {metric.metric.includes('Temps') ? ' min' : 
                           metric.metric.includes('Taux') || metric.metric.includes('Satisfaction') || metric.metric.includes('Efficacité') ? 
                           (metric.metric.includes('Satisfaction') ? '/5' : '%') : ''}
                        </Typography>
                        <Chip 
                          label={metric.status === 'success' ? 'Objectif atteint' : 'À améliorer'}
                          size="small"
                          color={metric.status}
                        />
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.metric.includes('Satisfaction') ? (metric.value / 5) * 100 : 
                             metric.metric.includes('Temps') ? Math.max(0, 100 - (metric.value / metric.target) * 100) :
                             (metric.value / metric.target) * 100} 
                      sx={{ height: 8, borderRadius: 4 }}
                      color={metric.status}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Top Performers */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <StarIcon sx={{ mr: 1 }} />
                  Meilleures Institutions
                </Typography>
                {stats.topPerformers.map((performer, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {performer.name}
                      </Typography>
                      <Chip label={performer.type} size="small" color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={performer.rating} readOnly size="small" precision={0.1} />
                      <Typography variant="body2">{performer.rating}</Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Consultations</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {performer.consultations.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Efficacité</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {performer.efficiency}%
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">Croissance</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(performer.growth, 20) * 5} 
                          sx={{ flexGrow: 1 }}
                          color="success"
                        />
                        <Typography variant="body2">+{performer.growth}%</Typography>
                      </Box>
                    </Box>
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

export default StatsInstitutions; 