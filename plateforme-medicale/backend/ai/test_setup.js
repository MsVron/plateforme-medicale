#!/usr/bin/env node

/**
 * Google Colab Integration Test Script
 * Tests the AI chatbot integration with Google Colab
 */

// Load environment variables
require('dotenv').config();

const colabService = require('./services/colabService');
const aiManager = require('./services/aiManager');

console.log('🤖 Testing Google Colab AI Integration...\n');

async function testColabIntegration() {
  try {
    // Test 1: Check environment configuration
    console.log('📋 Step 1: Checking Environment Configuration');
    console.log(`   COLAB_ENABLED: ${process.env.COLAB_ENABLED}`);
    console.log(`   COLAB_API_URL: ${process.env.COLAB_API_URL ? 'configured' : 'not configured'}`);
    console.log(`   COLAB_TIMEOUT: ${process.env.COLAB_TIMEOUT || 'default (30000ms)'}`);
    
    if (process.env.COLAB_ENABLED !== 'true') {
      console.log('   ❌ COLAB_ENABLED is not set to true');
      console.log('   💡 Add COLAB_ENABLED=true to your .env file');
      return;
    }
    
    if (!process.env.COLAB_API_URL) {
      console.log('   ❌ COLAB_API_URL is not configured');
      console.log('   💡 Add your ngrok URL to .env file as COLAB_API_URL');
      return;
    }
    
    console.log('   ✅ Environment configuration looks good\n');

    // Test 2: Check Colab service status
    console.log('🔍 Step 2: Testing Colab Service Connection');
    const status = await colabService.getStatus();
    console.log(`   Service Enabled: ${status.enabled}`);
    console.log(`   Service Available: ${status.available}`);
    console.log(`   API URL: ${status.apiUrl}`);
    console.log(`   Model: ${status.model}`);
    
    if (!status.available) {
      console.log('   ❌ Colab service is not available');
      console.log('   💡 Make sure your Google Colab notebook is running');
      console.log('   💡 Verify the ngrok URL is active');
      return;
    }
    
    console.log('   ✅ Colab service is available\n');

    // Test 3: Test connection
    console.log('🌐 Step 3: Testing API Connection');
    const connectionTest = await colabService.testConnection();
    console.log(`   Connection Success: ${connectionTest.success}`);
    console.log(`   Status Code: ${connectionTest.status}`);
    
    if (connectionTest.error) {
      console.log(`   Error: ${connectionTest.error}`);
      return;
    }
    
    console.log('   ✅ API connection successful\n');

    // Test 4: Test AI Manager integration
    console.log('🧠 Step 4: Testing AI Manager Integration');
    const aiStatus = await aiManager.getServiceStatus();
    console.log(`   Primary Service: ${aiStatus.primaryService}`);
    console.log(`   Colab Available: ${aiStatus.available.colab}`);
    
    console.log('   ✅ AI Manager integration working\n');

    // Test 5: Test actual chat functionality
    console.log('💬 Step 5: Testing Chat Functionality');
    const testMessage = "J'ai mal à la tête";
    console.log(`   Sending test message: "${testMessage}"`);
    
    const context = {
      language: 'fr',
      conversationId: 'test_' + Date.now(),
      patientId: 'test_patient'
    };
    
    const response = await aiManager.generateMedicalResponse(testMessage, context);
    console.log(`   Response Service: ${response.service}`);
    console.log(`   Response Length: ${response.response.length} characters`);
    console.log(`   Response Preview: ${response.response.substring(0, 100)}...`);
    
    if (response.service === 'colab') {
      console.log('   ✅ Chat functionality working with Colab');
    } else {
      console.log(`   ⚠️ Chat using fallback service: ${response.service}`);
    }
    
    console.log('\n🎉 Google Colab integration test completed!');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Check if Google Colab notebook is running');
    console.log('   2. Verify ngrok URL is active and correct');
    console.log('   3. Ensure all environment variables are set');
    console.log('   4. Check network connectivity');
  }
}

// Run the test
if (require.main === module) {
  testColabIntegration();
}

module.exports = { testColabIntegration }; 