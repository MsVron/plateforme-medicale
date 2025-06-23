import axios from './axiosConfig';

export const hospitalService = {
  // Search patients with hospital context (reusing medecin search)
  searchPatients: async (searchCriteria) => {
    try {
      const response = await axios.get('/medecin/patients/search', {
        params: searchCriteria
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add walk-in patient
  addWalkInPatient: async (patientData) => {
    try {
      const response = await axios.post('/hospital/patients/walk-in', patientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hospital admissions
  getHospitalAdmissions: async () => {
    try {
      const response = await axios.get('/hospital/admissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  admitPatient: async (patientId, admissionData) => {
    try {
      const response = await axios.post(`/hospital/patients/${patientId}/admit`, admissionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  dischargePatient: async (admissionId, dischargeData) => {
    try {
      const response = await axios.put(`/hospital/admissions/${admissionId}/discharge`, dischargeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Doctor management
  getHospitalDoctors: async () => {
    try {
      const response = await axios.get('/hospital/doctors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  searchDoctors: async (searchCriteria) => {
    try {
      const response = await axios.get('/hospital/doctors/search', {
        params: searchCriteria
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addDoctorToHospital: async (doctorId, assignmentData) => {
    try {
      const response = await axios.post(`/hospital/doctors/${doctorId}/assign`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeDoctorFromHospital: async (doctorId) => {
    try {
      const response = await axios.delete(`/hospital/doctors/${doctorId}/remove`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Statistics
  getDoctorStats: async () => {
    try {
      const response = await axios.get('/hospital/stats/doctors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAdmissionStats: async () => {
    try {
      const response = await axios.get('/hospital/stats/admissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all medical specialties
  getSpecialties: async () => {
    try {
      const response = await axios.get('/hospital/specialties');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Medical records management
  getPatientMedicalRecord: async (patientId) => {
    try {
      const response = await axios.get(`/hospital/patients/${patientId}/medical-record`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updatePatientMedicalRecord: async (patientId, medicalRecordData) => {
    try {
      const response = await axios.put(`/hospital/patients/${patientId}/medical-record`, medicalRecordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Comprehensive medical dossier (like doctors have)
  getPatientDossier: async (patientId) => {
    try {
      const response = await axios.get(`/hospital/patients/${patientId}/dossier`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Patient-Doctor assignment management
  assignPatientToDoctors: async (patientId, assignmentData) => {
    try {
      const response = await axios.post(`/hospital/patients/${patientId}/assign-doctors`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign doctor to existing admission
  assignDoctorToAdmission: async (admissionId, assignmentData) => {
    try {
      const response = await axios.post(`/hospital/admissions/${admissionId}/assign-doctor`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get patient admission details with assigned doctors
  getPatientAdmissionDetails: async (admissionId) => {
    try {
      const response = await axios.get(`/hospital/admissions/${admissionId}/details`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove doctor from patient admission
  removeDoctorFromAdmission: async (admissionId, doctorId) => {
    try {
      const response = await axios.delete(`/hospital/admissions/${admissionId}/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default hospitalService; 