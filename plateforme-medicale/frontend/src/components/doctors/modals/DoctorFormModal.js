import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  CircularProgress
} from '@mui/material';
import PersonalInfoForm from '../forms/PersonalInfoForm';
import ProfessionalInfoForm from '../forms/ProfessionalInfoForm';
import InstitutionForm from '../forms/InstitutionForm';

/**
 * Modal component for doctor form
 */
const DoctorFormModal = ({
  open,
  onClose,
  formData,
  handleFieldChange,
  isPrivateCabinet,
  togglePrivateCabinet,
  activeTab,
  handleTabChange,
  isEditMode,
  error,
  setError,
  specialties,
  institutions,
  isSubmitting,
  onSubmit
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          pb: 1,
          fontWeight: 'bold',
          color: '#2c3e50'
        }}
      >
        {isEditMode ? "Modifier un médecin" : "Ajouter un médecin"}
      </DialogTitle>
      <Divider />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => handleTabChange(newValue)} 
          variant="fullWidth"
          aria-label="Tabs de formulaire médecin"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'medium',
              color: '#4ca1af',
            },
            '& .Mui-selected': {
              color: '#2c3e50 !important',
              fontWeight: 'bold',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4ca1af',
              height: 3,
            }
          }}
        >
          <Tab label="Informations personnelles" />
          <Tab label="Informations professionnelles" />
          <Tab label="Institution et localisation" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 2,
              p: 1.5,
              bgcolor: 'rgba(244, 67, 54, 0.08)',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          >
            {error}
          </Typography>
        )}
        
        {activeTab === 0 && (
          <PersonalInfoForm 
            formData={formData}
            handleFieldChange={handleFieldChange}
            specialties={specialties}
            isEditMode={isEditMode}
            error={error}
            setError={setError}
          />
        )}
        
        {activeTab === 1 && (
          <ProfessionalInfoForm 
            formData={formData}
            handleFieldChange={handleFieldChange}
          />
        )}
        
        {activeTab === 2 && (
          <InstitutionForm 
            formData={formData}
            handleFieldChange={handleFieldChange}
            isPrivateCabinet={isPrivateCabinet}
            togglePrivateCabinet={togglePrivateCabinet}
            institutions={institutions}
          />
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2.5 }}>
        <Button 
          onClick={onClose}
          sx={{
            color: '#718096',
            '&:hover': {
              bgcolor: 'rgba(113, 128, 150, 0.08)'
            }
          }}
        >
          Annuler
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: '#4ca1af',
            color: 'white',
            '&:hover': {
              bgcolor: '#2c3e50',
            },
            boxShadow: '0 4px 8px rgba(76, 161, 175, 0.3)',
            borderRadius: '8px',
            px: 3
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
          ) : null}
          {isEditMode ? "Modifier" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorFormModal; 