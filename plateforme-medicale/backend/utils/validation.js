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