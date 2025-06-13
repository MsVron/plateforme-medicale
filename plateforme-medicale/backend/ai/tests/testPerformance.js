/**
 * Performance Testing for Optimized Ollama Chatbot
 * Tests response times and provides optimization recommendations
 */

const aiManager = require('../services/aiManager');
const performanceOptimizer = require('../utils/performanceOptimizer');

// Test queries to measure performance
const testQueries = [
  {
    message: "J'ai mal à la tête depuis ce matin",
    context: { language: 'fr' },
    expected: 'fast'
  },
  {
    message: "J'ai de la fièvre et je tousse",
    context: { language: 'fr' },
    expected: 'fast'
  },
  {
    message: "Je ressens des douleurs dans la poitrine",
    context: { language: 'fr' },
    expected: 'fast'
  },
  {
    message: "J'ai des nausées et des vomissements",
    context: { language: 'fr' },
    expected: 'fast'
  },
  {
    message: "Je me sens très fatigué ces derniers jours",
    context: { language: 'fr' },
    expected: 'fast'
  }
];

async function testPerformance() {
  console.log('🚀 OLLAMA PERFORMANCE OPTIMIZATION TEST');
  console.log('========================================\n');

  // Reset metrics before testing
  aiManager.resetPerformanceMetrics();

  console.log('📋 Test Configuration:');
  console.log('- Model: mistral:7b (optimized)');
  console.log('- Max tokens: 300');
  console.log('- Temperature: 0.2');
  console.log('- Target response time: <2 seconds\n');

  // Test 1: Check if Ollama is available
  console.log('1️⃣ Checking Ollama availability...');
  const services = await aiManager.getAvailableServices();
  
  if (!services.ollama) {
    console.log('❌ Ollama not available. Please ensure:');
    console.log('   - Ollama is installed and running (ollama serve)');
    console.log('   - Model is pulled (ollama pull mistral:7b)');
    console.log('   - USE_OLLAMA=true in .env file\n');
    return;
  }
  
  console.log('✅ Ollama is available and ready\n');

  // Test 2: Run performance tests
  console.log('2️⃣ Running performance tests...\n');
  
  const results = [];
  
  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    const testNumber = i + 1;
    
    console.log(`   Test ${testNumber}/5: "${query.message.substring(0, 30)}..."`);
    
    try {
      const startTime = Date.now();
      const response = await aiManager.generateMedicalResponse(query.message, query.context);
      const responseTime = Date.now() - startTime;
      
      const result = {
        test: testNumber,
        query: query.message,
        responseTime,
        responseLength: response.response.length,
        isFromCache: response.response.includes('🚀'),
        success: true
      };
      
      results.push(result);
      
      const status = responseTime < 2000 ? '🟢 FAST' : responseTime < 5000 ? '🟡 OK' : '🔴 SLOW';
      console.log(`   Response time: ${responseTime}ms ${status}`);
      console.log(`   Response length: ${response.response.length} chars`);
      console.log(`   From cache: ${result.isFromCache ? 'Yes' : 'No'}\n`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      results.push({
        test: testNumber,
        query: query.message,
        error: error.message,
        success: false
      });
    }
  }

  // Test 3: Cache performance test
  console.log('3️⃣ Testing cache performance...\n');
  
  console.log('   Testing repeated query for cache hit...');
  const cacheTestQuery = testQueries[0];
  
  try {
    const startTime = Date.now();
    const response = await aiManager.generateMedicalResponse(cacheTestQuery.message, cacheTestQuery.context);
    const responseTime = Date.now() - startTime;
    
    console.log(`   Cache test response time: ${responseTime}ms`);
    console.log(`   From cache: ${response.response.includes('🚀') ? 'Yes 🚀' : 'No'}\n`);
    
  } catch (error) {
    console.log(`   ❌ Cache test error: ${error.message}\n`);
  }

  // Test 4: Performance analysis
  console.log('4️⃣ Performance Analysis\n');
  
  const performanceReport = aiManager.getPerformanceReport();
  
  console.log('📊 Performance Statistics:');
  console.log(`   Average response time: ${performanceReport.stats.averageResponseTime}ms`);
  console.log(`   Fast responses (<2s): ${performanceReport.stats.fastResponses}`);
  console.log(`   Slow responses (>5s): ${performanceReport.stats.slowResponses}`);
  console.log(`   Cache hit rate: ${performanceReport.stats.cacheHitRate}%`);
  console.log(`   Error rate: ${performanceReport.stats.errorRate}%\n`);

  // Test 5: Recommendations
  console.log('5️⃣ Optimization Recommendations\n');
  
  performanceReport.recommendations.forEach((rec, index) => {
    const icon = rec.type === 'critical' ? '🔴' : rec.type === 'warning' ? '🟡' : '🟢';
    console.log(`   ${icon} ${rec.suggestion}`);
  });
  
  console.log('\n📈 Performance Summary:');
  
  const avgTime = performanceReport.stats.averageResponseTime;
  if (avgTime < 2000) {
    console.log('🟢 EXCELLENT: Your chatbot is highly optimized!');
  } else if (avgTime < 3000) {
    console.log('🟡 GOOD: Performance is acceptable but can be improved');
  } else if (avgTime < 5000) {
    console.log('🟠 MODERATE: Consider implementing recommended optimizations');
  } else {
    console.log('🔴 SLOW: Immediate optimization needed');
  }

  // Test 6: Optimization suggestions
  console.log('\n6️⃣ Quick Optimization Tips\n');
  
  console.log('🔧 Model Optimizations:');
  console.log('   - Use mistral:7b instead of llama3.1:8b (faster)');
  console.log('   - Reduce num_predict from 300 to 200 for shorter responses');
  console.log('   - Set num_ctx to 1024 or lower for smaller context window');
  console.log('   - Use temperature 0.2 for faster, more consistent responses\n');
  
  console.log('⚡ System Optimizations:');
  console.log('   - Ensure Ollama has sufficient RAM allocated');
  console.log('   - Close other resource-intensive applications');
  console.log('   - Use SSD storage for better model loading times');
  console.log('   - Enable caching (already implemented)\n');

  console.log('📝 Environment Optimizations:');
  console.log('   - Set OLLAMA_MODEL=mistral:7b in .env');
  console.log('   - Ensure stable internet connection');
  console.log('   - Monitor system resource usage\n');

  // Test 7: Configuration check
  console.log('7️⃣ Current Configuration Check\n');
  
  const config = performanceReport.optimizedConfig;
  console.log('🔧 Recommended optimal configuration:');
  console.log(`   Model: ${config.ollama.model}`);
  console.log(`   Timeout: ${config.ollama.timeout}ms`);
  console.log(`   Max tokens: ${config.ollama.maxTokens}`);
  console.log(`   Temperature: ${config.ollama.temperature}\n`);

  console.log('✅ Performance test completed!');
  console.log('📊 Use these insights to optimize your chatbot performance.\n');
}

// Export for use in other scripts
module.exports = { testPerformance };

// Run if called directly
if (require.main === module) {
  // Set test environment
  process.env.USE_OLLAMA = 'true';
  process.env.OLLAMA_API_URL = 'http://localhost:11434';
  process.env.OLLAMA_MODEL = 'mistral:7b';
  
  testPerformance().catch(console.error);
} 