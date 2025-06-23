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
  console.log('🔍 [DEBUG] isSuperAdmin middleware called');
  console.log('🔍 [DEBUG] User role from token:', req.user.role);
  console.log('🔍 [DEBUG] Request URL:', req.originalUrl);
  console.log('🔍 [DEBUG] Full user object:', req.user);
  
  if (req.user.role !== 'super_admin') {
    console.log('❌ [ERROR] Access denied - user role is not super_admin');
    return res.status(403).json({ message: "Accès réservé aux super administrateurs" });
  }
  
  console.log('✅ [SUCCESS] Super admin access granted');
  next();
};

// Admin or Super Admin
exports.isAdmin = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
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
  if (!['institution', 'pharmacy', 'hospital', 'laboratory', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux institutions médicales" });
  }
  next();
};

// Pharmacy specific access
exports.isPharmacy = (req, res, next) => {
  if (!['pharmacy', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux pharmacies" });
  }
  next();
};

// Hospital specific access
exports.isHospital = (req, res, next) => {
  if (!['hospital', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux hôpitaux" });
  }
  next();
};

// Laboratory specific access
exports.isLaboratory = (req, res, next) => {
  if (!['laboratory', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux laboratoires" });
  }
  next();
};

// Medical institutions (hospitals, clinics, doctors)
exports.isMedicalInstitution = (req, res, next) => {
  if (!['medecin', 'hospital', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux institutions médicales" });
  }
  next();
};
