import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Security,
  Visibility,
  Download,
  FilterList,
  Warning,
  CheckCircle,
  Error,
  Info,
  Timeline,
  VerifiedUser,
  Shield,
  History,
  AccountTree,
  Assessment
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`audit-tabpanel-${index}`}
      aria-labelledby={`audit-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StatsAudit = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedAuditEntry, setSelectedAuditEntry] = useState(null);

  // Mock data for audit statistics
  const [auditMetrics] = useState({
    totalLogs: 156789,
    securityEvents: 342,
    accessViolations: 23,
    dataChanges: 5432,
    complianceScore: 94.5,
    criticalAlerts: 8
  });

  const [securityEvents] = useState([
    { month: 'Jan', incidents: 45, resolved: 42, pending: 3 },
    { month: 'Fév', incidents: 38, resolved: 36, pending: 2 },
    { month: 'Mar', incidents: 52, resolved: 48, pending: 4 },
    { month: 'Avr', incidents: 41, resolved: 39, pending: 2 },
    { month: 'Mai', incidents: 47, resolved: 44, pending: 3 },
    { month: 'Juin', incidents: 39, resolved: 37, pending: 2 }
  ]);

  const [accessLogs] = useState([
    { time: '09:15', user: 'Dr. Martin', action: 'Consultation accès', resource: 'Dossier Patient #1234', status: 'Autorisé', ip: '192.168.1.45' },
    { time: '09:12', user: 'Admin Sophie', action: 'Modification utilisateur', resource: 'Compte Dr. Dubois', status: 'Autorisé', ip: '192.168.1.22' },
    { time: '09:08', user: 'Inconnu', action: 'Tentative connexion', resource: 'Interface Admin', status: 'Bloqué', ip: '203.45.67.89' },
    { time: '09:05', user: 'Dr. Lefort', action: 'Téléchargement rapport', resource: 'Rapport mensuel', status: 'Autorisé', ip: '192.168.1.67' },
    { time: '09:02', user: 'Secrétaire Marie', action: 'Ajout RDV', resource: 'Planning Dr. Martin', status: 'Autorisé', ip: '192.168.1.33' }
  ]);

  const [complianceData] = useState([
    { category: 'RGPD', score: 96, issues: 2, status: 'Conforme' },
    { category: 'ISO 27001', score: 93, issues: 5, status: 'Conforme' },
    { category: 'HDS', score: 98, issues: 1, status: 'Conforme' },
    { category: 'Sécurité Données', score: 91, issues: 7, status: 'Attention' },
    { category: 'Traçabilité', score: 97, issues: 2, status: 'Conforme' }
  ]);

  const [auditTrail] = useState([
    { id: 1, timestamp: '2024-01-15 14:30:22', user: 'Dr. Martin', action: 'Consultation dossier', details: 'Patient ID: 1234', severity: 'Info' },
    { id: 2, timestamp: '2024-01-15 14:28:15', user: 'Admin Sophie', action: 'Modification paramètres', details: 'Système de notification', severity: 'Warning' },
    { id: 3, timestamp: '2024-01-15 14:25:08', user: 'Dr. Dubois', action: 'Prescription médicament', details: 'Patient ID: 5678', severity: 'Info' },
    { id: 4, timestamp: '2024-01-15 14:22:45', user: 'Système', action: 'Sauvegarde automatique', details: 'Base de données principale', severity: 'Info' },
    { id: 5, timestamp: '2024-01-15 14:20:33', user: 'Inconnu', action: 'Tentative accès non autorisé', details: 'IP: 203.45.67.89', severity: 'Critical' }
  ]);

  const [systemMetrics] = useState([
    { metric: 'Temps de réponse moyen', value: '1.2s', trend: '+5%', status: 'good' },
    { metric: 'Taux de disponibilité', value: '99.8%', trend: '-0.1%', status: 'good' },
    { metric: 'Connexions simultanées', value: '847', trend: '+12%', status: 'warning' },
    { metric: 'Espace disque utilisé', value: '67%', trend: '+8%', status: 'warning' },
    { metric: 'Erreurs système', value: '23', trend: '-15%', status: 'good' },
    { metric: 'Violations sécurité', value: '2', trend: '-50%', status: 'good' }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (entry) => {
    setSelectedAuditEntry(entry);
    setDetailsDialog(true);
  };

  const handleExportAuditLog = () => {
    setLoading(true);
    // Simuler l'export
    setTimeout(() => {
      setLoading(false);
      // Ici, vous implémenteriez la logique d'export réelle
      console.log('Export du journal d\'audit...');
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'autorisé': return 'success';
      case 'bloqué': return 'error';
      case 'en attente': return 'warning';
      default: return 'default';
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Security color="primary" />
        Audit et Sécurité
      </Typography>

      {/* Métriques principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Logs
              </Typography>
              <Typography variant="h4">
                {auditMetrics.totalLogs.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="primary">
                +12% ce mois
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Événements Sécurité
              </Typography>
              <Typography variant="h4" color="warning.main">
                {auditMetrics.securityEvents}
              </Typography>
              <Typography variant="body2" color="success.main">
                -8% ce mois
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Violations d'Accès
              </Typography>
              <Typography variant="h4" color="error.main">
                {auditMetrics.accessViolations}
              </Typography>
              <Typography variant="body2" color="success.main">
                -15% ce mois
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Modifications Données
              </Typography>
              <Typography variant="h4">
                {auditMetrics.dataChanges}
              </Typography>
              <Typography variant="body2" color="primary">
                +5% ce mois
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Score Conformité
              </Typography>
              <Typography variant="h4" color="success.main">
                {auditMetrics.complianceScore}%
              </Typography>
              <Typography variant="body2" color="success.main">
                +2% ce mois
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Alertes Critiques
              </Typography>
              <Typography variant="h4" color="error.main">
                {auditMetrics.criticalAlerts}
              </Typography>
              <Typography variant="body2" color="warning.main">
                Attention requise
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<Timeline />} label="Événements Sécurité" />
            <Tab icon={<History />} label="Journal d'Audit" />
            <Tab icon={<Shield />} label="Conformité" />
            <Tab icon={<Assessment />} label="Métriques Système" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Évolution des Incidents de Sécurité
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={securityEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="incidents" stackId="1" stroke="#ff7300" fill="#ff7300" name="Incidents" />
                    <Area type="monotone" dataKey="resolved" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Résolus" />
                    <Area type="monotone" dataKey="pending" stackId="3" stroke="#ffc658" fill="#ffc658" name="En attente" />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Derniers Accès
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {accessLogs.map((log, index) => (
                    <Box key={index} sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2">{log.time} - {log.user}</Typography>
                      <Typography variant="body2" color="textSecondary">{log.action}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="caption">{log.ip}</Typography>
                        <Chip 
                          label={log.status} 
                          size="small" 
                          color={getStatusColor(log.status)}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDialog(true)}
            >
              Filtres
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExportAuditLog}
              disabled={loading}
            >
              Exporter Journal
            </Button>
            {loading && <LinearProgress sx={{ width: 200 }} />}
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Horodatage</TableCell>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Détails</TableCell>
                  <TableCell>Sévérité</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditTrail.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.timestamp}</TableCell>
                    <TableCell>{entry.user}</TableCell>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell>{entry.details}</TableCell>
                    <TableCell>
                      <Chip 
                        label={entry.severity} 
                        size="small" 
                        color={getSeverityColor(entry.severity)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewDetails(entry)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  État de Conformité par Catégorie
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {complianceData.map((item, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">{item.category}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">{item.score}%</Typography>
                          <Chip 
                            label={item.status} 
                            size="small" 
                            color={item.status === 'Conforme' ? 'success' : 'warning'}
                          />
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.score} 
                        sx={{ height: 8, borderRadius: 4 }}
                        color={item.status === 'Conforme' ? 'success' : 'warning'}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {item.issues} problème(s) identifié(s)
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Score Global de Conformité
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, score }) => `${name}: ${score}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="score"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Recommandations de Conformité</Typography>
            <Typography variant="body2">
              • Renforcer la sécurité des données médicales selon HDS
              • Mettre à jour les politiques de confidentialité RGPD
              • Améliorer la traçabilité des accès administrateurs
            </Typography>
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            {systemMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {metric.metric}
                    </Typography>
                    <Typography variant="h5">
                      {metric.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Typography 
                        variant="body2" 
                        color={metric.status === 'good' ? 'success.main' : 'warning.main'}
                      >
                        {metric.trend}
                      </Typography>
                      {metric.status === 'good' ? 
                        <CheckCircle color="success" fontSize="small" /> : 
                        <Warning color="warning" fontSize="small" />
                      }
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Surveillance en Temps Réel
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Charge CPU Serveur</Typography>
                  <LinearProgress variant="determinate" value={45} sx={{ mt: 1 }} />
                  <Typography variant="body2" color="textSecondary">45% - Normal</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Utilisation Mémoire</Typography>
                  <LinearProgress variant="determinate" value={67} color="warning" sx={{ mt: 1 }} />
                  <Typography variant="body2" color="warning.main">67% - Attention</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Bande Passante</Typography>
                  <LinearProgress variant="determinate" value={23} sx={{ mt: 1 }} />
                  <Typography variant="body2" color="textSecondary">23% - Bon</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Connexions Actives</Typography>
                  <Typography variant="h4" color="primary">847</Typography>
                  <Typography variant="body2" color="textSecondary">+12% depuis hier</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Erreurs/Minute</Typography>
                  <Typography variant="h4" color="success.main">0.3</Typography>
                  <Typography variant="body2" color="success.main">Très faible</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>
      </Paper>

      {/* Dialog pour les détails d'audit */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Détails de l'Événement d'Audit</DialogTitle>
        <DialogContent>
          {selectedAuditEntry && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedAuditEntry.action}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Utilisateur:</Typography>
                  <Typography>{selectedAuditEntry.user}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Horodatage:</Typography>
                  <Typography>{selectedAuditEntry.timestamp}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Sévérité:</Typography>
                  <Chip 
                    label={selectedAuditEntry.severity} 
                    color={getSeverityColor(selectedAuditEntry.severity)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Détails:</Typography>
                  <Typography>{selectedAuditEntry.details}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour les filtres */}
      <Dialog 
        open={filterDialog} 
        onClose={() => setFilterDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtres du Journal d'Audit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Utilisateur"
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Sévérité</InputLabel>
              <Select defaultValue="">
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date de début"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Date de fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => setFilterDialog(false)}>
            Appliquer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StatsAudit; 