const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  console.log('=== DEBUG: verifyToken middleware called ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request method:', req.method);
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('DEBUG: No valid authorization header found');
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const token = authHeader.split(' ')[1];
    console.log('DEBUG: Token extracted, length:', token.length);

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET non défini dans .env');
      return res.status(500).json({ message: 'Erreur de configuration du serveur' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DEBUG: Token decoded successfully');
    console.log('DEBUG: User info from token:', {
      id: decoded.id,
      role: decoded.role,
      nom_utilisateur: decoded.nom_utilisateur,
      id_specifique_role: decoded.id_specifique_role
    });

    req.user = {
      id: decoded.id,
      nom_utilisateur: decoded.nom_utilisateur,
      role: decoded.role,
      prenom: decoded.prenom,
      nom: decoded.nom,
      id_specifique_role: decoded.id_specifique_role // Add this
    };

    console.log('DEBUG: User attached to request, proceeding to next middleware');
    next();
  } catch (error) {
    console.log('DEBUG: Token verification failed');
    console.log('DEBUG: Error name:', error.name);
    console.log('DEBUG: Error message:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expirée, veuillez vous reconnecter' });
    }
    console.error('Erreur d\'authentification :', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Super Admin only
exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: "Accès réservé aux super administrateurs" });
  }
  next();
};

// Admin or Super Admin
exports.isAdmin = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }

  // Restriction: admin can't modify patients
  if (
    req.user.role === 'admin' &&
    ['POST', 'PUT', 'DELETE'].includes(req.method) &&
    req.originalUrl.includes('/patients')
  ) {
    return res.status(403).json({ message: "Les administrateurs ne peuvent pas modifier les patients" });
  }

  next();
};

// Médecin, Admin ou Super Admin
exports.isMedecin = (req, res, next) => {
  if (!['medecin', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux médecins" });
  }
  next();
};

// Patient, Admin ou Super Admin
exports.isPatient = (req, res, next) => {
  if (!['patient', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux patients" });
  }
  next();
};

// Institution, Admin ou Super Admin
exports.isInstitution = (req, res, next) => {
  if (!['institution', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux institutions médicales" });
  }
  next();
};
