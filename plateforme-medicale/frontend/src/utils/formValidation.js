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
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {Object} - Contains whether the username is valid and any error message
 */
export const validateUsername = (username) => {
  // Username should be 3-20 characters and only contain letters, numbers, dots, and underscores
  const usernameRegex = /^[a-z0-9._]{3,20}$/;
  
  if (!username) {
    return { isValid: false, errorMessage: "Le nom d'utilisateur est requis" };
  }
  
  if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      errorMessage: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres minuscules, des chiffres, des points et des tirets bas" 
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
 * @param {string} birthDate - The birth date to validate in format YYYY-MM-DD
 * @returns {Object} - Contains whether the date is valid and any error message
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { isValid: false, errorMessage: "La date de naissance est requise" };
  }
  
  const birthDateObj = new Date(birthDate);
  const today = new Date();
  
  // Check if date is valid
  if (isNaN(birthDateObj.getTime())) {
    return { isValid: false, errorMessage: "Format de date invalide" };
  }
  
  // Check if date is in the future
  if (birthDateObj > today) {
    return { isValid: false, errorMessage: "La date de naissance ne peut pas être dans le futur" };
  }
  
  // Check if person is at least 1 year old
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  if (birthDateObj > oneYearAgo) {
    return { isValid: false, errorMessage: "L'âge minimum est de 1 an" };
  }
  
  // Check if person is not too old (less than 120 years old)
  const maxAge = new Date();
  maxAge.setFullYear(today.getFullYear() - 120);
  
  if (birthDateObj < maxAge) {
    return { isValid: false, errorMessage: "L'âge maximum est de 120 ans" };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {Object} - Contains whether the phone is valid and any error message
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: true, errorMessage: "" }; // Phone is optional
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
 * Validates a postal code
 * @param {string} postalCode - The postal code to validate
 * @returns {Object} - Contains whether the postal code is valid and any error message
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return { isValid: true, errorMessage: "" }; // Postal code is optional
  }
  
  // Moroccan postal codes are 5 digits
  const postalCodeRegex = /^\d{5}$/;
  
  if (!postalCodeRegex.test(postalCode)) {
    return { 
      isValid: false, 
      errorMessage: "Le code postal doit contenir 5 chiffres" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a CNE (Carte Nationale d'Étudiant) - Optional for regular registration
 * @param {string} cne - The CNE to validate
 * @returns {Object} - Contains whether the CNE is valid and any error message
 */
export const validateCNE = (cne) => {
  if (!cne) {
    return { isValid: true, errorMessage: "" }; // CNE is optional for regular registration
  }
  
  // CNE can be 1-2 letters followed by at least 6 characters
  const cneRegex = /^[A-Za-z]{1,2}[A-Za-z0-9]{6,}$/;
  
  if (!cneRegex.test(cne)) {
    return { 
      isValid: false, 
      errorMessage: "Le CNE doit comporter 1 ou 2 lettres suivies d'au moins 6 caractères" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates a CNE (Carte Nationale d'Étudiant) - Required for walk-in patients
 * @param {string} cne - The CNE to validate
 * @returns {Object} - Contains whether the CNE is valid and any error message
 */
export const validateCNERequired = (cne) => {
  if (!cne || cne.trim().length === 0) {
    return { isValid: false, errorMessage: "Le CNE est requis" };
  }
  
  // CNE can be 1-2 letters followed by at least 6 characters
  const cneRegex = /^[A-Za-z]{1,2}[A-Za-z0-9]{6,}$/;
  
  if (!cneRegex.test(cne.trim())) {
    return { 
      isValid: false, 
      errorMessage: "Le CNE doit comporter 1 ou 2 lettres suivies d'au moins 6 caractères alphanumériques" 
    };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates CNE confirmation field
 * @param {string} cne - The original CNE
 * @param {string} cneConfirm - The CNE confirmation
 * @returns {Object} - Contains whether the confirmation is valid and any error message
 */
export const validateCNEConfirmation = (cne, cneConfirm) => {
  if (!cneConfirm || cneConfirm.trim().length === 0) {
    return { isValid: false, errorMessage: "La confirmation du CNE est requise" };
  }
  
  if (cne !== cneConfirm) {
    return { isValid: false, errorMessage: "Les CNE ne correspondent pas" };
  }
  
  return { isValid: true, errorMessage: "" };
};

/**
 * Validates CNE confirmation field (optional version)
 * @param {string} cne - The original CNE
 * @param {string} cneConfirm - The CNE confirmation
 * @returns {Object} - Contains whether the confirmation is valid and any error message
 */
export const validateCNEConfirmationOptional = (cne, cneConfirm) => {
  // If no CNE is provided, confirmation is not needed
  if (!cne || cne.trim().length === 0) {
    return { isValid: true, errorMessage: "" };
  }
  
  // If CNE is provided but confirmation is empty
  if (!cneConfirm || cneConfirm.trim().length === 0) {
    return { isValid: false, errorMessage: "La confirmation du CNE est requise" };
  }
  
  if (cne !== cneConfirm) {
    return { isValid: false, errorMessage: "Les CNE ne correspondent pas" };
  }
  
  return { isValid: true, errorMessage: "" };
}; 