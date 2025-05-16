import { useState } from 'react';

/**
 * Custom hook for managing doctor form state
 * @param {Object} initialData - Initial form data
 * @returns {Object} - Form state and handlers
 */
export const useDoctorForm = (initialData = {}) => {
  // Default form data
  const defaultFormData = {
    // Account information
    nom_utilisateur: "",
    mot_de_passe: "",
    email: "",
    
    // Personal information
    prenom: "",
    nom: "",
    specialite_id: "",
    numero_ordre: "",
    telephone: "",
    
    // Professional information
    photo_url: "",
    biographie: "",
    tarif_consultation: "",
    temps_consultation_moyen: 30,
    accepte_nouveaux_patients: true,
    langues_parlees: "",
    
    // Institution information
    institution_id: "",
    institution_nom: "",
    institution_type: "",
    institution_email: "",
    institution_telephone: "",
    
    // Location information
    adresse: "",
    ville: "",
    code_postal: "",
    pays: "Maroc",
    latitude: "",
    longitude: "",
    
    // Status
    est_actif: true,
  };

  // Merge initial data with default form data
  const initialFormData = { ...defaultFormData, ...initialData };
  
  const [formData, setFormData] = useState(initialFormData);
  const [isPrivateCabinet, setIsPrivateCabinet] = useState(
    initialData?.institution_type === "cabinet privé"
  );
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  
  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData(defaultFormData);
    setIsPrivateCabinet(false);
    setActiveTab(0);
    setError("");
  };
  
  /**
   * Handle form field change
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  /**
   * Handle tab change
   * @param {number} newTab - New tab index
   */
  const handleTabChange = (newTab) => {
    if (newTab > 0 && (!formData.prenom || !formData.nom)) {
      setError("Veuillez d'abord remplir le prénom et le nom du médecin");
      return;
    }
    
    setActiveTab(newTab);
    setError("");
  };
  
  /**
   * Toggle private cabinet state
   * @param {boolean} value - New private cabinet state
   */
  const togglePrivateCabinet = (value) => {
    setIsPrivateCabinet(value);
    
    if (value) {
      // Clear institution_id when switching to private cabinet
      setFormData(prev => ({
        ...prev,
        institution_id: "",
        institution_type: "cabinet privé"
      }));
    } else {
      // Clear private cabinet fields when switching to institution
      setFormData(prev => ({
        ...prev,
        institution_nom: "",
        institution_type: "",
        institution_email: "",
        institution_telephone: "",
        latitude: "",
        longitude: ""
      }));
    }
  };

  /**
   * Prepare data for submission
   * @returns {Object} - Data ready for API submission
   */
  const prepareDataForSubmission = () => {
    const submitData = { ...formData };
    
    if (isPrivateCabinet) {
      // For private cabinet, include cabinet details
      submitData.institution_type = "cabinet privé";
      submitData.create_cabinet = true;
      delete submitData.institution_id;
    } else {
      // For existing institution, remove cabinet fields
      delete submitData.institution_nom;
      delete submitData.institution_type;
      delete submitData.institution_email;
      delete submitData.institution_telephone;
      delete submitData.create_cabinet;
    }
    
    return submitData;
  };
  
  return {
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
  };
};

export default useDoctorForm; 