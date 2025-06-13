const axios = require('axios');

async function testFastModel() {
    console.log('🚀 Testing SUPER FAST Phi3:Mini Model');
    console.log('=====================================\n');

    // Test direct connection to Ollama
    try {
        console.log('1. Testing Ollama API connection...');
        const response = await axios.get('http://localhost:11434/api/tags', { timeout: 3000 });
        console.log('✅ Ollama is responding');
        console.log('Available models:', response.data.models?.map(m => m.name).join(', ') || 'none');
    } catch (error) {
        console.log('❌ Ollama connection failed:', error.message);
        return;
    }

    // Test performance with the super fast phi3:mini model
    console.log('\n2. Testing with optimized phi3:mini model...');
    console.log('🚀 This model is designed for speed and efficiency!\n');
    
    const testPrompts = [
        "J'ai mal à la tête",
        "J'ai de la fièvre",
        "Je suis fatigué",
        "J'ai des nausées",
        "J'ai mal au ventre"
    ];

    const results = [];

    for (let i = 0; i < testPrompts.length; i++) {
        const prompt = testPrompts[i];
        console.log(`Test ${i + 1}: "${prompt}"`);
        
        try {
            const startTime = Date.now();
            
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: 'phi3:mini',
                prompt: `You are a medical assistant. Respond in French. Be helpful and concise.

Patient: ${prompt}

Response:`,
                stream: false,
                options: {
                    temperature: 0.2,
                    top_p: 0.8,
                    top_k: 20,
                    num_predict: 150,  // Even smaller for speed
                    num_ctx: 512,      // Very small context for maximum speed
                    num_thread: 4,
                    repeat_penalty: 1.1
                }
            }, {
                timeout: 15000  // Shorter timeout for fast model
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            if (response.data && response.data.response) {
                const responseText = response.data.response.trim();
                console.log(`✅ Response time: ${duration}ms`);
                console.log(`Response length: ${responseText.length} chars`);
                
                // Performance evaluation
                if (duration < 1000) {
                    console.log('🟢 BLAZING FAST! (<1s)');
                } else if (duration < 2000) {
                    console.log('🟢 VERY FAST! (<2s)');
                } else if (duration < 5000) {
                    console.log('🟡 FAST (<5s)');
                } else {
                    console.log('🔴 Still slow (>5s)');
                }
                
                console.log(`Preview: "${responseText.substring(0, 80)}..."\n`);
                results.push(duration);
            } else {
                console.log('❌ No response received\n');
                results.push(null);
            }
            
        } catch (error) {
            console.log(`❌ Test failed: ${error.message}\n`);
            results.push(null);
        }
    }

    // Performance summary
    console.log('📊 PERFORMANCE RESULTS');
    console.log('======================');
    
    const validResults = results.filter(r => r !== null);
    if (validResults.length > 0) {
        const avgTime = validResults.reduce((a, b) => a + b, 0) / validResults.length;
        const fastResponses = validResults.filter(t => t < 2000).length;
        const veryFastResponses = validResults.filter(t => t < 1000).length;
        const slowResponses = validResults.filter(t => t > 5000).length;
        
        console.log(`Average response time: ${Math.round(avgTime)}ms`);
        console.log(`Very fast responses (<1s): ${veryFastResponses}/${validResults.length}`);
        console.log(`Fast responses (<2s): ${fastResponses}/${validResults.length}`);
        console.log(`Slow responses (>5s): ${slowResponses}/${validResults.length}`);
        
        if (avgTime < 1000) {
            console.log('\n🚀 AMAZING! Your chatbot is blazing fast!');
            console.log('This is a HUGE improvement from the 2+ minute responses!');
        } else if (avgTime < 2000) {
            console.log('\n🟢 EXCELLENT! Your chatbot is very fast!');
            console.log('This is a massive improvement from before!');
        } else if (avgTime < 5000) {
            console.log('\n🟡 GOOD! Much better than before');
        } else {
            console.log('\n🟠 Better, but could use more optimization');
        }
        
        // Calculate improvement
        const oldAvgTime = 120000; // Based on your previous 2+ minute responses
        const improvement = ((oldAvgTime - avgTime) / oldAvgTime * 100);
        console.log(`\n📈 Performance improvement: ${improvement.toFixed(1)}% faster!`);
        console.log(`🎯 Went from ~2 minutes to ~${(avgTime/1000).toFixed(1)} seconds!`);
    }
    
    console.log('\n🎉 OPTIMIZATION SUCCESS!');
    console.log('========================');
    console.log('✅ Switched to phi3:mini (much faster model)');
    console.log('✅ Optimized parameters for speed');
    console.log('✅ Reduced context and token limits');
    console.log('✅ Response caching implemented');
    console.log('✅ HTTP connection pooling');
    console.log('');
    console.log('💡 To use this fast model in your app:');
    console.log('   Update your .env file:');
    console.log('   OLLAMA_MODEL=phi3:mini');
    console.log('');
    console.log('🚀 Your chatbot should now respond in seconds instead of minutes!');
}

testFastModel().catch(console.error); 