// Username validation rules
exports.validateUsername = (username) => {
  // Username requirements:
  // - No spaces
  // - Only alphanumeric characters, underscores, and periods
  // - Length between 3 and 30 characters
  const usernameRegex = /^[a-zA-Z0-9_.]{3,30}$/;
  
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

  if (username.length > 30) {
    return {
      isValid: false,
      message: "Le nom d'utilisateur ne doit pas dépasser 30 caractères"
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

// Validate CNE format (required version for walk-in patients)exports.validateCNE = (cne) => {  if (!cne || cne.trim().length === 0) {    return {      isValid: false,      message: "Le CNE est requis"    };  }    // CNE format: 1-2 letters followed by 6+ alphanumeric characters  const cneRegex = /^[A-Za-z]{1,2}[A-Za-z0-9]{6,}$/;    if (!cneRegex.test(cne.trim())) {    return {      isValid: false,      message: "Format CNE invalide. Doit contenir 1-2 lettres suivies d'au moins 6 caractères alphanumériques"    };  }    return { isValid: true };};// Validate CNE format (optional version for regular registration)exports.validateCNEOptional = (cne) => {  if (!cne) {    return { isValid: true }; // CNE is optional for regular registration  }    // CNE format: 1-2 letters followed by 6+ alphanumeric characters  const cneRegex = /^[A-Za-z]{1,2}[A-Za-z0-9]{6,}$/;    if (!cneRegex.test(cne.trim())) {    return {      isValid: false,      message: "Format CNE invalide. Doit contenir 1-2 lettres suivies d'au moins 6 caractères alphanumériques"    };  }    return { isValid: true };};

// Validate name (first name or last name)
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