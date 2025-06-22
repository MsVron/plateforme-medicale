import axios from './axiosConfig';

const laboratoryService = {
  // Search patients with laboratory context
  searchPatients: async (searchCriteria) => {
    try {
      const response = await axios.get('/laboratory/patients/search', {
        params: searchCriteria
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get patient test requests
  getPatientTestRequests: async (patientId) => {
    try {
      const response = await axios.get(`/laboratory/patients/${patientId}/test-requests`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get pending work queue
  getPendingWork: async () => {
    try {
      const response = await axios.get('/laboratory/pending-work');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload test results
  uploadTestResults: async (testRequestId, resultsData) => {
    try {
      const response = await axios.put(`/laboratory/test-requests/${testRequestId}/results`, resultsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload imaging results
  uploadImagingResults: async (imagingRequestId, resultsData) => {
    try {
      const response = await axios.put(`/laboratory/imaging-requests/${imagingRequestId}/results`, resultsData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload imaging files
  uploadImagingFiles: async (imagingRequestId, files) => {
    try {
      const formData = new FormData();
      
      // Add files to FormData
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
      }

      const response = await axios.post(
        `/laboratory/imaging-requests/${imagingRequestId}/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Accept test request
  acceptTestRequest: async (testRequestId, assignmentData) => {
    try {
      const response = await axios.post(`/laboratory/test-requests/${testRequestId}/accept`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Accept imaging request
  acceptImagingRequest: async (imagingRequestId, assignmentData) => {
    try {
      const response = await axios.post(`/laboratory/imaging-requests/${imagingRequestId}/accept`, assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get laboratory statistics (mock for now)
  getLaboratoryStats: async () => {
    try {
      // This endpoint might not exist yet, return mock data
      return {
        totalTestRequests: 0,
        completedToday: 0,
        pendingTests: 0,
        totalPatients: 0
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default laboratoryService; 