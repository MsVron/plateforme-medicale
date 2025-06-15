// Username validation rules - Updated to match database schema (VARCHAR(50))
exports.validateUsername = (username) => {
  // Username requirements:
  // - No spaces
  // - Only alphanumeric characters, underscores, and periods
  // - Length between 3 and 50 characters (matching database schema)
  const usernameRegex = /^[a-zA-Z0-9_.]{3,50}$/;
  
  if (!username) {
    return {
      isValid: false,
      message: "Le nom d'utilisateur est requis"
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: "Le nom d'utilisateur doit contenir au moins 3 caractères"
    };
  }

  if (username.length > 50) {
    return {
      isValid: false,
      message: "Le nom d'utilisateur ne doit pas dépasser 50 caractères"
    };
  }

  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: "Le nom d'utilisateur ne doit contenir que des lettres, chiffres, points (.) et underscores (_), sans espaces"
    };
  }
  
  return { isValid: true };
};

// Generate username from first name and last name
exports.generateUsername = (prenom, nom) => {
  if (!prenom || !nom) {
    throw new Error('Prénom et nom requis pour générer le nom d\'utilisateur');
  }
  
  // Clean and normalize names
  const cleanPrenom = prenom.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, ''); // Remove special characters
    
  const cleanNom = nom.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, ''); // Remove special characters
  
  return `${cleanPrenom}.${cleanNom}`;
};

// Email validation - Updated to match database schema (VARCHAR(100))
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return {
      isValid: false,
      message: "L'email est requis"
    };
  }
  
  if (email.length > 100) {
    return {
      isValid: false,
      message: "L'email ne doit pas dépasser 100 caractères"
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Format d'email invalide"
    };
  }
  
  return { isValid: true };
};

// Password validation
exports.validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: "Le mot de passe est requis"
    };
  }
  
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins 6 caractères"
    };
  }
  
  // Check for at least 1 letter and 1 number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins une lettre et un chiffre"
    };
  }
  
  return { isValid: true };
};

// Phone validation - Updated to match database schema (VARCHAR(20))
exports.validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  if (phone.length > 20) {
    return {
      isValid: false,
      message: "Le numéro de téléphone ne doit pas dépasser 20 caractères"
    };
  }
  
  // Moroccan phone number format
  const phoneRegex = /^(?:\+212|0)[5-7]\d{8}$/;
  
  if (!phoneRegex.test(phone.replace(/[\s.-]/g, ''))) {
    return {
      isValid: false,
      message: "Format de téléphone invalide (ex: +212612345678 ou 0612345678)"
    };
  }
  
  return { isValid: true };
};

// Validate name (first name or last name) - Updated to match database schema (VARCHAR(50))
exports.validateName = (name, fieldName = 'nom') => {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      message: `Le ${fieldName} est requis`
    };
  }
  
  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: `Le ${fieldName} doit contenir au moins 2 caractères`
    };
  }
  
  if (name.trim().length > 50) {
    return {
      isValid: false,
      message: `Le ${fieldName} ne doit pas dépasser 50 caractères`
    };
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      message: `Le ${fieldName} ne doit contenir que des lettres, espaces, tirets et apostrophes`
    };
  }
  
  return { isValid: true };
};

// CNE validation - Updated to match database schema (VARCHAR(20))
exports.validateCNE = (cne, required = false) => {
  if (!cne || cne.trim().length === 0) {
    if (required) {
      return {
        isValid: false,
        message: "Le CNE est requis"
      };
    }
    return { isValid: true }; // Optional
  }
  
  if (cne.length > 20) {
    return {
      isValid: false,
      message: "Le CNE ne doit pas dépasser 20 caractères"
    };
  }
  
  // Standardized CNE format: 1-2 letters followed by 6-18 characters (alphanumeric)
  const cneRegex = /^[A-Za-z]{1,2}[A-Za-z0-9]{6,18}$/;
  
  if (!cneRegex.test(cne.trim())) {
    return {
      isValid: false,
      message: "Le CNE doit comporter 1 ou 2 lettres suivies de 6 à 18 caractères alphanumériques"
    };
  }
  
  return { isValid: true };
};

