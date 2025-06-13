#!/usr/bin/env node

/**
 * Phi3:Mini Performance Test for Ultra-Low VRAM Systems
 * Tests the phi3:mini model optimized for 128MB VRAM
 */

// Set environment variables for phi3:mini testing
process.env.USE_OLLAMA = 'true';
process.env.OLLAMA_API_URL = 'http://localhost:11434';
process.env.OLLAMA_MODEL = 'phi3:mini';

const axios = require('axios');
const aiManager = require('./ai/services/aiManager');
const performanceOptimizer = require('./ai/utils/performanceOptimizer');

async function testPhi3Mini() {
    console.log('🚀 Testing Phi3:Mini for Ultra-Low VRAM System (128MB)');
    console.log('====================================================\n');

    console.log('🔧 System Optimizations:');
    console.log('• Model: phi3:mini (3.8B parameters)');
    console.log('• VRAM Mode: CPU-only (num_gpu=0)');
    console.log('• Memory: Low VRAM optimizations enabled');
    console.log('• Context: Minimal (512 tokens)');
    console.log('• Tokens: Ultra-reduced (150 max)');
    console.log('• Threads: Conservative (2 threads)\n');

    // Test 1: Check if Ollama is running
    console.log('1️⃣ Checking Ollama Service...');
    try {
        const response = await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
        console.log('   ✅ Ollama service is running');
        
        const models = response.data.models || [];
        const phi3Model = models.find(m => m.name.includes('phi3'));
        
        if (phi3Model) {
            console.log(`   ✅ phi3:mini model found: ${phi3Model.name}`);
            console.log(`   📊 Model size: ${(phi3Model.size / 1024 / 1024 / 1024).toFixed(1)} GB`);
        } else {
            console.log('   ⚠️ phi3:mini model not found. Installing...');
            console.log('   💡 Run: ollama pull phi3:mini');
            return;
        }
    } catch (error) {
        console.log('   ❌ Ollama service not available');
        console.log('   💡 Start Ollama: ollama serve');
        return;
    }

    // Test 2: Performance benchmark with medical questions
    console.log('\n2️⃣ Performance Benchmark...');
    
    const testQuestions = [
        "J'ai mal à la tête",
        "Je tousse depuis 3 jours",
        "J'ai de la fièvre",
        "Je me sens fatigué",
        "J'ai mal au ventre"
    ];

    const results = [];
    
    for (let i = 0; i < testQuestions.length; i++) {
        const question = testQuestions[i];
        console.log(`\n   Test ${i + 1}/5: "${question}"`);
        
        const startTime = Date.now();
        
        try {
            const response = await aiManager.generateMedicalResponse(question, {
                conversationHistory: [],
                language: 'fr'
            });
            
            const responseTime = Date.now() - startTime;
            results.push({
                question,
                responseTime,
                success: true,
                responseLength: response.response?.length || 0
            });
            
            console.log(`   ⏱️ Response time: ${responseTime}ms`);
            console.log(`   📝 Response length: ${response.response?.length || 0} chars`);
            console.log(`   ✅ Success`);
            
            // Show first 100 chars of response
            if (response.response) {
                const preview = response.response.substring(0, 100) + '...';
                console.log(`   💬 Preview: "${preview}"`);
            }
            
        } catch (error) {
            const responseTime = Date.now() - startTime;
            results.push({
                question,
                responseTime,
                success: false,
                error: error.message
            });
            
            console.log(`   ⏱️ Failed after: ${responseTime}ms`);
            console.log(`   ❌ Error: ${error.message}`);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test 3: Performance Analysis
    console.log('\n3️⃣ Performance Analysis...');
    
    const successfulTests = results.filter(r => r.success);
    const failedTests = results.filter(r => !r.success);
    
    if (successfulTests.length > 0) {
        const avgResponseTime = successfulTests.reduce((sum, r) => sum + r.responseTime, 0) / successfulTests.length;
        const minResponseTime = Math.min(...successfulTests.map(r => r.responseTime));
        const maxResponseTime = Math.max(...successfulTests.map(r => r.responseTime));
        const avgResponseLength = successfulTests.reduce((sum, r) => sum + r.responseLength, 0) / successfulTests.length;
        
        console.log(`   📊 Success Rate: ${successfulTests.length}/${results.length} (${(successfulTests.length/results.length*100).toFixed(1)}%)`);
        console.log(`   ⏱️ Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
        console.log(`   🚀 Fastest Response: ${minResponseTime}ms`);
        console.log(`   🐌 Slowest Response: ${maxResponseTime}ms`);
        console.log(`   📝 Average Response Length: ${avgResponseLength.toFixed(0)} chars`);
        
        // Performance rating
        if (avgResponseTime < 2000) {
            console.log('   🎯 Performance Rating: EXCELLENT for 128MB VRAM! 🌟');
        } else if (avgResponseTime < 4000) {
            console.log('   🎯 Performance Rating: GOOD for your system! ✅');
        } else if (avgResponseTime < 8000) {
            console.log('   🎯 Performance Rating: ACCEPTABLE, but could be optimized 📈');
        } else {
            console.log('   🎯 Performance Rating: SLOW, needs optimization ⚡');
        }
        
    } else {
        console.log('   ❌ All tests failed');
    }
    
    if (failedTests.length > 0) {
        console.log(`   ⚠️ Failed Tests: ${failedTests.length}`);
        failedTests.forEach((test, i) => {
            console.log(`     ${i + 1}. "${test.question}" - ${test.error}`);
        });
    }

    // Test 4: Memory Usage Recommendations
    console.log('\n4️⃣ Memory Usage Recommendations for 128MB VRAM...');
    
    console.log('   🔧 Current Optimizations:');
    console.log('   • CPU-only processing (no GPU acceleration)');
    console.log('   • Ultra-small context window (512 tokens)');
    console.log('   • Minimal token generation (150 max)');
    console.log('   • Conservative threading (2 threads)');
    console.log('   • Low precision calculations');
    console.log('   • Memory mapping disabled');
    
    console.log('\n   💡 Additional Tips for 128MB VRAM:');
    console.log('   • Close all other applications while using AI');
    console.log('   • Use shorter, specific questions');
    console.log('   • Avoid long conversation histories');
    console.log('   • Consider upgrading to 4GB+ VRAM for better performance');
    console.log('   • phi3:mini is optimal for your current setup');

    // Test 5: Quick Response Test
    console.log('\n5️⃣ Quick Response Test (Simple Question)...');
    
    try {
        const startTime = Date.now();
        const simpleResponse = await aiManager.generateMedicalResponse("Bonjour", {
            conversationHistory: [],
            language: 'fr'
        });
        const responseTime = Date.now() - startTime;
        
        console.log(`   ⏱️ Simple greeting response time: ${responseTime}ms`);
        console.log(`   💬 Response: "${simpleResponse.response?.substring(0, 150)}..."`);
        
        if (responseTime < 3000) {
            console.log('   ✅ Quick responses working well!');
        } else {
            console.log('   ⚠️ Responses are slow, consider further optimization');
        }
        
    } catch (error) {
        console.log(`   ❌ Simple test failed: ${error.message}`);
    }

    console.log('\n✅ Phi3:Mini test completed!');
    console.log('📊 This model is specifically optimized for your 128MB VRAM system.');
    console.log('🚀 You should see much faster responses compared to larger models!');
}

// Run the test
testPhi3Mini().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
}); 