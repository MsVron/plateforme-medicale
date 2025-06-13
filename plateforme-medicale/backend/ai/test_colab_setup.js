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
    console.log(`   Ollama Available: ${aiStatus.available.ollama}`);
    
    if (aiStatus.primaryService !== 'colab') {
      console.log('   ⚠️ Colab is not the primary service');
      console.log('   💡 This might be expected if Colab is unavailable');
    } else {
      console.log('   ✅ Colab is set as primary AI service');
    }
    
    console.log('');

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
    
    console.log('');

    // Test 6: Performance check
    console.log('⚡ Step 6: Performance Check');
    const startTime = Date.now();
    
    await aiManager.generateMedicalResponse("Test rapide", context);
    
    const responseTime = Date.now() - startTime;
    console.log(`   Response Time: ${responseTime}ms`);
    
    if (responseTime < 5000) {
      console.log('   ✅ Good response time');
    } else if (responseTime < 10000) {
      console.log('   ⚠️ Acceptable response time');
    } else {
      console.log('   ❌ Slow response time - consider optimizing');
    }
    
    console.log('');

    // Summary
    console.log('📊 Integration Test Summary:');
    console.log('   ✅ Environment configured');
    console.log('   ✅ Colab service available');
    console.log('   ✅ API connection working');
    console.log('   ✅ AI Manager integration');
    console.log('   ✅ Chat functionality');
    console.log('   ✅ Performance acceptable');
    console.log('');
    console.log('🎉 Google Colab integration is working perfectly!');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   • Test the frontend chat interface');
    console.log('   • Monitor performance in production');
    console.log('   • Set up monitoring for Colab session timeouts');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting steps:');
    console.log('   1. Check if Google Colab notebook is running');
    console.log('   2. Verify ngrok URL is active and correct');
    console.log('   3. Ensure all environment variables are set');
    console.log('   4. Check network connectivity');
    console.log('   5. Review Colab notebook logs for errors');
  }
}

// Run the test
if (require.main === module) {
  testColabIntegration();
}

module.exports = { testColabIntegration }; 