// Postal code validation - Updated to match database schema (VARCHAR(10))
exports.validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return { isValid: true }; // Optional
  }
  
  if (postalCode.length > 10) {
    return {
      isValid: false,
      message: "Le code postal ne doit pas dépasser 10 caractères"
    };
  }
  
  // Basic postal code format (numbers and letters)
  const postalCodeRegex = /^[A-Za-z0-9\s-]{2,10}$/;
  
  if (!postalCodeRegex.test(postalCode)) {
    return {
      isValid: false,
      message: "Format de code postal invalide"
    };
  }
  
  return { isValid: true };
};

// Blood group validation - Database ENUM validation
exports.validateBloodGroup = (bloodGroup) => {
  if (!bloodGroup) {
    return { isValid: true }; // Optional
  }
  
  const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  if (!validBloodGroups.includes(bloodGroup)) {
    return {
      isValid: false,
      message: "Groupe sanguin invalide"
    };
  }
  
  return { isValid: true };
};

// Alcohol consumption validation - Database ENUM validation
exports.validateAlcoholConsumption = (consumption) => {
  if (!consumption) {
    return { isValid: true }; // Optional
  }
  
  const validConsumptions = ['non', 'occasionnel', 'régulier', 'quotidien'];
  
  if (!validConsumptions.includes(consumption)) {
    return {
      isValid: false,
      message: "Consommation d'alcool invalide"
    };
  }
  
  return { isValid: true };
};

// Physical activity validation - Database ENUM validation
exports.validatePhysicalActivity = (activity) => {
  if (!activity) {
    return { isValid: true }; // Optional
  }
  
  const validActivities = ['sédentaire', 'légère', 'modérée', 'intense'];
  
  if (!validActivities.includes(activity)) {
    return {
      isValid: false,
      message: "Activité physique invalide"
    };
  }
  
  return { isValid: true };
};

// Weight validation - Database DECIMAL(5,2) validation
exports.validateWeight = (weight) => {
  if (!weight) {
    return { isValid: true }; // Optional
  }
  
  const numWeight = parseFloat(weight);
  
  if (isNaN(numWeight)) {
    return {
      isValid: false,
      message: "Poids invalide"
    };
  }
  
  if (numWeight <= 0 || numWeight > 999.99) {
    return {
      isValid: false,
      message: "Le poids doit être entre 0.01 et 999.99 kg"
    };
  }
  
  // Check decimal places
  const decimalPlaces = (weight.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return {
      isValid: false,
      message: "Maximum 2 décimales autorisées pour le poids"
    };
  }
  
  return { isValid: true };
};

// Height validation - Database INT validation
exports.validateHeight = (height) => {
  if (!height) {
    return { isValid: true }; // Optional
  }
  
  const numHeight = parseInt(height);
  
  if (isNaN(numHeight)) {
    return {
      isValid: false,
      message: "Taille invalide"
    };
  }
  
  if (numHeight < 30 || numHeight > 300) {
    return {
      isValid: false,
      message: "La taille doit être entre 30 et 300 cm"
    };
  }
  
  return { isValid: true };
};

// Medical license number validation - Database VARCHAR(50) validation
exports.validateMedicalLicenseNumber = (licenseNumber) => {
  if (!licenseNumber || licenseNumber.trim().length === 0) {
    return {
      isValid: false,
      message: "Le numéro d'ordre est requis"
    };
  }
  
  if (licenseNumber.length > 50) {
    return {
      isValid: false,
      message: "Le numéro d'ordre ne doit pas dépasser 50 caractères"
    };
  }
  
  // Basic format validation for medical license numbers
  const licenseRegex = /^[A-Za-z0-9\-\/]{3,50}$/;
  
  if (!licenseRegex.test(licenseNumber)) {
    return {
      isValid: false,
      message: "Format de numéro d'ordre invalide"
    };
  }
  
  return { isValid: true };
};

