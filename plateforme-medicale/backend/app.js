const medecinRoutes = require('./routes/medecinRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use('/api/medecin', medecinRoutes);
app.use('/api/appointments', appointmentRoutes); 