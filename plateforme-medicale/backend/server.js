const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
// Add routes for patients, doctors, and institutions
const patientRoutes = require('./routes/patientRoutes');
const medecinRoutes = require('./routes/medecinRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Institution-specific routes
const hospitalRoutes = require('./routes/hospitalRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const laboratoryRoutes = require('./routes/laboratoryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', patientRoutes);
app.use('/api', medecinRoutes);
app.use('/api', institutionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/appointments', appointmentRoutes);

// Institution-specific API routes
app.use('/api/hospital', hospitalRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/laboratory', laboratoryRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de la Plateforme Médicale' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});