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
      uptime: 99.8,
      totalIncidents: 12,
      criticalIncidents: 2,
      averageResponseTime: 245,
      systemLoad: 78.5,
      diskUsage: 65.2,
      memoryUsage: 82.3,
      apiHealth: 96.7
    },
    securityMetrics: {
      totalEvents: 1247,
      suspiciousActivities: 28,
      blockedAttempts: 156,
      failedLogins: 89,
      successfulLogins: 12458,
      passwordResets: 45,
      accountLockouts: 12,
      privilegeEscalations: 3
    },
    apiPerformance: {
      totalRequests: 156789,
      averageResponseTime: 245,
      errorRate: 0.8,
      slowQueries: 23,
      timeoutRequests: 5,
      peakLoad: 1250,
      cacheHitRate: 89.5,
      throughput: 125.6
    },
    complianceMetrics: {
      gdprScore: 94.5,
      dataProcessingEvents: 2456,
      consentManagement: 98.2,
      dataRetentionCompliance: 96.8,
      accessRequests: 45,
      deletionRequests: 12,
      portabilityRequests: 8,
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
        // Try to fetch from API first
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
        // Use mock data as fallback
        const mockStats = {
          systemHealth: {
            uptime: 99.8,
            totalIncidents: 12,
            criticalIncidents: 2,
            averageResponseTime: 245,
            systemLoad: 78.5,
            diskUsage: 65.2,
            memoryUsage: 82.3,
            apiHealth: 96.7
          },
          securityMetrics: {
            totalEvents: 1247,
            suspiciousActivities: 28,
            blockedAttempts: 156,
            failedLogins: 89,
            successfulLogins: 12458,
            passwordResets: 45,
            accountLockouts: 12,
            privilegeEscalations: 3
          },
          apiPerformance: {
            totalRequests: 156789,
            averageResponseTime: 245,
            errorRate: 0.8,
            slowQueries: 23,
            timeoutRequests: 5,
            peakLoad: 1250,
            cacheHitRate: 89.5,
            throughput: 125.6
          },
          complianceMetrics: {
            gdprScore: 94.5,
            dataProcessingEvents: 2456,
            consentManagement: 98.2,
            dataRetentionCompliance: 96.8,
            accessRequests: 45,
            deletionRequests: 12,
            portabilityRequests: 8,
            breachIncidents: 0
          },
          auditTrail: [
            { id: 1, timestamp: '2024-01-15 14:30:25', user: 'admin@system.com', action: 'User Login', ip: '192.168.1.100', status: 'success', severity: 'info' },
            { id: 2, timestamp: '2024-01-15 14:28:12', user: 'superadmin@system.com', action: 'Database Access', ip: '192.168.1.101', status: 'success', severity: 'medium' },
            { id: 3, timestamp: '2024-01-15 14:25:08', user: 'unknown', action: 'Failed Login Attempt', ip: '203.45.67.89', status: 'blocked', severity: 'high' },
            { id: 4, timestamp: '2024-01-15 14:20:45', user: 'doctor@hospital.com', action: 'Patient Data Access', ip: '192.168.1.102', status: 'success', severity: 'medium' },
            { id: 5, timestamp: '2024-01-15 14:18:30', user: 'system', action: 'Automated Backup', ip: 'localhost', status: 'success', severity: 'low' }
          ],
          incidentHistory: [
            { month: 'Jan', critical: 2, high: 8, medium: 15, low: 25, resolved: 48, pending: 2 },
            { month: 'Fév', critical: 1, high: 6, medium: 12, low: 28, resolved: 45, pending: 2 },
            { month: 'Mar', critical: 3, high: 10, medium: 18, low: 22, resolved: 50, pending: 3 },
            { month: 'Avr', critical: 0, high: 4, medium: 14, low: 30, resolved: 46, pending: 2 },
            { month: 'Mai', critical: 2, high: 7, medium: 16, low: 26, resolved: 49, pending: 2 },
            { month: 'Jun', critical: 1, high: 5, medium: 13, low: 24, resolved: 41, pending: 2 }
          ],
          complianceChecks: [
            { category: 'RGPD/GDPR', score: 94.5, status: 'Conforme', lastCheck: '2024-01-15', issues: 2 },
            { category: 'ISO 27001', score: 92.8, status: 'Conforme', lastCheck: '2024-01-14', issues: 3 },
            { category: 'HDS (Hébergement Données Santé)', score: 96.2, status: 'Conforme', lastCheck: '2024-01-13', issues: 1 },
            { category: 'Sécurité des Données', score: 89.5, status: 'Attention', lastCheck: '2024-01-15', issues: 5 },
            { category: 'Traçabilité', score: 97.1, status: 'Conforme', lastCheck: '2024-01-15', issues: 1 },
            { category: 'Contrôle d\'Accès', score: 91.3, status: 'Conforme', lastCheck: '2024-01-14', issues: 4 }
          ],
          systemMetrics: [
            { time: '00:00', cpu: 45, memory: 68, disk: 65, network: 234 },
            { time: '04:00', cpu: 32, memory: 62, disk: 65, network: 189 },
            { time: '08:00', cpu: 78, memory: 82, disk: 66, network: 567 },
            { time: '12:00', cpu: 85, memory: 89, disk: 67, network: 789 },
            { time: '16:00', cpu: 92, memory: 91, disk: 68, network: 892 },
            { time: '20:00', cpu: 76, memory: 78, disk: 68, network: 654 }
          ],
          securityEvents: [
            { type: 'Tentatives de connexion échouées', count: 89, trend: 'stable', severity: 'medium' },
            { type: 'Accès non autorisés', count: 12, trend: 'decreasing', severity: 'high' },
            { type: 'Modifications de privilèges', count: 3, trend: 'stable', severity: 'high' },
            { type: 'Accès aux données sensibles', count: 456, trend: 'increasing', severity: 'medium' },
            { type: 'Tentatives d\'injection SQL', count: 8, trend: 'decreasing', severity: 'critical' },
            { type: 'Scan de ports suspects', count: 23, trend: 'stable', severity: 'medium' }
          ],
          performanceMetrics: [
            { endpoint: '/api/patients', avgResponse: 125, requests: 12450, errorRate: 0.2 },
            { endpoint: '/api/appointments', avgResponse: 89, requests: 8760, errorRate: 0.5 },
            { endpoint: '/api/doctors', avgResponse: 156, requests: 6890, errorRate: 0.3 },
            { endpoint: '/api/institutions', avgResponse: 203, requests: 3450, errorRate: 0.8 },
            { endpoint: '/api/auth', avgResponse: 345, requests: 15670, errorRate: 2.1 },
            { endpoint: '/api/admin', avgResponse: 278, requests: 2340, errorRate: 0.1 }
          ]
        };
        setStats(mockStats);
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