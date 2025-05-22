import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/layout';
import MedecinDashboard from './components/MedecinDashboard';
import PatientMedicalRecord from './components/medecin/PatientMedicalRecord';
import UpcomingAppointments from './components/medecin/UpcomingAppointments';
import PatientSearch from './pages/medecin/PatientSearch';
import MedicalRecords from './pages/medecin/MedicalRecords';
import WalkInPatientPage from './pages/medecin/WalkInPatientPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import PatientRegistrationForm from './components/auth/PatientRegistrationForm';
import EmailVerification from './components/EmailVerification';
import Unauthorized from './components/Unauthorized';
import AdminHome from './components/AdminHome';
import PatientHome from './components/PatientHome';
import InstitutionHome from './components/InstitutionHome';
import ManageAdmins from './components/ManageAdmins';
import DoctorManagement from './components/doctors/DoctorManagement';
import DoctorSearch from './components/DoctorSearch/DoctorSearch';
import AppointmentBookingPage from './components/appointments/AppointmentBookingPage';
import medicalTheme from './styles/theme';

// Import the doctor components
import { 
  Appointments as MedecinAppointments,
  PatientSearch as MedecinPatientSearch,
  MedicalRecords as MedecinMedicalRecords,
  Calendar as MedecinCalendar
} from './components/medecin';

function App() {
  return (
    <ThemeProvider theme={medicalTheme}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/register/patient" element={
            <AuthRedirect>
              <PatientRegistrationForm />
            </AuthRedirect>
          } />
          <Route path="/verify-email" element={<EmailVerification />} />

          {/* Protected routes with DashboardLayout */}
          <Route element={<DashboardLayout />}>
            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ManageAdmins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/medecins"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />

            {/* Doctor routes */}
            <Route
              path="/medecin"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <Navigate to="/medecin/dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedecinDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/appointments"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedecinAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/search"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <PatientSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/:patientId/medical-record"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <PatientMedicalRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/medical-records"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patient-direct"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <WalkInPatientPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/calendar"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedecinCalendar />
                </ProtectedRoute>
              }
            />

            {/* Patient routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/search-doctors"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DoctorSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book-appointment/:doctorId"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <AppointmentBookingPage />
                </ProtectedRoute>
              }
            />

            {/* Institution routes */}
            <Route
              path="/institution"
              element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionHome />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Default route */}
          <Route path="*" element={<Navigate to="/unauthorized" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;