import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DoctorSearchView from './DoctorSearch.view';
import moroccanCities from '../../utils/moroccanCities';

const DoctorSearchContainer = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    speciality: '',
    city: '',
    name: ''
  });
  // Correct Morocco coordinates: 28.96N, 9.13W
  const [mapCenter, setMapCenter] = useState({ lat: 28.96, lng: -9.13 }); 
  const [zoom, setZoom] = useState(5); // Default zoom for Morocco - less zoomed in
  const [mapEnabled, setMapEnabled] = useState(false); // Start with map disabled
  const [userLocation, setUserLocation] = useState(null);
  const [debug, setDebug] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false); // Track if search button was clicked
  const [doctorReviews, setDoctorReviews] = useState({}); // Store reviews for doctors

  // Request user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Only update map center if it's within Morocco's bounds
          if (latitude >= 27.6 && latitude <= 35.9 && longitude >= -13.2 && longitude <= -1.0) {
            setMapCenter({ lat: latitude, lng: longitude });
            setZoom(9);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Keep default Morocco center if geolocation fails
        }
      );
    }
  }, []);

  // Fetch reviews for doctors
  const fetchDoctorReviews = async (doctorIds) => {
    try {
      const reviewsResponse = await axios.get('http://localhost:5000/api/evaluations/medecins', {
        params: { ids: doctorIds.join(',') }
      });
      
      const reviewsData = {};
      
      reviewsResponse.data.forEach(doctorReview => {
        const { medecin_id, reviews, average_rating, count } = doctorReview;
        reviewsData[medecin_id] = {
          rating_average: average_rating || 0,
          rating_count: count || 0,
          recent_reviews: reviews || []
        };
      });
      
      return reviewsData;
    } catch (err) {
      console.error('Error fetching doctor reviews:', err);
      return {};
    }
  };

  // Reset search results
  const resetSearch = useCallback(() => {
    setSearchClicked(false);
    setMapEnabled(false);
    setError('');
    // Don't reset filters here - just reset search state
  }, []);

  // Fetch all required data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setDebug(null);
        
        let debugInfo = { steps: [] };
        
        try {
          debugInfo.steps.push('Fetching specialties');
          // Fetch specialties - no auth token needed for public data
          const specialtiesResponse = await axios.get('http://localhost:5000/api/specialites/public');
          setSpecialties(specialtiesResponse.data.specialites);
          debugInfo.specialtiesSuccess = true;
          
          debugInfo.steps.push('Fetching doctors');
          // Fetch all active doctors - no auth token needed for public data
          const doctorsResponse = await axios.get('http://localhost:5000/api/medecins/public');
          debugInfo.doctorsResponseStatus = doctorsResponse.status;
          
          const activeDoctors = doctorsResponse.data.medecins.filter(
            doctor => doctor.est_actif && doctor.accepte_nouveaux_patients
          );
          
          // Add a specialite_nom field to each doctor
          const doctorsWithSpecialtyNames = activeDoctors.map(doctor => {
            const specialty = specialtiesResponse.data.specialites.find(
              s => s.id === doctor.specialite_id
            );
            return {
              ...doctor,
              specialite_nom: specialty ? specialty.nom : 'Non spécifié'
            };
          });
          
          setDoctors(doctorsWithSpecialtyNames);
          debugInfo.doctorsSuccess = true;
          debugInfo.doctorCount = doctorsWithSpecialtyNames.length;

          // Fetch reviews for all doctors
          debugInfo.steps.push('Fetching reviews');
          const doctorIds = doctorsWithSpecialtyNames.map(doctor => doctor.id);
          const reviewsData = await fetchDoctorReviews(doctorIds);
          setDoctorReviews(reviewsData);
          debugInfo.reviewsSuccess = true;

        } catch (err) {
          console.error('Error fetching data:', err);
          debugInfo.error = {
            message: err.message,
            response: err.response ? {
              status: err.response.status,
              data: err.response.data
            } : null
          };
          setError('Erreur lors du chargement des données: ' + (err.response?.data?.message || err.message));
        } finally {
          setDebug(debugInfo);
          setLoading(false);
        }
      } catch (outerErr) {
        console.error('Outer error:', outerErr);
        setError('Erreur critique: ' + outerErr.message);
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Calculate the map center based on doctor coordinates
  const updateMapCenter = useCallback((doctorsList) => {
    const doctorsWithCoords = doctorsList.filter(
      doctor => doctor.latitude && doctor.longitude && 
      !isNaN(parseFloat(doctor.latitude)) && !isNaN(parseFloat(doctor.longitude))
    );
    
    if (doctorsWithCoords.length === 0) {
      // Default to Morocco center 
      setMapCenter({ lat: 28.96, lng: -9.13 });
      setZoom(5);
      return;
    }
    
    // Calculate bounds to ensure all doctors are visible
    let minLat = 35.9, maxLat = 27.6, minLng = -1.0, maxLng = -13.2;
    
    doctorsWithCoords.forEach(doctor => {
      const lat = parseFloat(doctor.latitude);
      const lng = parseFloat(doctor.longitude);
      
      // Only consider coordinates within Morocco
      if (lat >= 27.6 && lat <= 35.9 && lng >= -13.2 && lng <= -1.0) {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      }
    });
    
    // Center point
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    setMapCenter({ lat: centerLat, lng: centerLng });
    
    // Adjust zoom based on number of doctors and area size
    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;
    
    if (doctorsWithCoords.length === 1) {
      setZoom(10); // Zoom in less for a single doctor
    } else if (latSpan < 0.5 && lngSpan < 0.5) {
      setZoom(9);
    } else if (latSpan < 1 && lngSpan < 1) {
      setZoom(8);
    } else if (latSpan < 2 && lngSpan < 2) {
      setZoom(7);
    } else {
      setZoom(5);
    }
  }, []);

  // Filter doctors based on current filters with AND logic (stricter filtering)
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = !filters.speciality || 
      doctor.specialite_id === parseInt(filters.speciality);
      
    // Improved city matching logic
    const cityFilter = filters.city ? filters.city.trim().toLowerCase() : '';
    const doctorCity = doctor.ville ? doctor.ville.trim().toLowerCase() : '';
    
    // Match if either the filter is empty OR if doctor city matches the filter
    // For exact match (like "Oujda"), we do exact comparison 
    // For partial matches, we use includes in both directions
    const matchesCity = !cityFilter || 
      doctorCity === cityFilter || 
      doctorCity.includes(cityFilter) || 
      cityFilter.includes(doctorCity);
      
    const matchesName = !filters.name || 
      (doctor.nom + ' ' + doctor.prenom).toLowerCase().includes(filters.name.toLowerCase()) ||
      (doctor.prenom + ' ' + doctor.nom).toLowerCase().includes(filters.name.toLowerCase());
    
    // Use AND logic for accurate filtering - must match all provided criteria
    return matchesSpecialty && matchesCity && matchesName;
  }).map(doctor => {
    // Add review data to each doctor
    const reviewData = doctorReviews[doctor.id] || {
      rating_average: 0,
      rating_count: 0,
      recent_reviews: []
    };
    
    return {
      ...doctor,
      ...reviewData
    };
  });

  // Handle search button click
  const handleSearch = () => {
    // Completely reset search state before starting new search
    resetSearch();
    
    // Set timeout to ensure state update has processed
    setTimeout(() => {
      setSearchClicked(true);
      setMapEnabled(true);
      
      try {
        updateMapCenter(filteredDoctors);
      } catch (err) {
        console.error('Error updating map center on search:', err);
        setMapEnabled(false);
      }
    }, 50); // Small timeout to ensure state updates properly
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => {
      // Make sure we handle empty and null values consistently
      const sanitizedValue = value === null || value === undefined ? '' : value;
      
      return {
        ...prev,
        [name]: sanitizedValue
      };
    });
  };

  return (
    <DoctorSearchView 
      loading={loading}
      doctors={filteredDoctors}
      specialties={specialties}
      cities={moroccanCities}
      error={error}
      filters={filters}
      handleFilterChange={handleFilterChange}
      handleSearch={handleSearch}
      mapCenter={mapCenter}
      zoom={zoom}
      mapEnabled={mapEnabled && searchClicked}
      userLocation={userLocation}
      searchClicked={searchClicked}
      debug={debug}
      resetSearch={resetSearch}
    />
  );
};

export default DoctorSearchContainer; 