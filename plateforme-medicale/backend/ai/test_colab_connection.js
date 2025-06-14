require('dotenv').config();
const axios = require('axios');

async function testColabConnection() {
  console.log('🔍 Testing Colab Connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`   COLAB_ENABLED: ${process.env.COLAB_ENABLED}`);
  console.log(`   COLAB_API_URL: ${process.env.COLAB_API_URL}`);
  console.log(`   COLAB_TIMEOUT: ${process.env.COLAB_TIMEOUT || 'default'}\n`);
  
  if (!process.env.COLAB_API_URL) {
    console.log('❌ COLAB_API_URL not found in .env file');
    return;
  }
  
  const apiUrl = process.env.COLAB_API_URL;
  
  try {
    console.log('🌐 Testing basic connectivity...');
    
    // Test 1: Basic health check
    console.log(`   Testing: ${apiUrl}/`);
    const healthResponse = await axios.get(`${apiUrl}/`, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Medical-Chatbot-Test/1.0'
      }
    });
    
    console.log(`   ✅ Health check successful (${healthResponse.status})`);
    console.log(`   Response: ${JSON.stringify(healthResponse.data)}\n`);
    
    // Test 2: Chat endpoint
    console.log('💬 Testing chat endpoint...');
    console.log(`   Testing: ${apiUrl}/chat`);
    
    const chatPayload = {
      message: "Test de connexion",
      conversation_id: "test_" + Date.now(),
      patient_id: "test_patient",
      language: "fr"
    };
    
    const chatResponse = await axios.post(`${apiUrl}/chat`, chatPayload, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Medical-Chatbot-Test/1.0'
      }
    });
    
    console.log(`   ✅ Chat endpoint successful (${chatResponse.status})`);
    console.log(`   Response length: ${chatResponse.data.response?.length || 0} chars`);
    console.log(`   Service: ${chatResponse.data.service || 'unknown'}\n`);
    
    console.log('🎉 All tests passed! Colab API is working correctly.');
    
  } catch (error) {
    console.log('❌ Connection test failed:');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Status Text: ${error.response.statusText}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      
      if (error.response.status === 404) {
        console.log('\n💡 404 Error Solutions:');
        console.log('   1. Check if your Google Colab notebook is still running');
        console.log('   2. Verify the ngrok URL is correct and active');
        console.log('   3. The ngrok URL might have changed - get a new one from Colab');
        console.log('   4. Make sure the FastAPI server is running in Colab');
      }
      
    } else if (error.code === 'ECONNABORTED') {
      console.log('   Error: Request timeout');
      console.log('\n💡 Timeout Solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify Colab notebook is responsive');
      console.log('   3. Try increasing COLAB_TIMEOUT in .env');
      
    } else {
      console.log(`   Error: ${error.message}`);
      console.log('\n💡 General Solutions:');
      console.log('   1. Ensure Google Colab notebook is running');
      console.log('   2. Check if ngrok tunnel is active');
      console.log('   3. Verify network connectivity');
    }
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Go to your Google Colab notebook');
    console.log('   2. Check if it\'s still running (look for the green checkmarks)');
    console.log('   3. If stopped, re-run the main setup cell');
    console.log('   4. Copy the new ngrok URL to your .env file');
    console.log('   5. Restart your backend server');
  }
}

// Run the test
testColabConnection(); 