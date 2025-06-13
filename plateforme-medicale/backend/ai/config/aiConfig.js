/**
 * AI Configuration for Medical Assistant
 * Optimized for ultra-low VRAM systems (128MB) with phi3:mini
 */

module.exports = {
  // Ollama Configuration (Local AI - Ultra-optimized for low VRAM)
  ollama: {
    enabled: process.env.USE_OLLAMA === 'true',
    apiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'phi3:mini', // Ultra-lightweight 3.8B model for low VRAM
    timeout: 15000, // Reduced for faster failure detection on low-resource systems
    temperature: 0.1, // Lower for more consistent, faster responses
    maxTokens: 150, // Dramatically reduced for speed on low VRAM
    
    // Ultra-performance optimizations for low VRAM
    streamingEnabled: false,
    cacheEnabled: true,
    maxCacheSize: 50, // Reduced cache size for memory efficiency
    cacheTimeout: 300000, // 5 minutes - shorter for memory management
    
    // Model-specific optimizations for phi3:mini on low VRAM
    modelOptions: {
      num_predict: 150,   // Very small prediction window
      num_ctx: 512,       // Minimal context window for VRAM efficiency
      num_thread: 2,      // Conservative threading for low-end systems
      repeat_penalty: 1.1,
      top_k: 10,          // Very limited choices for maximum speed
      top_p: 0.6,         // Aggressive pruning for speed
      num_gpu: 0,         // Force CPU-only mode for 128MB VRAM
      low_vram: true,     // Enable low VRAM mode if supported
      f16_kv: false,      // Use lower precision for memory efficiency
      no_mmap: true       // Disable memory mapping for low VRAM
    }
  },

  // Alternative Free AI Services (Optimized timeouts)
  alternativeAI: {
    services: [
      {
        name: 'Groq',
        enabled: !!process.env.GROQ_API_KEY,
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama3-8b-8192',
        apiKey: process.env.GROQ_API_KEY,
        timeout: 10000, // Reduced for faster responses
        maxTokens: 300,
        temperature: 0.2
      },
      {
        name: 'Together AI',
        enabled: !!process.env.TOGETHER_API_KEY,
        url: 'https://api.together.xyz/v1/chat/completions',
        model: 'meta-llama/Llama-2-7b-chat-hf',
        apiKey: process.env.TOGETHER_API_KEY,
        timeout: 12000,
        maxTokens: 300,
        temperature: 0.2
      },
      {
        name: 'Perplexity',
        enabled: !!process.env.PERPLEXITY_API_KEY,
        url: 'https://api.perplexity.ai/chat/completions',
        model: 'llama-3.1-sonar-small-128k-online',
        apiKey: process.env.PERPLEXITY_API_KEY,
        timeout: 15000,
        maxTokens: 300,
        temperature: 0.2
      }
    ]
  },

  // Legacy AI Services (Optimized for speed)
  legacy: {
    openai: {
      enabled: !!process.env.OPENAI_API_KEY,
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      timeout: 8000, // Reduced timeout
      maxTokens: 300,
      temperature: 0.2
    },
    huggingface: {
      enabled: !!process.env.HUGGINGFACE_API_KEY,
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: 'microsoft/DialoGPT-medium',
      timeout: 6000, // Reduced timeout
      maxTokens: 200 // Smaller for this service
    }
  },

  // General performance settings
  performance: {
    enableCaching: true,
    cacheTimeout: 600000, // 10 minutes
    maxCacheSize: 100,
    enableCompression: true,
    connectionPooling: true,
    maxRetries: 2, // Reduced from 3
    retryDelay: 1000,
    
    // Response optimization
    maxResponseLength: 300,
    truncateLongResponses: true,
    enableResponseFiltering: true
  },

  // Medical-specific settings
  medical: {
    enableSafetyFilters: true,
    requireDoctorRecommendation: true,
    maxConversationHistory: 3, // Reduced for performance
    enableSymptomAnalysis: true,
    maxSuggestions: 3, // Reduced from 5
    
    // Language settings
    defaultLanguage: 'fr',
    supportedLanguages: ['fr', 'ar'],
    enableLanguageDetection: false, // Disabled for performance
    
    // Safety filters for harmful content
    safetyFilters: [
      /take \d+.*pills?/gi,
      /inject.*yourself/gi,
      /perform.*surgery/gi,
      /self.*medicate/gi
    ],
    
    // Emergency symptoms requiring immediate attention
    emergencySymptoms: [
      'chest_pain', 'shortness_of_breath', 'severe_abdominal_pain',
      'loss_of_consciousness', 'severe_bleeding', 'difficulty_breathing',
      'severe_headache', 'high_fever', 'seizure', 'stroke_symptoms'
    ],

    // Default medical disclaimer
    disclaimer: "⚠️ Rappel: Cette information est à titre éducatif. Consultez un professionnel de santé pour un diagnostic et traitement appropriés.",
    
    // Response quality thresholds
    minResponseLength: 20,
    maxResponseLength: 1000,
    confidenceThreshold: 0.7
  },

  // Fallback behavior
  fallback: {
    useRuleBasedResponse: true,
    enableIntelligentFallback: true,
    logFailures: true
  }
}; 