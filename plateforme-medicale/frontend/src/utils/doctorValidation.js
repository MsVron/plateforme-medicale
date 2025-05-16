/**
 * Validation functions for doctor forms
 */

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!username) {
    return "Le nom d'utilisateur est requis";
  }
  if (username.length < 3) {
    return "Le nom d'utilisateur doit contenir au moins 3 caractères";
  }
  if (username.length > 30) {
    return "Le nom d'utilisateur ne doit pas dépasser 30 caractères";
  }
  if (!usernameRegex.test(username)) {
    return "Le nom d'utilisateur ne doit contenir que des lettres, chiffres et underscores (_), sans espaces";
  }
  return "";
};

/**
 * Validates required doctor personal information
 * @param {Object} formData - Form data
 * @returns {string} - Error message or empty string if valid
 */
export const validatePersonalInfo = (formData) => {
  // First check if first name and last name are provided
  if (!formData.prenom || !formData.nom) {
    return "Veuillez d'abord remplir le prénom et le nom du médecin";
  }

  // Then check other required fields
  if (!formData.nom_utilisateur || 
      !formData.email || 
      !formData.specialite_id || 
      !formData.numero_ordre) {
    return "Les champs obligatoires marqués d'un astérisque (*) doivent être remplis";
  }
  
  // Check for valid email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return "Veuillez entrer une adresse email valide";
  }
  
  return "";
};

/**
 * Validates required doctor institution information
 * @param {Object} formData - Form data
 * @param {boolean} isPrivateCabinet - Whether the doctor has a private practice
 * @returns {string} - Error message or empty string if valid
 */
export const validateInstitutionInfo = (formData, isPrivateCabinet) => {
  if (isPrivateCabinet) {
    if (!formData.institution_nom) {
      return "Le nom du cabinet privé est requis";
    }
    if (!formData.institution_email) {
      return "L'email du cabinet privé est requis";
    }
    
    // Check for valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.institution_email)) {
      return "Veuillez entrer une adresse email valide pour le cabinet";
    }
    
    // Validate coordinates if provided
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      return "La latitude doit être un nombre entre -90 et 90";
    }
    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      return "La longitude doit être un nombre entre -180 et 180";
    }
  }
  
  return "";
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return ""; // Phone is optional
  
  const phoneRegex = /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return "Veuillez entrer un numéro de téléphone valide";
  }
  
  return "";
};

/**
 * Validates full doctor form data
 * @param {Object} formData - Form data
 * @param {boolean} isPrivateCabinet - Whether the doctor has a private practice
 * @param {boolean} isEditMode - Whether we're editing an existing doctor
 * @returns {string} - Error message or empty string if valid
 */
export const validateDoctorForm = (formData, isPrivateCabinet, isEditMode) => {
  // First, check that first name and last name are filled
  if (!formData.prenom || !formData.nom) {
    return "Veuillez d'abord remplir le prénom et le nom du médecin";
  }
  
  // Then check username
  const usernameError = validateUsername(formData.nom_utilisateur);
  if (usernameError) return usernameError;
  
  // Check password (only required for new doctors)
  if (!isEditMode && !formData.mot_de_passe) {
    return "Le mot de passe est requis";
  }
  
  // Check personal info
  const personalInfoError = validatePersonalInfo(formData);
  if (personalInfoError) return personalInfoError;
  
  // Check institution info
  const institutionInfoError = validateInstitutionInfo(formData, isPrivateCabinet);
  if (institutionInfoError) return institutionInfoError;
  
  return "";
};

export default {
  validateUsername,
  validatePersonalInfo,
  validateInstitutionInfo,
  validatePhone,
  validateDoctorForm
}; 