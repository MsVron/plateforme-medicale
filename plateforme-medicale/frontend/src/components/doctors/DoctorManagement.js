import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Container,
  Paper,
  Tooltip,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

import DoctorList from './DoctorList';
import DoctorFormModal from './modals/DoctorFormModal';
import useDoctorForm from '../../hooks/useDoctorForm';
import { validateDoctorForm } from '../../utils/doctorValidation';
import doctorService from '../../services/doctorService';

/**
 * Main component for managing doctors
 */
const DoctorManagement = () => {
  // State
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const {
    formData,
    setFormData,
    isPrivateCabinet,
    activeTab,
    error,
    setError,
    handleFieldChange,
    handleTabChange,
    togglePrivateCabinet,
    resetForm,
    prepareDataForSubmission
  } = useDoctorForm();
  
  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Fetch all necessary data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [doctorsData, specialtiesData, institutionsData] = await Promise.all([
        doctorService.getAllDoctors(),
        doctorService.getSpecialties(),
        doctorService.getInstitutions()
      ]);
      
      setDoctors(doctorsData);
      setSpecialties(specialtiesData);
      setInstitutions(institutionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Erreur lors du chargement des données', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle opening modal for creating a new doctor
  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  
  // Handle opening modal for editing a doctor
  const handleOpenEditModal = (doctor) => {
    setFormData({
      // Account information
      id: doctor.id,
      nom_utilisateur: doctor.nom_utilisateur || "",
      mot_de_passe: "",
      email: doctor.email || "",
      
      // Personal information
      prenom: doctor.prenom || "",
      nom: doctor.nom || "",
      specialite_id: doctor.specialite_id || "",
      numero_ordre: doctor.numero_ordre || "",
      telephone: doctor.telephone || "",
      
      // Professional information
      photo_url: doctor.photo_url || "",
      biographie: doctor.biographie || "",
      tarif_consultation: doctor.tarif_consultation || "",
      temps_consultation_moyen: doctor.temps_consultation_moyen || 30,
      accepte_nouveaux_patients: doctor.accepte_nouveaux_patients !== false,
      langues_parlees: doctor.langues_parlees || "",
      
      // Institution information
      institution_id: doctor.institution_type === "cabinet privé" ? "" : doctor.institution_id || "",
      institution_nom: doctor.institution_type === "cabinet privé" ? doctor.institution_nom || "" : "",
      institution_type: doctor.institution_type === "cabinet privé" ? "cabinet privé" : "",
      institution_email: doctor.institution_type === "cabinet privé" ? doctor.institution_email || "" : "",
      institution_telephone: doctor.institution_type === "cabinet privé" ? doctor.institution_telephone || "" : "",
      
      // Location information
      adresse: doctor.adresse || "",
      ville: doctor.ville || "",
      code_postal: doctor.code_postal || "",
      pays: doctor.pays || "Maroc",
      latitude: doctor.latitude || "",
      longitude: doctor.longitude || "",
      
      // Status
      est_actif: doctor.est_actif !== false,
    });
    
    togglePrivateCabinet(doctor.institution_type === "cabinet privé");
    setIsModalOpen(true);
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError("");
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    const formError = validateDoctorForm(formData, isPrivateCabinet, !!formData.id);
    if (formError) {
      setError(formError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = prepareDataForSubmission();
      
      // Parse coordinates as numbers if they exist
      if (submitData.latitude) {
        submitData.latitude = parseFloat(submitData.latitude);
      }
      if (submitData.longitude) {
        submitData.longitude = parseFloat(submitData.longitude);
      }
      
      if (formData.id) {
        // Update existing doctor
        await doctorService.updateDoctor(formData.id, submitData);
        showNotification('Médecin modifié avec succès');
      } else {
        // Create new doctor
        await doctorService.createDoctor(submitData);
        showNotification('Médecin ajouté avec succès');
      }
      
      // Refresh data and close modal
      fetchAllData();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting doctor form:', error);
      setError(error.response?.data?.message || "Une erreur s'est produite lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle doctor deletion
  const handleDelete = async (doctorId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin?')) {
      try {
        await doctorService.deleteDoctor(doctorId);
        showNotification('Médecin supprimé avec succès');
        fetchAllData();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        showNotification('Erreur lors de la suppression du médecin', 'error');
      }
    }
  };
  
  // Show notification
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  // Handle closing notification
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="#2c3e50" fontWeight="bold">
            Gestion des médecins
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Actualiser les données">
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={fetchAllData}
                disabled={isLoading}
                sx={{
                  borderRadius: '8px',
                  borderColor: '#4ca1af',
                  color: '#4ca1af',
                  '&:hover': {
                    borderColor: '#2c3e50',
                    bgcolor: 'rgba(44, 62, 80, 0.04)',
                  }
                }}
              >
                Actualiser
              </Button>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateModal}
              sx={{
                bgcolor: '#4ca1af',
                color: 'white',
                '&:hover': {
                  bgcolor: '#2c3e50',
                },
                boxShadow: '0 4px 8px rgba(76, 161, 175, 0.3)',
                borderRadius: '8px'
              }}
            >
              Ajouter un médecin
            </Button>
          </Box>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#4ca1af' }} />
          </Box>
        ) : (
          <DoctorList 
            doctors={doctors}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </Box>
      
      {/* Doctor form modal */}
      <DoctorFormModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleFieldChange={handleFieldChange}
        isPrivateCabinet={isPrivateCabinet}
        togglePrivateCabinet={togglePrivateCabinet}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        isEditMode={!!formData.id}
        error={error}
        setError={setError}
        specialties={specialties}
        institutions={institutions}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorManagement; 