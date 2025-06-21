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
  },

  // Bed Management Methods
  getBedStatistics: async () => {
    try {
      const response = await axios.get('/hospital/beds/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBeds: async () => {
    try {
      const response = await axios.get('/hospital/beds');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBed: async (bedData) => {
    try {
      const response = await axios.post('/hospital/beds', bedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBed: async (bedId, bedData) => {
    try {
      const response = await axios.put(`/hospital/beds/${bedId}`, bedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getWards: async () => {
    try {
      const response = await axios.get('/hospital/wards');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Surgery Management Methods
  getSurgeryStatistics: async () => {
    try {
      const response = await axios.get('/hospital/surgeries/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSurgeries: async () => {
    try {
      const response = await axios.get('/hospital/surgeries');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createSurgery: async (surgeryData) => {
    try {
      const response = await axios.post('/hospital/surgeries', surgeryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSurgery: async (surgeryId, surgeryData) => {
    try {
      const response = await axios.put(`/hospital/surgeries/${surgeryId}`, surgeryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOperatingRooms: async () => {
    try {
      const response = await axios.get('/hospital/operating-rooms');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Patient-Bed Assignment Methods
  assignPatientToBed: async (bedId, assignmentData) => {
    try {
      const response = await axios.post(`/hospital/beds/${bedId}/assign`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  transferPatient: async (bedId, transferData) => {
    try {
      const response = await axios.post(`/hospital/beds/${bedId}/transfer`, transferData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Doctor Management Methods
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
  }
};

export default hospitalService; 