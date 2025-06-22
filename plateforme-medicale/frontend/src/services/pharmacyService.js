import axios from './axiosConfig';

const pharmacyService = {
  // Search patients with pharmacy context
  searchPatients: async (searchCriteria) => {
    try {
      const response = await axios.get('/pharmacy/patients/search', {
        params: searchCriteria
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get patient prescriptions
  getPatientPrescriptions: async (patientId) => {
    try {
      const response = await axios.get(`/pharmacy/patients/${patientId}/prescriptions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark medication as dispensed
  dispenseMedication: async (prescriptionMedicationId, medicationData) => {
    try {
      const response = await axios.post(`/pharmacy/prescriptions/${prescriptionMedicationId}/dispense`, medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get patient medication history
  getPatientMedications: async (patientId) => {
    try {
      const response = await axios.get(`/pharmacy/patients/${patientId}/medications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check medication interactions
  checkMedicationInteractions: async (medicationData) => {
    try {
      const response = await axios.post('/pharmacy/medications/check-interactions', medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get pharmacy statistics (mock for now)
  getPharmacyStats: async () => {
    try {
      // This endpoint might not exist yet, return mock data
      return {
        totalPrescriptions: 0,
        dispensedToday: 0,
        pendingPrescriptions: 0,
        totalPatients: 0
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default pharmacyService; 