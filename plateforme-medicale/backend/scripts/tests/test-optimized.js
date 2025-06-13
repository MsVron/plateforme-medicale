// Test the optimized AI service directly
require('dotenv').config();

// Set environment variables for testing
process.env.USE_OLLAMA = 'true';
process.env.OLLAMA_API_URL = 'http://localhost:11434';
process.env.OLLAMA_MODEL = 'mistral:7b';

const aiManager = require('./ai/services/aiManager');

async function testOptimizedService() {
    console.log('🚀 Testing Optimized AI Service');
    console.log('================================\n');

    const testMessages = [
        "J'ai mal à la tête depuis ce matin",
        "J'ai de la fièvre et je tousse",
        "Je me sens fatigué"
    ];

    console.log('🔧 Optimizations active:');
    console.log('• Response caching (10min)');
    console.log('• HTTP connection pooling');
    console.log('• Reduced prompts & tokens');
    console.log('• Optimized model parameters\n');

    const results = [];

    for (let i = 0; i < testMessages.length; i++) {
        const message = testMessages[i];
        console.log(`Test ${i + 1}: "${message}"`);
        
        try {
            const startTime = Date.now();
            
            const response = await aiManager.generateMedicalResponse(message, {
                language: 'fr'
            });
            
            const duration = Date.now() - startTime;
            
            console.log(`✅ Response time: ${duration}ms`);
            console.log(`Response length: ${response.response.length} chars`);
            console.log(`Service used: ${response.service}`);
            
            // Performance evaluation
            if (duration < 2000) {
                console.log('🟢 EXCELLENT - Very fast!');
            } else if (duration < 5000) {
                console.log('🟡 GOOD - Acceptable');
            } else {
                console.log('🔴 SLOW - Needs optimization');
            }
            
            results.push(duration);
            console.log('');
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}\n`);
            results.push(null);
        }
    }

    // Test cache performance
    console.log('🔄 Testing cache performance...');
    console.log('Repeating first query to test caching...');
    
    try {
        const startTime = Date.now();
        const response = await aiManager.generateMedicalResponse(testMessages[0], {
            language: 'fr'
        });
        const duration = Date.now() - startTime;
        
        console.log(`Cache test response time: ${duration}ms`);
        console.log(`Expected: <100ms if cached\n`);
        
    } catch (error) {
        console.log(`❌ Cache test error: ${error.message}\n`);
    }

    // Performance summary
    console.log('📊 Performance Summary');
    console.log('=====================');
    
    const validResults = results.filter(r => r !== null);
    if (validResults.length > 0) {
        const avgTime = validResults.reduce((a, b) => a + b, 0) / validResults.length;
        const fastResponses = validResults.filter(t => t < 2000).length;
        const slowResponses = validResults.filter(t => t > 5000).length;
        
        console.log(`Average response time: ${Math.round(avgTime)}ms`);
        console.log(`Fast responses (<2s): ${fastResponses}/${validResults.length}`);
        console.log(`Slow responses (>5s): ${slowResponses}/${validResults.length}`);
        
        if (avgTime < 2000) {
            console.log('\n🟢 EXCELLENT: Chatbot is highly optimized!');
        } else if (avgTime < 5000) {
            console.log('\n🟡 GOOD: Performance is acceptable');
        } else {
            console.log('\n🔴 SLOW: More optimization needed');
        }
    }

    // Get performance report
    try {
        const report = aiManager.getPerformanceReport();
        console.log('\n📈 Performance Report:');
        console.log(`Cache hit rate: ${report.stats.cacheHitRate}%`);
        console.log(`Total requests: ${report.stats.totalRequests}`);
        console.log(`Error rate: ${report.stats.errorRate}%`);
        
        if (report.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            report.recommendations.forEach(rec => {
                const icon = rec.type === 'critical' ? '🔴' : rec.type === 'warning' ? '🟡' : '🟢';
                console.log(`${icon} ${rec.suggestion}`);
            });
        }
    } catch (error) {
        console.log('Could not get performance report:', error.message);
    }

    console.log('\n✅ Optimization Test Complete!');
    console.log('🎯 Expected improvements: 2-3x faster than before');
}

testOptimizedService().catch(console.error); 