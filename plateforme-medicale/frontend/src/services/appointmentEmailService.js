import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const appointmentEmailAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Appointment Email Service
export const appointmentEmailService = {
  /**
   * Confirm appointment via email token
   * @param {string} token - Confirmation token
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  confirmAppointment: async (token, appointmentId) => {
    try {
      const response = await appointmentEmailAPI.get('/appointments/confirm', {
        params: { token, id: appointmentId }
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la confirmation du rendez-vous',
        status: error.response?.status || 500
      };
    }
  },

  /**
   * Cancel appointment via email token
   * @param {string} token - Cancellation token
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  cancelAppointment: async (token, appointmentId) => {
    try {
      const response = await appointmentEmailAPI.get('/appointments/cancel', {
        params: { token, id: appointmentId }
      });
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de l\'annulation du rendez-vous',
        status: error.response?.status || 500
      };
    }
  },

  /**
   * Check reminder service status
   * @returns {Promise} API response
   */
  getReminderServiceStatus: async () => {
    try {
      const response = await appointmentEmailAPI.get('/appointment-reminders/status');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors de la vérification du service de rappels',
        status: error.response?.status || 500
      };
    }
  },

  /**
   * Manually trigger reminder check
   * @returns {Promise} API response
   */
  triggerReminderCheck: async () => {
    try {
      const response = await appointmentEmailAPI.post('/appointment-reminders/check');
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || 'Erreur lors du déclenchement des rappels',
        status: error.response?.status || 500
      };
    }
  }
};

export default appointmentEmailService; 