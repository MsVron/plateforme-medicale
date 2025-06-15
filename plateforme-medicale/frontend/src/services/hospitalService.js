import axios from './axiosConfig';

const hospitalService = {
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

  // Get hospital patient list
  getHospitalPatients: async () => {
    try {
      const response = await axios.get('/hospital/patients');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admit patient to hospital
  admitPatient: async (patientId, admissionData) => {
    try {
      const response = await axios.post(`/hospital/patients/${patientId}/admit`, admissionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Discharge patient
  dischargePatient: async (assignmentId, dischargeData) => {
    try {
      const response = await axios.put(`/hospital/assignments/${assignmentId}/discharge`, dischargeData);
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

  // Get hospital doctors
  getHospitalDoctors: async () => {
    try {
      const response = await axios.get('/hospital/doctors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default hospitalService; 