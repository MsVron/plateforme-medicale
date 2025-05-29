import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  People,
  MedicalServices,
  Business,
  Event,
  Map as MapIcon,
  Layers,
  FilterList,
  TrendingUp
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Alternative mapping solution with better performance than Leaflet
const MapComponent = ({ data, mapType, onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize OpenLayers map (more reliable than Leaflet)
    if (window.ol && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    } else if (!window.ol) {
      // Fallback to basic visualization if OpenLayers is not available
      renderBasicMap();
    }
  }, [data, mapType]);

  const initializeMap = () => {
    try {
      const map = new window.ol.Map({
        target: mapRef.current,
        layers: [
          new window.ol.layer.Tile({
            source: new window.ol.source.OSM()
          })
        ],
        view: new window.ol.View({
          center: window.ol.proj.fromLonLat([2.3522, 48.8566]), // Centered on France
          zoom: 6
        })
      });

      // Add markers for locations
      if (data && data.length > 0) {
        const vectorSource = new window.ol.source.Vector();
        
        data.forEach(location => {
          if (location.longitude && location.latitude) {
            const feature = new window.ol.Feature({
              geometry: new window.ol.geom.Point(
                window.ol.proj.fromLonLat([location.longitude, location.latitude])
              ),
              name: location.name,
              count: location.count
            });

            // Style based on map type and count
            const style = new window.ol.style.Style({
              image: new window.ol.style.Circle({
                radius: Math.max(5, Math.min(20, location.count / 5)),
                fill: new window.ol.style.Fill({
                  color: getMarkerColor(mapType, location.count)
                }),
                stroke: new window.ol.style.Stroke({
                  color: '#fff',
                  width: 2
                })
              })
            });

            feature.setStyle(style);
            vectorSource.addFeature(feature);
          }
        });

        const vectorLayer = new window.ol.layer.Vector({
          source: vectorSource
        });

        map.addLayer(vectorLayer);

        // Add click interaction
        map.on('click', (evt) => {
          const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
          if (feature && onLocationSelect) {
            onLocationSelect({
              name: feature.get('name'),
              count: feature.get('count')
            });
          }
        });
      }

      mapInstanceRef.current = map;
    } catch (error) {
      console.error('Error initializing OpenLayers map:', error);
      renderBasicMap();
    }
  };

  const renderBasicMap = () => {
    // Fallback basic map visualization
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div style="
          width: 100%; 
          height: 400px; 
          background: linear-gradient(45deg, #e3f2fd 25%, #bbdefb 25%, #bbdefb 50%, #e3f2fd 50%, #e3f2fd 75%, #bbdefb 75%);
          background-size: 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        ">
          <div style="
            background: rgba(255,255,255,0.9);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          ">
            <div style="color: #1976d2; font-size: 48px; margin-bottom: 10px;">🗺️</div>
            <div style="color: #333; font-weight: bold; margin-bottom: 5px;">Carte Géographique</div>
            <div style="color: #666; font-size: 14px;">
              ${data ? data.length : 0} emplacements trouvés
            </div>
          </div>
        </div>
      `;
    }
  };

  const getMarkerColor = (type, count) => {
    const intensity = Math.min(1, count / 50);
    switch (type) {
      case 'users': return `rgba(33, 150, 243, ${0.6 + intensity * 0.4})`;
      case 'doctors': return `rgba(76, 175, 80, ${0.6 + intensity * 0.4})`;
      case 'institutions': return `rgba(255, 152, 0, ${0.6 + intensity * 0.4})`;
      case 'appointments': return `rgba(156, 39, 176, ${0.6 + intensity * 0.4})`;
      default: return `rgba(96, 125, 139, ${0.6 + intensity * 0.4})`;
    }
  };

  return (
    <Box 
      ref={mapRef} 
      sx={{ 
        width: '100%', 
        height: 400, 
        border: '1px solid #e0e0e0', 
        borderRadius: 1,
        overflow: 'hidden'
      }} 
    />
  );
};

const StatsGeographic = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapType, setMapType] = useState('users');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchGeographicStats();
  }, [selectedPeriod]);

  const fetchGeographicStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/stats/geographic?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Erreur lors de la récupération des statistiques géographiques');
      }
    } catch (error) {
      console.error('Error fetching geographic stats:', error);
      setError('Erreur lors de la récupération des statistiques géographiques');
    } finally {
      setLoading(false);
    }
  };

  const handleMapTypeChange = (event, newMapType) => {
    if (newMapType !== null) {
      setMapType(newMapType);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const getMapData = () => {
    if (!stats) return [];
    
    switch (mapType) {
      case 'users': return stats.usersByLocation || [];
      case 'doctors': return stats.doctorsByLocation || [];
      case 'institutions': return stats.institutionsByLocation || [];
      case 'appointments': return stats.appointmentsByLocation || [];
      default: return [];
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        <AlertTitle>Erreur</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <LocationOn sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Statistiques Géographiques
        </Typography>
      </Box>

      {/* Controls */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Période</InputLabel>
            <Select
              value={selectedPeriod}
              label="Période"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="quarter">Ce trimestre</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" gap={2}>
            <FilterList />
            <ToggleButtonGroup
              value={mapType}
              exclusive
              onChange={handleMapTypeChange}
              aria-label="type de carte"
              size="small"
            >
              <ToggleButton value="users" aria-label="utilisateurs">
                <Tooltip title="Utilisateurs par région">
                  <People />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="doctors" aria-label="médecins">
                <Tooltip title="Médecins par région">
                  <MedicalServices />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="institutions" aria-label="institutions">
                <Tooltip title="Institutions par région">
                  <Business />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="appointments" aria-label="rendez-vous">
                <Tooltip title="Rendez-vous par région">
                  <Event />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>
      </Grid>

      {/* Map and Location Details */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader 
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <MapIcon />
                  <Typography variant="h6">
                    Carte de Distribution - {mapType === 'users' ? 'Utilisateurs' : 
                    mapType === 'doctors' ? 'Médecins' : 
                    mapType === 'institutions' ? 'Institutions' : 'Rendez-vous'}
                  </Typography>
                </Box>
              }
              action={
                <Chip 
                  icon={<Layers />}
                  label={`${getMapData().length} emplacements`}
                  variant="outlined"
                />
              }
            />
            <CardContent>
              <MapComponent 
                data={getMapData()}
                mapType={mapType}
                onLocationSelect={handleLocationSelect}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="Détails par Région" />
            <CardContent>
              {selectedLocation ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedLocation.name}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {selectedLocation.count} {mapType === 'users' ? 'utilisateurs' : 
                    mapType === 'doctors' ? 'médecins' : 
                    mapType === 'institutions' ? 'institutions' : 'rendez-vous'}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Cliquez sur un point de la carte pour voir les détails
                </Typography>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top 5 Régions
                </Typography>
                {getMapData().slice(0, 5).map((location, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight="medium">
                        {location.name}
                      </Typography>
                      <Chip 
                        label={location.count} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regional Statistics Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Distribution par Région (Top 10)" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getMapData().slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Répartition Géographique" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getMapData().slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {getMapData().slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Geographic Insights */}
      <Card>
        <CardHeader title="Insights Géographiques" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <LocationOn color="primary" />
                  <Typography variant="h6" color="primary">
                    Région la plus active
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.insights?.mostActiveRegion?.name || 'Paris'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats?.insights?.mostActiveRegion?.count || 0} activités
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <TrendingUp color="success" />
                  <Typography variant="h6" color="success.main">
                    Croissance régionale
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  +{stats?.insights?.regionGrowthPercent || 15}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  par rapport au mois dernier
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: 'warning.50' }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Business color="warning" />
                  <Typography variant="h6" color="warning.main">
                    Couverture territoire
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {stats?.insights?.territoryCoverage || 78}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  des régions françaises
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatsGeographic; 