// Monetary value validation - Database DECIMAL(8,2) validation
exports.validateMonetaryValue = (value) => {
  if (!value) {
    return { isValid: true }; // Optional
  }
  
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return {
      isValid: false,
      message: "Valeur numérique invalide"
    };
  }
  
  if (numValue < 0) {
    return {
      isValid: false,
      message: "La valeur ne peut pas être négative"
    };
  }
  
  if (numValue >= 1000000) { // DECIMAL(8,2) max value
    return {
      isValid: false,
      message: "La valeur est trop élevée"
    };
  }
  
  // Check decimal places
  const decimalPlaces = (value.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return {
      isValid: false,
      message: "Maximum 2 décimales autorisées"
    };
  }
  
  return { isValid: true };
};

// Institution type validation - Database ENUM validation
exports.validateInstitutionType = (type) => {
  if (!type) {
    return {
      isValid: false,
      message: "Le type d'institution est requis"
    };
  }
  
  const validTypes = [
    'hôpital', 'clinique', 'cabinet privé', 'centre médical', 'laboratoire', 'autre',
    'pharmacy', 'hospital', 'laboratory', 'clinic'
  ];
  
  if (!validTypes.includes(type)) {
    return {
      isValid: false,
      message: "Type d'institution invalide"
    };
  }
  
  return { isValid: true };
};

// User role validation - Database ENUM validation
exports.validateUserRole = (role) => {
  if (!role) {
    return {
      isValid: false,
      message: "Le rôle utilisateur est requis"
    };
  }
  
  const validRoles = [
    'super_admin', 'admin', 'medecin', 'patient', 'institution', 
    'pharmacy', 'hospital', 'laboratory'
  ];
  
  if (!validRoles.includes(role)) {
    return {
      isValid: false,
      message: "Rôle utilisateur invalide"
    };
  }
  
  return { isValid: true };
};

// Appointment motif validation - Database VARCHAR(255) validation
exports.validateAppointmentMotif = (motif) => {
  if (!motif || motif.trim().length === 0) {
    return {
      isValid: false,
      message: "Le motif de consultation est requis"
    };
  }
  
  if (motif.length > 255) {
    return {
      isValid: false,
      message: "Le motif ne doit pas dépasser 255 caractères"
    };
  }
  
  return { isValid: true };
};

// Medication form validation - Database ENUM validation
exports.validateMedicationForm = (forme) => {
  if (!forme) {
    return {
      isValid: false,
      message: "La forme du médicament est requise"
    };
  }
  
  const validForms = ['comprimé', 'gélule', 'sirop', 'injectable', 'patch', 'pommade', 'autre'];
  
  if (!validForms.includes(forme)) {
    return {
      isValid: false,
      message: "Forme de médicament invalide"
    };
  }
  
  return { isValid: true };
};

// Treatment status validation - Database ENUM validation
exports.validateTreatmentStatus = (status) => {
  if (!status) {
    return { isValid: true }; // Optional, has default
  }
  
  const validStatuses = ['prescribed', 'dispensed', 'expired'];
  
  if (!validStatuses.includes(status)) {
    return {
      isValid: false,
      message: "Statut de traitement invalide"
    };
  }
  
  return { isValid: true };
};

// Check if username exists and generate unique one if needed
exports.generateUniqueUsername = async (prenom, nom, db) => {
  const baseUsername = exports.generateUsername(prenom, nom);
  let username = baseUsername;
  let counter = 1;
  
  while (true) {
    // Check if username exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM utilisateurs WHERE nom_utilisateur = ?',
      [username]
    );
    
    if (existingUsers.length === 0) {
      return username;
    }
    
    // If exists, try with counter
    username = `${baseUsername}${counter}`;
    counter++;
    
    // Safety check to prevent infinite loop
    if (counter > 999) {
      throw new Error('Impossible de générer un nom d\'utilisateur unique');
    }
  }
};

// Validate CNE format (optional version for regular registration)
exports.validateCNEOptional = (cne) => {
  if (!cne) {
    return { isValid: true }; // CNE is optional for regular registration
  }
  
  // CNE format: 1-2 letters followed by 6+ alphanumeric characters
  const cneRegex = /^[A-Za-z]{1,2}[A-Za-z0-9]{6,}$/;
  
  if (!cneRegex.test(cne.trim())) {
    return {
      isValid: false,
      message: "Format CNE invalide. Doit contenir 1-2 lettres suivies d'au moins 6 caractères alphanumériques"
    };
  }
  
  return { isValid: true };
}; 