require('dotenv').config();
const colabService = require('./services/colabService');

async function testFixedConnection() {
  console.log('🔧 Testing Fixed Colab Connection...\n');
  
  try {
    // Test 1: Service status
    console.log('📊 Testing service status...');
    const status = await colabService.getStatus();
    console.log(`   Enabled: ${status.enabled}`);
    console.log(`   Available: ${status.available}`);
    console.log(`   API URL: ${status.apiUrl}`);
    console.log(`   Timeout: ${status.timeout}ms\n`);
    
    // Test 2: Connection test
    console.log('🌐 Testing connection...');
    const connectionTest = await colabService.testConnection();
    console.log(`   Success: ${connectionTest.success}`);
    console.log(`   Status: ${connectionTest.status}`);
    if (connectionTest.error) {
      console.log(`   Error: ${connectionTest.error}`);
    }
    console.log('');
    
    // Test 3: Actual chat request
    console.log('💬 Testing chat request...');
    const response = await colabService.generateMedicalResponse(
      "Bonjour, j'ai mal à la tête",
      {
        conversationId: 'test_' + Date.now(),
        patientId: 'test_patient',
        language: 'fr'
      }
    );
    
    console.log(`   ✅ Chat request successful!`);
    console.log(`   Service: ${response.service}`);
    console.log(`   Model: ${response.model}`);
    console.log(`   Response length: ${response.response.length} chars`);
    console.log(`   Attempt: ${response.attempt || 1}`);
    console.log(`   Preview: ${response.response.substring(0, 100)}...\n`);
    
    console.log('🎉 All tests passed! The fix is working correctly.');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your backend server');
    console.log('   2. Test the chatbot in your browser');
    console.log('   3. The 404 error should be resolved');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    
    if (error.message.includes('404')) {
      console.log('\n🔧 404 Error still occurring:');
      console.log('   1. Make sure your Colab notebook is running');
      console.log('   2. Check if the ngrok URL has changed');
      console.log('   3. Verify the FastAPI server is active in Colab');
      console.log('   4. Try restarting the Colab notebook');
    } else if (error.message.includes('timeout')) {
      console.log('\n⏰ Timeout Error:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify Colab is responsive');
      console.log('   3. The timeout has been increased to 2 minutes');
    }
  }
}

testFixedConnection(); 