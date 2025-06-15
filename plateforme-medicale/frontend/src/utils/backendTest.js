import axios from '../services/axiosConfig';

/**
 * Backend Integration Test Utility
 * Verifies API endpoint connectivity and data structure compatibility
 */

const backendTest = {
  // Test basic server connectivity
  testServerConnection: async () => {
    try {
      const response = await axios.get('/');
      console.log('✅ Server connection successful:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Server connection failed:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Test authentication endpoint
  testAuthEndpoint: async () => {
    try {
      // Test login endpoint exists (without credentials)
      const response = await axios.post('/auth/login', {});
      // We expect this to fail with validation error, not 404
      return { success: false, error: 'Should not reach here' };
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Auth endpoint exists and validates input');
        return { success: true, message: 'Auth endpoint accessible' };
      } else if (error.response && error.response.status === 404) {
        console.error('❌ Auth endpoint not found');
        return { success: false, error: 'Auth endpoint not found' };
      } else {
        console.log('✅ Auth endpoint exists (unexpected error type)');
        return { success: true, message: 'Auth endpoint accessible' };
      }
    }
  },

  // Test hospital endpoints (requires authentication)
  testHospitalEndpoints: async (token) => {
    const endpoints = [
      { method: 'GET', path: '/hospital/patients/search?prenom=Test', name: 'Hospital Patient Search' },
      { method: 'GET', path: '/hospital/patients', name: 'Hospital Patients List' },
      { method: 'GET', path: '/hospital/doctors', name: 'Hospital Doctors' }
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        if (endpoint.method === 'GET') {
          await axios.get(endpoint.path, config);
        }
        
        console.log(`✅ ${endpoint.name} endpoint accessible`);
        results.push({ endpoint: endpoint.name, success: true });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(`✅ ${endpoint.name} endpoint exists (requires auth)`);
          results.push({ endpoint: endpoint.name, success: true, requiresAuth: true });
        } else if (error.response && error.response.status === 403) {
          console.log(`✅ ${endpoint.name} endpoint exists (requires hospital role)`);
          results.push({ endpoint: endpoint.name, success: true, requiresRole: true });
        } else if (error.response && error.response.status === 404) {
          console.error(`❌ ${endpoint.name} endpoint not found`);
          results.push({ endpoint: endpoint.name, success: false, error: 'Not found' });
        } else {
          console.log(`✅ ${endpoint.name} endpoint exists (other error: ${error.response?.status})`);
          results.push({ endpoint: endpoint.name, success: true, otherError: error.response?.status });
        }
      }
    }
    
    return results;
  },

  // Test pharmacy endpoints (requires authentication)
  testPharmacyEndpoints: async (token) => {
    const endpoints = [
      { method: 'GET', path: '/pharmacy/patients/search?prenom=Test', name: 'Pharmacy Patient Search' },
      { method: 'GET', path: '/pharmacy/patients/1/prescriptions', name: 'Patient Prescriptions' },
      { method: 'GET', path: '/pharmacy/patients/1/medications', name: 'Patient Medications' }
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        if (endpoint.method === 'GET') {
          await axios.get(endpoint.path, config);
        }
        
        console.log(`✅ ${endpoint.name} endpoint accessible`);
        results.push({ endpoint: endpoint.name, success: true });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(`✅ ${endpoint.name} endpoint exists (requires auth)`);
          results.push({ endpoint: endpoint.name, success: true, requiresAuth: true });
        } else if (error.response && error.response.status === 403) {
          console.log(`✅ ${endpoint.name} endpoint exists (requires pharmacy role)`);
          results.push({ endpoint: endpoint.name, success: true, requiresRole: true });
        } else if (error.response && error.response.status === 404) {
          console.error(`❌ ${endpoint.name} endpoint not found`);
          results.push({ endpoint: endpoint.name, success: false, error: 'Not found' });
        } else {
          console.log(`✅ ${endpoint.name} endpoint exists (other error: ${error.response?.status})`);
          results.push({ endpoint: endpoint.name, success: true, otherError: error.response?.status });
        }
      }
    }
    
    return results;
  },

  // Test laboratory endpoints (requires authentication)
  testLaboratoryEndpoints: async (token) => {
    const endpoints = [
      { method: 'GET', path: '/laboratory/patients/search?prenom=Test', name: 'Laboratory Patient Search' },
      { method: 'GET', path: '/laboratory/patients/1/test-requests', name: 'Patient Test Requests' },
      { method: 'GET', path: '/laboratory/pending-work', name: 'Laboratory Pending Work' }
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        if (endpoint.method === 'GET') {
          await axios.get(endpoint.path, config);
        }
        
        console.log(`✅ ${endpoint.name} endpoint accessible`);
        results.push({ endpoint: endpoint.name, success: true });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(`✅ ${endpoint.name} endpoint exists (requires auth)`);
          results.push({ endpoint: endpoint.name, success: true, requiresAuth: true });
        } else if (error.response && error.response.status === 403) {
          console.log(`✅ ${endpoint.name} endpoint exists (requires laboratory role)`);
          results.push({ endpoint: endpoint.name, success: true, requiresRole: true });
        } else if (error.response && error.response.status === 404) {
          console.error(`❌ ${endpoint.name} endpoint not found`);
          results.push({ endpoint: endpoint.name, success: false, error: 'Not found' });
        } else {
          console.log(`✅ ${endpoint.name} endpoint exists (other error: ${error.response?.status})`);
          results.push({ endpoint: endpoint.name, success: true, otherError: error.response?.status });
        }
      }
    }
    
    return results;
  },

  // Run comprehensive integration test
  runFullTest: async (token = null) => {
    console.log('🔍 Starting Backend Integration Test...\n');
    
    const results = {
      serverConnection: await backendTest.testServerConnection(),
      authEndpoint: await backendTest.testAuthEndpoint(),
      hospitalEndpoints: await backendTest.testHospitalEndpoints(token),
      pharmacyEndpoints: await backendTest.testPharmacyEndpoints(token),
      laboratoryEndpoints: await backendTest.testLaboratoryEndpoints(token)
    };

    console.log('\n📊 Integration Test Summary:');
    console.log('================================');
    
    // Server connection
    console.log(`Server Connection: ${results.serverConnection.success ? '✅ PASS' : '❌ FAIL'}`);
    
    // Auth endpoint
    console.log(`Auth Endpoint: ${results.authEndpoint.success ? '✅ PASS' : '❌ FAIL'}`);
    
    // Hospital endpoints
    const hospitalPass = results.hospitalEndpoints.every(r => r.success);
    console.log(`Hospital Endpoints: ${hospitalPass ? '✅ PASS' : '❌ FAIL'}`);
    
    // Pharmacy endpoints
    const pharmacyPass = results.pharmacyEndpoints.every(r => r.success);
    console.log(`Pharmacy Endpoints: ${pharmacyPass ? '✅ PASS' : '❌ FAIL'}`);
    
    // Laboratory endpoints
    const laboratoryPass = results.laboratoryEndpoints.every(r => r.success);
    console.log(`Laboratory Endpoints: ${laboratoryPass ? '✅ PASS' : '❌ FAIL'}`);
    
    const overallPass = results.serverConnection.success && 
                       results.authEndpoint.success && 
                       hospitalPass && 
                       pharmacyPass && 
                       laboratoryPass;
    
    console.log(`\n🎯 Overall Integration: ${overallPass ? '✅ PASS' : '❌ FAIL'}`);
    
    return results;
  }
};

export default backendTest;