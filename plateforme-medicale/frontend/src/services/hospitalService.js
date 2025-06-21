import axios from './axiosConfig';

export const hospitalService = {
  // Search patients with hospital context
  searchPatients: async (searchCriteria) => {
    try {
      const response = await axios.get('/hospital/patients/search', {
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

  dischargePatient: async (assignmentId, dischargeData) => {
    try {
      const response = await axios.put(`/hospital/assignments/${assignmentId}/discharge`, dischargeData);
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
  }
};

export default hospitalService; 