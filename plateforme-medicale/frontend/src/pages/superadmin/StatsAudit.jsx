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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Badge
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
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  MonitorHeart as SystemHealthIcon,
  Speed as PerformanceIcon,
  Shield as ShieldIcon,
  Gavel as ComplianceIcon,
  BugReport as BugIcon,
  Lock as LockIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  VpnKey as VpnKeyIcon,
  AdminPanelSettings as AdminIcon,
  DataObject as DataIcon
} from '@mui/icons-material';

const StatsAudit = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [auditType, setAuditType] = useState('all');
  const [stats, setStats] = useState({
    systemHealth: {
      uptime: 0,
      totalIncidents: 0,
      criticalIncidents: 0,
      averageResponseTime: 0,
      systemLoad: 0,
      diskUsage: 0,
      memoryUsage: 0,
      apiHealth: 0
    },
    securityMetrics: {
      totalEvents: 0,
      suspiciousActivities: 0,
      blockedAttempts: 0,
      failedLogins: 0,
      successfulLogins: 0,
      passwordResets: 0,
      accountLockouts: 0,
      privilegeEscalations: 0
    },
    apiPerformance: {
      totalRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
      slowQueries: 0,
      timeoutRequests: 0,
      peakLoad: 0,
      cacheHitRate: 0,
      throughput: 0
    },
    complianceMetrics: {
      gdprScore: 0,
      dataProcessingEvents: 0,
      consentManagement: 0,
      dataRetentionCompliance: 0,
      accessRequests: 0,
      deletionRequests: 0,
      portabilityRequests: 0,
      breachIncidents: 0
    },
    auditTrail: [],
    incidentHistory: [],
    complianceChecks: [],
    systemMetrics: [],
    securityEvents: [],
    performanceMetrics: []
  });

  useEffect(() => {
    const fetchAuditStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/superadmin/stats/audit?period=${period}&type=${auditType}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(prevStats => ({ ...prevStats, ...data }));
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        console.error('Error fetching audit statistics:', error);
        // Fallback to basic stats if API fails
        const fallbackStats = {
          systemHealth: {
            uptime: 0,
            totalIncidents: 0,
            criticalIncidents: 0,
            averageResponseTime: 0,
            systemLoad: 0,
            diskUsage: 0,
            memoryUsage: 0,
            apiHealth: 0
          },
          securityMetrics: {
            totalEvents: 0,
            suspiciousActivities: 0,
            blockedAttempts: 0,
            failedLogins: 0,
            successfulLogins: 0,
            passwordResets: 0,
            accountLockouts: 0,
            privilegeEscalations: 0
          },
          apiPerformance: {
            totalRequests: 0,
            averageResponseTime: 0,
            errorRate: 0,
            slowQueries: 0,
            timeoutRequests: 0,
            peakLoad: 0,
            cacheHitRate: 0,
            throughput: 0
          },
          complianceMetrics: {
            gdprScore: 0,
            dataProcessingEvents: 0,
            consentManagement: 0,
            dataRetentionCompliance: 0,
            accessRequests: 0,
            deletionRequests: 0,
            portabilityRequests: 0,
            breachIncidents: 0
          },
          auditTrail: [],
          incidentHistory: [],
          complianceChecks: [],
          systemMetrics: [],
          securityEvents: [],
          performanceMetrics: []
        };
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditStats();
  }, [period, auditType]);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#D32F2F',
      high: '#F57C00',
      medium: '#FBC02D',
      low: '#388E3C',
      info: '#1976D2'
    };
    return colors[severity] || '#9E9E9E';
  };

  const getComplianceColor = (score) => {
    if (score >= 95) return '#4CAF50';
    if (score >= 90) return '#8BC34A';
    if (score >= 85) return '#FFC107';
    if (score >= 80) return '#FF9800';
    return '#F44336';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Conforme': '#4CAF50',
      'Attention': '#FF9800',
      'Non-conforme': '#F44336',
      'En cours': '#2196F3'
    };
    return colors[status] || '#9E9E9E';
  };

  const exportAuditReport = () => {
    console.log('Exporting audit report...');
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
          Rapports d'Audit et Sécurité
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Surveillance complète du système, sécurité et conformité RGPD
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
              <MenuItem value="day">Aujourd'hui</MenuItem>
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="quarter">Ce trimestre</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Type d'audit</InputLabel>
            <Select
              value={auditType}
              onChange={(e) => setAuditType(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="security">Sécurité</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
              <MenuItem value="compliance">Conformité</MenuItem>
              <MenuItem value="system">Système</MenuItem>
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
            onClick={exportAuditReport}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Exporter Rapport
          </Button>
        </Box>
      </Box>

      {/* System Health Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.systemHealth.uptime}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Disponibilité Système
                  </Typography>
                </Box>
                <SystemHealthIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {stats.securityMetrics.suspiciousActivities}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Activités Suspectes
                  </Typography>
                </Box>
                <SecurityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {stats.apiPerformance.averageResponseTime}ms
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Temps de Réponse
                  </Typography>
                </Box>
                <PerformanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.complianceMetrics.gdprScore}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Score RGPD
                  </Typography>
                </Box>
                <ComplianceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Incident History Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ mr: 1 }} />
              Historique des Incidents
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <ComposedChart data={stats.incidentHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="critical" stackId="incidents" fill="#D32F2F" name="Critique" />
                <Bar yAxisId="left" dataKey="high" stackId="incidents" fill="#F57C00" name="Élevé" />
                <Bar yAxisId="left" dataKey="medium" stackId="incidents" fill="#FBC02D" name="Moyen" />
                <Bar yAxisId="left" dataKey="low" stackId="incidents" fill="#388E3C" name="Faible" />
                <Line yAxisId="right" type="monotone" dataKey="resolved" stroke="#4CAF50" strokeWidth={3} name="Résolus" />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Compliance Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ShieldIcon sx={{ mr: 1 }} />
              État de Conformité
            </Typography>
            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
              {stats.complianceChecks.map((check, index) => (
                <Box key={index} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: `2px solid ${getComplianceColor(check.score)}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {check.category}
                    </Typography>
                    <Chip 
                      label={check.status}
                      size="small"
                      sx={{ bgcolor: getStatusColor(check.status), color: 'white' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: getComplianceColor(check.score), mr: 2 }}>
                      {check.score}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={check.score}
                      sx={{ 
                        flexGrow: 1,
                        height: 8, 
                        borderRadius: 5,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getComplianceColor(check.score)
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Dernière vérification: {check.lastCheck} • {check.issues} problème(s)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* System Performance Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Métriques de Performance Système
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={stats.systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#FF6B6B" fill="#FF6B6B" name="CPU %" />
                <Area type="monotone" dataKey="memory" stackId="2" stroke="#4ECDC4" fill="#4ECDC4" name="Mémoire %" />
                <Area type="monotone" dataKey="disk" stackId="3" stroke="#45B7D1" fill="#45B7D1" name="Disque %" />
                <Area type="monotone" dataKey="network" stackId="4" stroke="#96CEB4" fill="#96CEB4" name="Réseau (MB/s)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Security Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              Événements de Sécurité
            </Typography>
            <List>
              {stats.securityEvents.map((event, index) => (
                <ListItem key={index} sx={{ mb: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <ListItemIcon>
                    <Badge badgeContent={event.count} color="error" max={999}>
                      <WarningIcon sx={{ color: getSeverityColor(event.severity) }} />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText 
                    primary={event.type}
                    secondary={`${event.count} événements • Tendance: ${event.trend}`}
                  />
                  <Chip 
                    label={event.severity}
                    size="small"
                    sx={{ bgcolor: getSeverityColor(event.severity), color: 'white' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* API Performance Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <DataIcon sx={{ mr: 1 }} />
              Performance des API
            </Typography>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Endpoint</TableCell>
                    <TableCell align="center">Réponse Moy.</TableCell>
                    <TableCell align="center">Requêtes</TableCell>
                    <TableCell align="center">Taux d'Erreur</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.performanceMetrics.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell>{metric.endpoint}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${metric.avgResponse}ms`}
                          size="small"
                          color={metric.avgResponse < 200 ? 'success' : metric.avgResponse < 500 ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="center">{metric.requests.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${metric.errorRate}%`}
                          size="small"
                          color={metric.errorRate < 1 ? 'success' : metric.errorRate < 5 ? 'warning' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Audit Trail */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <AdminIcon sx={{ mr: 1 }} />
              Piste d'Audit Récente
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Horodatage</TableCell>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Adresse IP</TableCell>
                    <TableCell align="center">Statut</TableCell>
                    <TableCell align="center">Sévérité</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.auditTrail.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {log.user.charAt(0).toUpperCase()}
                          </Avatar>
                          {log.user}
                        </Box>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={log.status}
                          size="small"
                          color={log.status === 'success' ? 'success' : log.status === 'blocked' ? 'error' : 'warning'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={log.severity}
                          size="small"
                          sx={{ bgcolor: getSeverityColor(log.severity), color: 'white' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Critical Alerts */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Alertes Critiques
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Critique:</strong> {stats.systemHealth.criticalIncidents} incidents critiques détectés
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Attention:</strong> Charge système élevée ({stats.systemHealth.systemLoad}%)
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Info:</strong> Score de conformité RGPD excellent ({stats.complianceMetrics.gdprScore}%)
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

export default StatsAudit; 