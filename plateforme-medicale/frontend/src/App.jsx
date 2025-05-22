import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MedecinDashboard from './pages/medecin/MedecinDashboard';
import PatientMedicalRecord from './components/medecin/PatientMedicalRecord';
import UpcomingAppointments from './components/medecin/UpcomingAppointments';
import PatientSearch from './pages/medecin/PatientSearch';
import MedicalRecords from './pages/medecin/MedicalRecords';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Protected routes with Layout */}
        <Route path="/medecin" element={
          <ProtectedRoute roles={['medecin']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="" element={<Navigate to="/medecin/dashboard" />} />
          <Route path="dashboard" element={<MedecinDashboard />} />
          <Route path="appointments" element={<UpcomingAppointments />} />
          <Route path="patients/search" element={<PatientSearch />} />
          <Route path="patients/:patientId/medical-record" element={<PatientMedicalRecord />} />
          <Route path="medical-records" element={<MedicalRecords />} />
        </Route>
        
        {/* Default route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App; 