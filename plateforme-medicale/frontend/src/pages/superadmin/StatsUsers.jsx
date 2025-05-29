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
  IconButton
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
  ComposedChart
} from 'recharts';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const StatsUsers = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [userType, setUserType] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    verifiedUsers: 0,
    usersByRole: [],
    usersByStatus: [],
    registrationTrends: [],
    activityMetrics: [],
    topInstitutions: [],
    recentUsers: [],
    geographicDistribution: []
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchUserStats = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStats = {
          totalUsers: 15420,
          activeUsers: 12350,
          newUsers: 284,
          verifiedUsers: 14890,
          usersByRole: [
            { name: 'Patients', value: 12500, color: '#4CAF50' },
            { name: 'Médecins', value: 1250, color: '#2196F3' },
            { name: 'Admins', value: 120, color: '#FF9800' },
            { name: 'Institutions', value: 450, color: '#9C27B0' },
            { name: 'Super Admins', value: 12, color: '#F44336' }
          ],
          usersByStatus: [
            { name: 'Actifs', value: 12350, color: '#4CAF50' },
            { name: 'Inactifs', value: 2580, color: '#FFC107' },
            { name: 'Suspendus', value: 320, color: '#F44336' },
            { name: 'En attente', value: 170, color: '#9E9E9E' }
          ],
          registrationTrends: [
            { month: 'Jan', patients: 850, medecins: 45, admins: 5, institutions: 12 },
            { month: 'Fév', patients: 920, medecins: 52, admins: 3, institutions: 8 },
            { month: 'Mar', patients: 1050, medecins: 38, admins: 7, institutions: 15 },
            { month: 'Avr', patients: 1180, medecins: 62, admins: 4, institutions: 20 },
            { month: 'Mai', patients: 1250, medecins: 48, admins: 6, institutions: 18 },
            { month: 'Jun', patients: 1420, medecins: 55, admins: 8, institutions: 22 }
          ],
          activityMetrics: [
            { metric: 'Connexions quotidiennes', value: 8750, change: 12.5 },
            { metric: 'Sessions moyennes', value: 45, change: -2.1 },
            { metric: 'Temps de session moyen', value: 28, change: 8.3 },
            { metric: 'Taux de rétention', value: 87.2, change: 4.7 }
          ],
          topInstitutions: [
            { name: 'CHU Hassan II', users: 450, growth: 15.2 },
            { name: 'Clinique Atlas', users: 380, growth: 8.7 },
            { name: 'Hôpital Ibn Sina', users: 320, growth: 12.1 },
            { name: 'Centre Médical Al Madina', users: 280, growth: 6.9 },
            { name: 'Polyclinique Al Amal', users: 250, growth: 18.5 }
          ],
          recentUsers: [
            { name: 'Dr. Ahmed Bennani', role: 'Médecin', institution: 'CHU Hassan II', status: 'verified', date: '2024-01-15' },
            { name: 'Sarah El Mansouri', role: 'Patient', institution: '-', status: 'active', date: '2024-01-15' },
            { name: 'Admin Casablanca', role: 'Admin', institution: 'Région Casa', status: 'active', date: '2024-01-14' },
            { name: 'Dr. Fatima Alaoui', role: 'Médecin', institution: 'Clinique Atlas', status: 'pending', date: '2024-01-14' }
          ],
          geographicDistribution: [
            { region: 'Casablanca-Settat', users: 4250, percentage: 27.6 },
            { region: 'Rabat-Salé-Kénitra', users: 3180, percentage: 20.6 },
            { region: 'Marrakech-Safi', users: 2850, percentage: 18.5 },
            { region: 'Fès-Meknès', users: 2120, percentage: 13.8 },
            { region: 'Tanger-Tétouan-Al Hoceïma', users: 1680, percentage: 10.9 },
            { region: 'Autres', users: 1340, percentage: 8.7 }
          ]
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [period, userType]);

  const getStatusColor = (status) => {
    const colors = {
      verified: '#4CAF50',
      active: '#2196F3',
      pending: '#FF9800',
      suspended: '#F44336'
    };
    return colors[status] || '#9E9E9E';
  };

  const exportData = () => {
    // Implementation for exporting user statistics
    console.log('Exporting user statistics...');
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
          Statistiques des Utilisateurs
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Analyse complète des utilisateurs, activité et tendances d'inscription
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
            <InputLabel sx={{ color: 'white' }}>Type d'utilisateur</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="patients">Patients</MenuItem>
              <MenuItem value="medecins">Médecins</MenuItem>
              <MenuItem value="admins">Admins</MenuItem>
              <MenuItem value="institutions">Institutions</MenuItem>
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
                    {stats.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Utilisateurs
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {stats.activeUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Utilisateurs Actifs
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    +{stats.newUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Nouveaux Utilisateurs
                  </Typography>
                </Box>
                <PersonAddIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Taux de Vérification
                  </Typography>
                </Box>
                <VerifiedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* User Distribution by Role */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              Répartition par Rôle
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={stats.usersByRole}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {stats.usersByRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* User Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} />
              Statut des Utilisateurs
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={stats.usersByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {stats.usersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Registration Trends */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tendances d'Inscription (6 derniers mois)
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <ComposedChart data={stats.registrationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="patients" stackId="a" fill="#4CAF50" name="Patients" />
                <Bar dataKey="medecins" stackId="a" fill="#2196F3" name="Médecins" />
                <Bar dataKey="admins" stackId="a" fill="#FF9800" name="Admins" />
                <Bar dataKey="institutions" stackId="a" fill="#9C27B0" name="Institutions" />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Activity Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Métriques d'Activité
            </Typography>
            {stats.activityMetrics.map((metric, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{metric.metric}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {metric.value}{metric.metric.includes('Taux') ? '%' : ''}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={metric.metric.includes('Taux') ? metric.value : (metric.value / 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: metric.change > 0 ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }}
                >
                  {metric.change > 0 ? '+' : ''}{metric.change}% par rapport au mois dernier
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Top Institutions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Top Institutions
            </Typography>
            {stats.topInstitutions.map((institution, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {institution.name}
                  </Typography>
                  <Chip 
                    label={`+${institution.growth}%`}
                    color={institution.growth > 10 ? 'success' : 'primary'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {institution.users} utilisateurs
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Utilisateurs Récents
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Rôle</TableCell>
                    <TableCell>Institution</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date d'inscription</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          size="small"
                          color={user.role === 'Médecin' ? 'primary' : user.role === 'Admin' ? 'secondary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{user.institution}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status}
                          size="small"
                          sx={{ bgcolor: getStatusColor(user.status), color: 'white' }}
                        />
                      </TableCell>
                      <TableCell>{new Date(user.date).toLocaleDateString('fr-FR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
              {stats.geographicDistribution.map((region, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {region.region}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>
                      {region.users.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {region.percentage}% du total
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={region.percentage}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
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
              Insights et Recommandations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Croissance positive:</strong> +12.5% d'utilisateurs actifs ce mois
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Attention:</strong> 170 utilisateurs en attente de vérification
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Opportunité:</strong> Potentiel d'expansion en région Marrakech-Safi
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

export default StatsUsers; 