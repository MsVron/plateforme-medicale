import axios from './axiosConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Service for handling doctor-related API calls
 */
export const doctorService = {
  /**
   * Fetch all doctors including inactive ones if specified
   * @param {boolean} includeInactive - Whether to include inactive doctors
   * @returns {Promise} - Promise with doctors data
   */
  getAllDoctors: async (includeInactive = true) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${API_URL}/medecins?includeInactive=${includeInactive}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.medecins;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  /**
   * Fetch all medical specialties
   * @returns {Promise} - Promise with specialties data
   */
  getSpecialties: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/specialites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.specialites;
    } catch (error) {
      console.error('Error fetching specialties:', error);
      throw error;
    }
  },

  /**
   * Fetch all institutions
   * @returns {Promise} - Promise with institutions data
   */
  getInstitutions: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/institutions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.institutions;
    } catch (error) {
      console.error('Error fetching institutions:', error);
      throw error;
    }
  },

  /**
   * Create a new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Promise} - Promise with created doctor data
   */
  createDoctor: async (doctorData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_URL}/medecins`, doctorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  },

  /**
   * Update an existing doctor
   * @param {number} doctorId - Doctor ID
   * @param {Object} doctorData - Updated doctor data
   * @returns {Promise} - Promise with updated doctor data
   */
  updateDoctor: async (doctorId, doctorData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/medecins/${doctorId}`, doctorData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  },

  /**
   * Delete a doctor
   * @param {number} doctorId - Doctor ID
   * @returns {Promise} - Promise with deletion status
   */
  deleteDoctor: async (doctorId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${API_URL}/medecins/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  },

  // Imaging notes management
  addImagingNote: async (imagingResultId, noteData) => {
    try {
      const response = await axios.post(`/medecin/imaging-results/${imagingResultId}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getImagingNotes: async (imagingResultId) => {
    try {
      const response = await axios.get(`/medecin/imaging-results/${imagingResultId}/notes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateImagingNote: async (imagingResultId, noteId, noteData) => {
    try {
      const response = await axios.put(`/medecin/imaging-results/${imagingResultId}/notes/${noteId}`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteImagingNote: async (imagingResultId, noteId) => {
    try {
      const response = await axios.delete(`/medecin/imaging-results/${imagingResultId}/notes/${noteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Imaging requests management
  requestImaging: async (patientId, requestData) => {
    try {
      const response = await axios.post(`/medecin/patients/${patientId}/imaging-requests`, requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getImagingTypes: async () => {
    try {
      const response = await axios.get('/medecin/imaging-types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateImagingRequest: async (patientId, requestId, requestData) => {
    try {
      const response = await axios.put(`/medecin/patients/${patientId}/imaging-requests/${requestId}`, requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default doctorService; 