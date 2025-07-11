import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/layout';
import MedecinDashboard from './components/MedecinDashboard';
import PatientMedicalRecord from './components/medecin/PatientMedicalRecord';
import MedicalDossier from './components/medecin/MedicalDossier';
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
import ResetPassword from './components/ResetPassword';
import Unauthorized from './components/Unauthorized';
import AdminHome from './components/AdminHome';
import PatientHome from './components/PatientHome';
import InstitutionHome from './components/InstitutionHome';
import ManageAdmins from './components/ManageAdmins';
import DoctorManagement from './components/doctors/DoctorManagement';
import DoctorSearch from './components/DoctorSearch/DoctorSearch';
import AppointmentBookingPage from './components/appointments/AppointmentBookingPage';
import PatientAppointments from './components/patient/PatientAppointments';
import PatientFavorites from './components/patient/PatientFavorites';
import medicalTheme, { getThemeForRole } from './styles/theme';
import ThemeUpdater from './components/ThemeUpdater';
import LandingPage from './components/LandingPage';

// Import the new pages
import MedicalRecord from './pages/patient/MedicalRecord';
import InstitutionManagement from './pages/admin/InstitutionManagement';
import PharmacyManagement from './pages/admin/PharmacyManagement';
import PatientRegistration from './pages/admin/PatientRegistration';
import Statistics from './pages/admin/Statistics';
import AppointmentEmailManagement from './pages/admin/AppointmentEmailManagement';

// Import appointment email pages
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import AppointmentSuccess from './pages/AppointmentSuccess';
import AppointmentError from './pages/AppointmentError';

// Import Super Admin pages
import BasicStats from './pages/superadmin/BasicStats';
import Notifications from './pages/superadmin/Notifications';

// Import the doctor components
import { 
  UpcomingAppointments as MedecinAppointments,
  PatientSearch as MedecinPatientSearch,
  MedicalRecords as MedecinMedicalRecords,
  Calendar as MedecinCalendar
} from './components/medecin';

// Import hospital components
import HospitalDashboard from './components/hospital/HospitalDashboard';
import HospitalHome from './pages/hospital/HospitalHome';
import PatientSearchTab from './components/hospital/PatientSearchTab';
import PatientAdmission from './pages/hospital/PatientAdmission';

// Import pharmacy components
import PharmacyDashboard from './components/pharmacy/PharmacyDashboard';
import PharmacyHome from './pages/pharmacy/PharmacyHome';
import PatientPrescriptions from './pages/pharmacy/PatientPrescriptions';

// Import laboratory components
import LaboratoryDashboard from './components/laboratory/LaboratoryDashboard';
import LaboratoryHome from './pages/laboratory/LaboratoryHome';
import PatientAnalysisPage from './pages/laboratory/PatientAnalysisPage';

// Import debug component
import DebugHospital from './components/DebugHospital';

function App() {
  const [currentTheme, setCurrentTheme] = useState(medicalTheme);

  // Function to update theme based on user role
  const updateThemeForUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const roleTheme = getThemeForRole(user.role);
        setCurrentTheme(roleTheme);
      } else {
        setCurrentTheme(medicalTheme); // Default theme
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      setCurrentTheme(medicalTheme); // Fallback to default
    }
  };

  // Update theme on component mount and when localStorage changes
  useEffect(() => {
    updateThemeForUser();
    
    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      updateThemeForUser();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when user data changes
    window.addEventListener('userDataChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <ThemeUpdater />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <AuthRedirect>
              <LandingPage />
            </AuthRedirect>
          } />
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
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Appointment email routes - public access */}
          <Route path="/appointment/confirm" element={<AppointmentConfirmation />} />
          <Route path="/appointment/success" element={<AppointmentSuccess />} />
          <Route path="/appointment/error" element={<AppointmentError />} />

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
            <Route
              path="/admin/institutions"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <InstitutionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patient-registration"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <PatientRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pharmacy-management"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <PharmacyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/statistics"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointment-emails"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <AppointmentEmailManagement />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Basic Statistics Route */}
            <Route
              path="/superadmin/basic-stats"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <BasicStats />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Notifications Route */}
            <Route
              path="/superadmin/notifications"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <Notifications />
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
              path="/medecin/patient-search"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <PatientSearch />
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
              path="/medecin/medical-records"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/walk-in"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <WalkInPatientPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patient/:patientId"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <PatientMedicalRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/dossier/:patientId"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedicalDossier />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/appointments"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <UpcomingAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/:patientId/dossier"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedicalDossier />
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
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/favorites"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientFavorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/medical-record"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MedicalRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-doctors"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DoctorSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/doctor-search"
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

            {/* Hospital routes */}
            <Route
              path="/hospital"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <HospitalHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/dashboard"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <HospitalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/doctors"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <HospitalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/patients/search"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <PatientSearchTab />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hospital/admissions"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <HospitalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/patient-admission"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <PatientAdmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/debug"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <DebugHospital />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/patient-direct"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <WalkInPatientPage />
                </ProtectedRoute>
              }
            />

            {/* Hospital medical dossier route */}
            <Route
              path="/hospital/patients/:patientId/dossier"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <MedicalDossier />
                </ProtectedRoute>
              }
            />

            {/* Pharmacy routes */}
            <Route
              path="/pharmacy"
              element={
                <ProtectedRoute allowedRoles={['pharmacy']}>
                  <PharmacyHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/dashboard"
              element={
                <ProtectedRoute allowedRoles={['pharmacy']}>
                  <PharmacyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pharmacy/patients/:patientId/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['pharmacy']}>
                  <PatientPrescriptions />
                </ProtectedRoute>
              }
            />

            {/* Laboratory routes */}
            <Route
              path="/laboratory"
              element={
                <ProtectedRoute allowedRoles={['laboratory']}>
                  <LaboratoryHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratory/dashboard"
              element={
                <ProtectedRoute allowedRoles={['laboratory']}>
                  <LaboratoryDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratory/patient/:patientId/analysis"
              element={
                <ProtectedRoute allowedRoles={['laboratory']}>
                  <PatientAnalysisPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;