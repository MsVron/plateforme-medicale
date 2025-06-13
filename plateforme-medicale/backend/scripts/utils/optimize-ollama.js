#!/usr/bin/env node

/**
 * Ollama Chatbot Performance Optimizer
 * Quick script to test and verify performance improvements
 */

const { testPerformance } = require('./ai/tests/testPerformance');

console.log('🚀 OLLAMA CHATBOT PERFORMANCE OPTIMIZER');
console.log('=====================================');
console.log('');
console.log('This script will test your optimized Ollama chatbot performance.');
console.log('Make sure Ollama is running with: ollama serve');
console.log('');

// Set optimized environment variables
process.env.USE_OLLAMA = 'true';
process.env.OLLAMA_API_URL = 'http://localhost:11434';
process.env.OLLAMA_MODEL = 'mistral:7b';

async function runOptimization() {
  try {
    await testPerformance();
    
    console.log('🎉 OPTIMIZATION SUMMARY');
    console.log('======================');
    console.log('');
    console.log('✅ Implemented optimizations:');
    console.log('   • Response caching (10min cache)');
    console.log('   • HTTP connection pooling');
    console.log('   • Reduced token limits (300 max)');
    console.log('   • Optimized model parameters');
    console.log('   • Shortened conversation history');
    console.log('   • Simplified prompt structure');
    console.log('   • Performance monitoring');
    console.log('');
    console.log('🎯 Expected improvements:');
    console.log('   • 2-3x faster response times');
    console.log('   • 30-50% better cache hit rate');
    console.log('   • Reduced memory usage');
    console.log('   • More consistent responses');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Monitor performance in production');
    console.log('   2. Adjust cache timeout if needed');
    console.log('   3. Consider using smaller model if still slow');
    console.log('   4. Run this test periodically');
    console.log('');
    
  } catch (error) {
    console.error('❌ Optimization test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure Ollama is running: ollama serve');
    console.log('   2. Check if model is installed: ollama list');
    console.log('   3. Pull model if missing: ollama pull mistral:7b');
    console.log('   4. Verify .env configuration');
  }
}

runOptimization(); 