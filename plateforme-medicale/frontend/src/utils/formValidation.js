/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a username according to database schema (VARCHAR(50))
 * @param {string} username - The username to validate
 * @returns {Object} - Contains whether the username is valid and any error message
 */
export const validateUsername = (username) => {
  // Username should be 3-50 characters and only contain letters, numbers, dots, and underscores
  const usernameRegex = /^[a-z0-9._]{3,50}$/;
  
  if (!username) {
    return { isValid: false, errorMessage: "Le nom d'utilisateur est requis" };
  }
  
  if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      errorMessage: "Le nom d'utilisateur doit contenir entre 3 et 50 caractères et ne peut contenir que des lettres minuscules, des chiffres, des points et des tirets bas" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - Contains whether the password is valid and any error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, errorMessage: "Le mot de passe est requis" };
  }
  
  if (password.length < 6) {
    return { 
      isValid: false, 
      errorMessage: "Le mot de passe doit contenir au moins 6 caractères" 
    };
  }
  
  // Check for at least 1 letter and 1 number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { 
      isValid: false, 
      errorMessage: "Le mot de passe doit contenir au moins une lettre et un chiffre" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a birth date
 * @param {string|Date} birthDate - The birth date to validate
 * @returns {Object} - Contains whether the birth date is valid and any error message
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { isValid: false, errorMessage: "La date de naissance est requise" };
  }
  
  const date = new Date(birthDate);
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  
  if (isNaN(date.getTime())) {
    return { isValid: false, errorMessage: "Date de naissance invalide" };
  }
  
  if (date > today) {
    return { isValid: false, errorMessage: "La date de naissance ne peut pas être dans le futur" };
  }
  
  if (date < minDate) {
    return { isValid: false, errorMessage: "Date de naissance trop ancienne" };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a phone number according to database schema (VARCHAR(20))
 * @param {string} phone - The phone number to validate
 * @returns {Object} - Contains whether the phone is valid and any error message
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: true, errorMessage: "" }; // Phone is optional
  }
  
  // Check length constraint from database
  if (phone.length > 20) {
    return { 
      isValid: false, 
      errorMessage: "Le numéro de téléphone ne doit pas dépasser 20 caractères" 
    };
  }
  
  // Matches formats like +212612345678, 06-12-34-56-78, 0612345678
  const phoneRegex = /^(?:\+212|0)[\s.-]?[567]\d{8}$/;
  
  if (!phoneRegex.test(phone)) {
    return { 
      isValid: false, 
      errorMessage: "Format de téléphone invalide (ex: +212612345678 ou 0612345678)" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a postal code according to database schema (VARCHAR(10))
 * @param {string} postalCode - The postal code to validate
 * @returns {Object} - Contains whether the postal code is valid and any error message
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return { isValid: true, errorMessage: "" }; // Postal code is optional
  }
  
  // Check length constraint from database
  if (postalCode.length > 10) {
    return { 
      isValid: false, 
      errorMessage: "Le code postal ne doit pas dépasser 10 caractères" 
    };
  }
  
  // Basic postal code format (numbers and letters)
  const postalCodeRegex = /^[A-Za-z0-9\s-]{2,10}$/;
  
  if (!postalCodeRegex.test(postalCode)) {
    return { 
      isValid: false, 
      errorMessage: "Format de code postal invalide" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a CIN (Carte d'Identité Nationale) according to database schema (VARCHAR(20))
 * @param {string} cne - The CIN to validate
 * @returns {Object} - Contains whether the CIN is valid and any error message
 */
export const validateCNE = (cne) => {
  if (!cne) {
    return { isValid: true, errorMessage: "" }; // CIN is optional for regular registration
  }
  
  // Basic length check
  if (cne.length > 20) {
    return {
      isValid: false,
      errorMessage: "Le CIN ne doit pas dépasser 20 caractères"
    };
  }
  
  // Standardized CIN format: 1-2 letters followed by 6-18 characters (alphanumeric)
  const cneRegex = /^[A-Za-z]{1,2}[A-Za-z0-9]{6,18}$/;
  
  if (!cneRegex.test(cne)) {
    return {
      isValid: false,
      errorMessage: "Le CIN doit comporter 1 ou 2 lettres suivies de 6 à 18 caractères alphanumériques"
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a required CIN
 * @param {string} cne - The CIN to validate
 * @returns {Object} - Contains whether the CIN is valid and any error message
 */
export const validateCNERequired = (cne) => {
  if (!cne || cne.trim().length === 0) {
    return { isValid: false, errorMessage: "Le CIN est requis" };
  }
  
  return validateCNE(cne);
};

/**
 * Validates CIN confirmation field
 * @param {string} cne - The original CIN
 * @param {string} cneConfirm - The CIN confirmation
 * @returns {Object} - Contains whether the confirmation is valid and any error message
 */
export const validateCNEConfirmation = (cne, cneConfirm) => {
  if (!cneConfirm || cneConfirm.trim().length === 0) {
    return { isValid: false, errorMessage: "La confirmation du CIN est requise" };
  }
  
  if (cne !== cneConfirm) {
    return { isValid: false, errorMessage: "Les CIN ne correspondent pas" };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates CIN confirmation field (optional version)
 * @param {string} cne - The original CIN
 * @param {string} cneConfirm - The CIN confirmation
 * @returns {Object} - Contains whether the confirmation is valid and any error message
 */
export const validateCNEConfirmationOptional = (cne, cneConfirm) => {
  // If no CIN is provided, confirmation is not needed
  if (!cne || cne.trim().length === 0) {
    return { isValid: true, errorMessage: "" };
  }
  
  // If CIN is provided but confirmation is empty
  if (!cneConfirm || cneConfirm.trim().length === 0) {
    return { isValid: false, errorMessage: "La confirmation du CIN est requise" };
  }
  
  if (cne !== cneConfirm) {
    return { isValid: false, errorMessage: "Les CIN ne correspondent pas" };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a name field according to database schema (VARCHAR(50))
 * @param {string} name - The name to validate
 * @param {string} fieldName - The field name for error messages
 * @returns {Object} - Contains whether the name is valid and any error message
 */
export const validateName = (name, fieldName = 'nom') => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: `Le ${fieldName} est requis`
    };
  }
  
  if (name.trim().length < 2) {
    return {
      isValid: false,
      errorMessage: `Le ${fieldName} doit contenir au moins 2 caractères`
    };
  }
  
  if (name.trim().length > 50) {
    return {
      isValid: false,
      errorMessage: `Le ${fieldName} ne doit pas dépasser 50 caractères`
    };
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      errorMessage: `Le ${fieldName} ne doit contenir que des lettres, espaces, tirets et apostrophes`
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates email according to database schema (VARCHAR(100))
 * @param {string} email - The email to validate
 * @returns {Object} - Contains whether the email is valid and any error message
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, errorMessage: "L'email est requis" };
  }
  
  if (email.length > 100) {
    return { 
      isValid: false, 
      errorMessage: "L'email ne doit pas dépasser 100 caractères" 
    };
  }
  
  if (!isValidEmail(email)) {
    return { isValid: false, errorMessage: "Format d'email invalide" };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates blood group according to database ENUM
 * @param {string} bloodGroup - The blood group to validate
 * @returns {Object} - Contains whether the blood group is valid and any error message
 */
export const validateBloodGroup = (bloodGroup) => {
  if (!bloodGroup) {
    return { isValid: true, errorMessage: "" }; // Optional field
  }
  
  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  if (!validBloodGroups.includes(bloodGroup)) {
    return { 
      isValid: false, 
      errorMessage: "Groupe sanguin invalide" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates alcohol consumption according to database ENUM
 * @param {string} consumption - The alcohol consumption to validate
 * @returns {Object} - Contains whether the consumption is valid and any error message
 */
export const validateAlcoholConsumption = (consumption) => {
  if (!consumption) {
    return { isValid: true, errorMessage: "" }; // Optional field
  }
  
  const validConsumptions = ['non', 'occasionnel', 'régulier', 'quotidien'];
  
  if (!validConsumptions.includes(consumption)) {
    return { 
      isValid: false, 
      errorMessage: "Consommation d'alcool invalide" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates physical activity according to database ENUM
 * @param {string} activity - The physical activity to validate
 * @returns {Object} - Contains whether the activity is valid and any error message
 */
export const validatePhysicalActivity = (activity) => {
  if (!activity) {
    return { isValid: true, errorMessage: "" }; // Optional field
  }
  
  const validActivities = ['sédentaire', 'légère', 'modérée', 'intense'];
  
  if (!validActivities.includes(activity)) {
    return { 
      isValid: false, 
      errorMessage: "Activité physique invalide" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates decimal precision for monetary values (DECIMAL(8,2))
 * @param {string|number} value - The value to validate
 * @returns {Object} - Contains whether the value is valid and any error message
 */
export const validateMonetaryValue = (value) => {
  if (!value) {
    return { isValid: true, errorMessage: "" }; // Optional field
  }
  
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      errorMessage: "Valeur numérique invalide" 
    };
  }
  
  if (numValue < 0) {
    return { 
      isValid: false, 
      errorMessage: "La valeur ne peut pas être négative" 
    };
  }
  
  if (numValue >= 1000000) { // DECIMAL(8,2) max value
    return { 
      isValid: false, 
      errorMessage: "La valeur est trop élevée" 
    };
  }
  
  // Check decimal places
  const decimalPlaces = (value.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { 
      isValid: false, 
      errorMessage: "Maximum 2 décimales autorisées" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates weight according to database schema (DECIMAL(5,2))
 * @param {string|number} weight - The weight to validate
 * @returns {Object} - Contains whether the weight is valid and any error message
 */
export const validateWeight = (weight) => {
  if (!weight) {
    return { isValid: true, errorMessage: "" }; // Optional field
  }
  
  const numWeight = parseFloat(weight);
  
  if (isNaN(numWeight)) {
    return { 
      isValid: false, 
      errorMessage: "Poids invalide" 
    };
  }
  
  if (numWeight <= 0 || numWeight > 999.99) { // DECIMAL(5,2) constraint
    return { 
      isValid: false, 
      errorMessage: "Le poids doit être entre 0.01 et 999.99 kg" 
    };
  }
  
  // Check decimal places
  const decimalPlaces = (weight.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { 
      isValid: false, 
      errorMessage: "Maximum 2 décimales autorisées pour le poids" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates height according to database schema (INT)
 * @param {string|number} height - The height to validate
 * @returns {Object} - Contains whether the height is valid and any error message
 */
export const validateHeight = (height) => {
  if (!height) {
    return { isValid: true, errorMessage: "" }; // Optional field
  }
  
  const numHeight = parseInt(height);
  
  if (isNaN(numHeight)) {
    return { 
      isValid: false, 
      errorMessage: "Taille invalide" 
    };
  }
  
  if (numHeight < 30 || numHeight > 300) {
    return { 
      isValid: false, 
      errorMessage: "La taille doit être entre 30 et 300 cm" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates appointment motif according to database schema (VARCHAR(255))
 * @param {string} motif - The motif to validate
 * @returns {Object} - Contains whether the motif is valid and any error message
 */
export const validateAppointmentMotif = (motif) => {
  if (!motif || motif.trim().length === 0) {
    return { isValid: false, errorMessage: "Le motif de consultation est requis" };
  }
  
  if (motif.length > 255) {
    return { 
      isValid: false, 
      errorMessage: "Le motif ne doit pas dépasser 255 caractères" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates medical license number according to database schema (VARCHAR(50))
 * @param {string} licenseNumber - The license number to validate
 * @returns {Object} - Contains whether the license number is valid and any error message
 */
export const validateMedicalLicenseNumber = (licenseNumber) => {
  if (!licenseNumber || licenseNumber.trim().length === 0) {
    return { isValid: false, errorMessage: "L'INPE est requis" };
  }
  
  if (licenseNumber.length > 50) {
    return { 
      isValid: false, 
      errorMessage: "L'INPE ne doit pas dépasser 50 caractères" 
    };
  }
  
  // Basic format validation for medical license numbers
  const licenseRegex = /^[A-Za-z0-9\-\/]{3,50}$/;
  
  if (!licenseRegex.test(licenseNumber)) {
    return { 
      isValid: false, 
      errorMessage: "Format d'INPE invalide" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
}; 