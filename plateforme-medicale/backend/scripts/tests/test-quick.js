const axios = require('axios');

async function quickTest() {
    console.log('🚀 Quick Ollama Performance Test');
    console.log('================================\n');

    // Test direct connection to Ollama
    try {
        console.log('1. Testing Ollama API connection...');
        const response = await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
        console.log('✅ Ollama is responding');
        console.log('Available models:', response.data.models?.map(m => m.name).join(', ') || 'none');
    } catch (error) {
        console.log('❌ Ollama connection failed:', error.message);
        console.log('Make sure Ollama is running: ollama serve');
        return;
    }

    // Test performance with our optimized settings
    console.log('\n2. Testing optimized response generation...');
    
    const testPrompts = [
        "J'ai mal à la tête",
        "J'ai de la fièvre",
        "Je suis fatigué"
    ];

    const results = [];

    for (let i = 0; i < testPrompts.length; i++) {
        const prompt = testPrompts[i];
        console.log(`\nTest ${i + 1}: "${prompt}"`);
        
        try {
            const startTime = Date.now();
            
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: 'mistral:7b',
                prompt: `Medical assistant. Respond in French.

Rules:
- Provide helpful medical info
- Recommend doctor consultation  
- Use clear language
- Be concise

Patient: ${prompt}

Answer: `
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            console.log(`Response time: ${duration}ms`);
            
            results.push(duration);
        } catch (error) {
            console.log('❌ Test failed:', error.message);
            results.push(null);
        }
    }

    console.log('\nTest results:');
    results.forEach((result, index) => {
        if (result !== null) {
            console.log(`Test ${index + 1}: ${result}ms`);
        } else {
            console.log(`Test ${index + 1}: ❌`);
        }
    });

    const averageDuration = results.filter(r => r !== null).reduce((a, b) => a + b, 0) / results.filter(r => r !== null).length;
    console.log(`\nAverage response time: ${averageDuration.toFixed(2)}ms`);
}

quickTest(); 