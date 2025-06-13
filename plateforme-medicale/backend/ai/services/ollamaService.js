const axios = require('axios');

class OllamaService {
  constructor() {
    this.apiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'phi3:mini';
    this.isEnabled = process.env.USE_OLLAMA === 'true';
    
    // Performance optimizations
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000, // Reduced from 60000
      headers: {
        'Content-Type': 'application/json',
        'Keep-Alive': 'timeout=5, max=1000'
      },
      maxRedirects: 0,
      httpAgent: new (require('http').Agent)({ 
        keepAlive: true,
        maxSockets: 5
      })
    });
    
    // Response cache for common queries
    this.responseCache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    
    // Conversation context optimization
    this.maxHistoryLength = 3; // Limit conversation history for speed
  }

  async isAvailable() {
    if (!this.isEnabled) return false;
    
    try {
      const response = await this.axiosInstance.get('/api/tags', { timeout: 2000 }); // Reduced timeout
      return response.status === 200;
    } catch (error) {
      console.warn('Ollama not available:', error.message);
      return false;
    }
  }

  async generateMedicalResponse(userMessage, context = {}) {
    if (!await this.isAvailable()) {
      throw new Error('Ollama service not available');
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(userMessage, context);
    const cachedResponse = this.getCachedResponse(cacheKey);
    if (cachedResponse) {
      console.log('🚀 Returning cached response');
      return cachedResponse;
    }

    const conversationPrompt = this.buildOptimizedConversationPrompt(userMessage, context);

    try {
      const response = await this.axiosInstance.post('/api/generate', {
        model: this.model,
        prompt: conversationPrompt,
        stream: false,
        options: {
          temperature: 0.1, // Very low for consistent, fast responses
          top_p: 0.6,       // Aggressive pruning for maximum speed
          top_k: 10,        // Very limited choices for speed
          repeat_penalty: 1.1,
          num_predict: 150, // Dramatically reduced for low VRAM
          num_ctx: 512,     // Minimal context window for VRAM efficiency
          num_thread: 2,    // Conservative threading for low-end systems
          num_gpu: 0,       // Force CPU-only mode for 128MB VRAM
          low_vram: true,   // Enable low VRAM mode
          f16_kv: false,    // Use lower precision for memory efficiency
          no_mmap: true     // Disable memory mapping for low VRAM
        }
      });

      if (response.data && response.data.response) {
        const formattedResponse = this.formatMedicalResponse(response.data.response, context);
        
        // Cache the response
        this.cacheResponse(cacheKey, formattedResponse);
        
        return formattedResponse;
      }
      
      throw new Error('Invalid response from Ollama');
    } catch (error) {
      console.error('Ollama API error:', error.message);
      throw error;
    }
  }

  generateCacheKey(message, context) {
    const contextKey = JSON.stringify({
      language: context.language,
      hasHistory: !!(context.conversationHistory && context.conversationHistory.length > 0)
    });
    return `${message.toLowerCase().slice(0, 50)}_${contextKey}`;
  }

  getCachedResponse(key) {
    const cached = this.responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.response;
    }
    if (cached) {
      this.responseCache.delete(key);
    }
    return null;
  }

  cacheResponse(key, response) {
    // Limit cache size
    if (this.responseCache.size > 100) {
      const firstKey = this.responseCache.keys().next().value;
      this.responseCache.delete(firstKey);
    }
    
    this.responseCache.set(key, {
      response,
      timestamp: Date.now()
    });
  }

  buildOptimizedMedicalSystemPrompt(language = 'fr') {
    const languageInstruction = language === 'ar' 
      ? 'Respond in Moroccan Arabic (Darija).'
      : 'Respond in French.';
      
    return `Medical assistant. ${languageInstruction}

Rules:
- Provide helpful medical info
- Recommend doctor consultation
- Use clear, empathetic language
- Don't repeat previous questions
- Be concise but thorough

Doctor types: Généraliste, Cardiologue, Neurologue, Gastro-entérologue, Dermatologue, Gynécologue, Urologue, Pneumologue, Rhumatologue, Endocrinologue, Psychiatre, ORL, Ophtalmologue.

Always include doctor recommendation. Keep responses under 200 words.`;
  }

  buildOptimizedConversationPrompt(userMessage, context) {
    const systemPrompt = this.buildOptimizedMedicalSystemPrompt(context.language);
    let prompt = `${systemPrompt}\n\n`;

    // Limit conversation history for performance
    if (context.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory.slice(-this.maxHistoryLength);
      prompt += "Recent conversation:\n";
      recentHistory.forEach((msg) => {
        const role = msg.type === 'user' ? 'Patient' : 'Assistant';
        prompt += `${role}: ${msg.message.slice(0, 100)}\n`; // Truncate long messages
      });
      prompt += "\n";
    }

    prompt += `Patient: ${userMessage}\n\nAssistant:`;
    return prompt;
  }

  formatMedicalResponse(response, context) {
    // Simplified formatting for performance
    let formatted = response.trim();
    
    // Quick harmful content removal
    const harmfulPatterns = [
      /take \d+.*pills?/gi,
      /inject.*yourself/gi,
      /perform.*surgery/gi
    ];
    
    harmfulPatterns.forEach(pattern => {
      formatted = formatted.replace(pattern, '[Consultez un médecin]');
    });

    // Simple bold formatting for key terms
    formatted = formatted.replace(/\b(médecin|docteur|urgences|consultation)\b/gi, '**$1**');
    
    // Add disclaimer if missing
    if (!formatted.includes('professionnel de santé') && !formatted.includes('médecin')) {
      formatted += '\n\n⚠️ Consultez un professionnel de santé.';
    }
    
    return formatted;
  }

  // Simplified and faster symptom analysis
  async analyzeSymptomsWithAI(symptoms, additionalInfo) {
    const symptomText = symptoms.join(', ');
    const prompt = `Symptoms: ${symptomText}${additionalInfo ? `. Info: ${additionalInfo}` : ''}

Provide 3 possible conditions with percentages and brief explanations. Be concise.`;

    try {
      const response = await this.generateMedicalResponse(prompt);
      return this.parseAIAnalysis(response, symptoms);
    } catch (error) {
      console.error('AI symptom analysis failed:', error);
      throw error;
    }
  }

  parseAIAnalysis(aiResponse, originalSymptoms) {
    const suggestions = [];
    const lines = aiResponse.split('\n');
    
    let currentCondition = null;
    let currentProbability = null;
    let currentDescription = '';
    
    for (const line of lines) {
      const conditionMatch = line.match(/(\d+)%.*?([A-Za-zÀ-ÿ\s]+)/);
      if (conditionMatch) {
        if (currentCondition) {
          suggestions.push({
            condition: currentCondition,
            probability: currentProbability,
            description: currentDescription.trim(),
            matchingSymptoms: originalSymptoms,
            severity: currentProbability > 70 ? 'high' : currentProbability > 40 ? 'medium' : 'low',
            source: 'ai_ollama'
          });
        }
        
        currentProbability = parseInt(conditionMatch[1]);
        currentCondition = conditionMatch[2].trim();
        currentDescription = '';
      } else if (currentCondition && line.trim()) {
        currentDescription += line.trim() + ' ';
      }
    }
    
    if (currentCondition) {
      suggestions.push({
        condition: currentCondition,
        probability: currentProbability,
        description: currentDescription.trim(),
        matchingSymptoms: originalSymptoms,
        severity: currentProbability > 70 ? 'high' : currentProbability > 40 ? 'medium' : 'low',
        source: 'ai_ollama'
      });
    }
    
    return {
      suggestions: suggestions.slice(0, 3), // Reduced from 5 for speed
      fullAnalysis: aiResponse,
      confidence: 'high'
    };
  }

  // Method to clear cache if needed
  clearCache() {
    this.responseCache.clear();
    console.log('Response cache cleared');
  }

  // Method to get cache statistics
  getCacheStats() {
    return {
      size: this.responseCache.size,
      maxSize: 100,
      timeout: this.cacheTimeout / 1000 / 60 + ' minutes'
    };
  }
}

module.exports = new OllamaService();