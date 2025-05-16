import React, { useState, useEffect } from 'react';
// Import only the React components, not the actual Leaflet code yet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './DoctorSearch.css';

// Create a wrapper for Leaflet functionality
const LazyMap = ({ doctors, mapCenter, zoom, selectedDoctor, setSelectedDoctor }) => {
  const [leaflet, setLeaflet] = useState(null);
  const [customIcon, setCustomIcon] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Leaflet dynamically to avoid context issues
  useEffect(() => {
    // Dynamic import of Leaflet
    const initializeLeaflet = async () => {
      try {
        const L = await import('leaflet');
        setLeaflet(L.default);

        // Fix Leaflet marker icon issue
        if (L.default.Icon.Default.prototype._getIconUrl) {
          delete L.default.Icon.Default.prototype._getIconUrl;
          L.default.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
          });
        }

        // Create custom icon
        const icon = new L.default.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41]
        });
        
        setCustomIcon(icon);
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing Leaflet:', error);
      }
    };

    initializeLeaflet();

    return () => {
      // Cleanup when unmounting
      setIsReady(false);
      setLeaflet(null);
      setCustomIcon(null);
    };
  }, []);

  // Only render valid doctors with coordinates
  const validDoctors = doctors.filter(doctor => {
    if (!doctor.latitude || !doctor.longitude) return false;
    
    const lat = parseFloat(doctor.latitude);
    const lng = parseFloat(doctor.longitude);
    
    return !isNaN(lat) && !isNaN(lng);
  });

  // Don't render until Leaflet is fully initialized
  if (!isReady || !leaflet || !customIcon) {
    return null; // The wrapper will show loading state
  }

  return (
    <MapContainer 
      center={[mapCenter.lat, mapCenter.lng]} 
      zoom={zoom} 
      scrollWheelZoom={false}
      key={`map-${validDoctors.length}`} // Force remount on doctors change
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validDoctors.map(doctor => {
        const lat = parseFloat(doctor.latitude);
        const lng = parseFloat(doctor.longitude);
        
        return (
          <Marker 
            key={doctor.id} 
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                setSelectedDoctor(doctor);
              }
            }}
          >
            <Popup>
              <div>
                <h3 style={{ margin: '0 0 5px', color: '#4ca1af' }}>Dr. {doctor.prenom} {doctor.nom}</h3>
                <p style={{ margin: '0', color: '#2c3e50' }}>{doctor.specialite_nom}</p>
                {doctor.ville && <p style={{ margin: '5px 0 0' }}>{doctor.ville}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LazyMap; 