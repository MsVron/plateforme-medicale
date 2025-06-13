#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

async function testColabDirectly() {
  const apiUrl = process.env.COLAB_API_URL;
  console.log('🔍 Testing Colab API directly:', apiUrl);
  
  try {
    // Test the exact payload format that Colab expects
    const chatPayload = {
      message: "Bonjour, j'ai mal à la tête",
      conversation_id: "test_" + Date.now(),
      patient_id: "test_patient",
      language: "fr"
    };
    
    console.log('📤 Sending payload:', JSON.stringify(chatPayload, null, 2));
    
    const response = await axios.post(`${apiUrl}/chat`, chatPayload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Medical-Chatbot/1.0'
      },
      timeout: 60000 // Increase timeout
    });
    
    console.log('✅ Success! Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Error Message:', error.message);
    
    if (error.response?.data?.detail) {
      console.error('\n🔍 Detailed Error:', error.response.data.detail);
    }
  }
}

testColabDirectly(); 