const axios = require('axios');
const performanceOptimizer = require('../utils/performanceOptimizer');

/**
 * Google Colab AI Service
 * Integrates with phi3:mini model running on Google Colab
 */
class ColabService {
  constructor() {
    this.apiUrl = process.env.COLAB_API_URL || null;
    this.timeout = parseInt(process.env.COLAB_TIMEOUT) || 30000;
    this.enabled = process.env.COLAB_ENABLED === 'true' && this.apiUrl;
    this.maxRetries = 2;
    
    if (this.enabled) {
      this.axiosInstance = axios.create({
        baseURL: this.apiUrl,
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Medical-Chatbot/1.0'
        }
      });
      
      console.log(`🚀 Colab Service initialized: ${this.apiUrl}`);
    } else {
      console.log('⚠️ Colab Service disabled - missing COLAB_API_URL or COLAB_ENABLED=false');
    }
  }

  /**
   * Check if Colab service is available
   */
  async isAvailable() {
    if (!this.enabled) return false;
    
    try {
      const response = await this.axiosInstance.get('/', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('Colab service unavailable:', error.message);
      return false;
    }
  }

  /**
   * Test connection to Colab API
   */
  async testConnection() {
    try {
      const response = await this.axiosInstance.get('/');
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status || 'unknown'
      };
    }
  }

  /**
   * Generate medical response using Colab phi3:mini
   */
  async generateMedicalResponse(message, context = {}) {
    if (!this.enabled) {
      throw new Error('Colab service not enabled');
    }

    const startTime = performanceOptimizer.startTimer();
    
    try {
      // Prepare request payload
      const payload = {
        message: message,
        conversation_id: context.conversationId || this.generateConversationId(),
        patient_id: context.patientId || 'default_patient',
        language: context.language || 'fr'
      };

      // Add conversation history if available
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        payload.conversation_history = context.conversationHistory;
      }

      console.log(`🤖 Sending request to Colab API: ${message.substring(0, 50)}...`);
      
      // Send request to Colab API
      const response = await this.axiosInstance.post('/chat', payload);
      
      if (response.data && response.data.status === 'success') {
        const aiResponse = response.data.response;
        
        // Apply safety filters and enhancements
        const enhancedResponse = this.enhanceResponse(aiResponse, context);
        
        performanceOptimizer.endTimer(startTime, false, false);
        
        console.log(`✅ Colab API response received (${aiResponse.length} chars)`);
        
        return {
          response: enhancedResponse,
          conversationId: response.data.conversation_id,
          service: 'colab',
          model: 'phi3:mini',
          timestamp: response.data.timestamp
        };
      } else {
        throw new Error('Invalid response from Colab API');
      }
      
    } catch (error) {
      performanceOptimizer.endTimer(startTime, false, true);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Colab API timeout after ${this.timeout}ms`);
      } else if (error.response) {
        throw new Error(`Colab API error (${error.response.status}): ${error.response.data?.detail || error.message}`);
      } else {
        throw new Error(`Colab connection error: ${error.message}`);
      }
    }
  }

  /**
   * Get conversation history from Colab
   */
  async getConversationHistory(conversationId, patientId = 'default_patient') {
    if (!this.enabled) {
      throw new Error('Colab service not enabled');
    }

    try {
      const response = await this.axiosInstance.get(`/conversations/${conversationId}`, {
        params: { patient_id: patientId }
      });

      if (response.data) {
        return {
          success: true,
          history: response.data.history || [],
          conversationId: response.data.conversation_id,
          patientId: response.data.patient_id
        };
      } else {
        throw new Error('Invalid history response');
      }
    } catch (error) {
      console.warn('Failed to get conversation history:', error.message);
      return {
        success: false,
        error: error.message,
        history: []
      };
    }
  }

  /**
   * Start new conversation
   */
  async startNewConversation() {
    if (!this.enabled) {
      throw new Error('Colab service not enabled');
    }

    try {
      const response = await this.axiosInstance.post('/reset-conversation');
      
      if (response.data && response.data.conversation_id) {
        return {
          success: true,
          conversationId: response.data.conversation_id,
          message: response.data.message
        };
      } else {
        throw new Error('Failed to create new conversation');
      }
    } catch (error) {
      console.warn('Failed to start new conversation:', error.message);
      return {
        success: false,
        error: error.message,
        conversationId: this.generateConversationId()
      };
    }
  }

  /**
   * Enhance response with medical safety features
   */
  enhanceResponse(response, context = {}) {
    let enhanced = response;

    // Ensure medical disclaimer is present
    if (!this.hasDisclaimer(enhanced)) {
      const disclaimer = context.language === 'ar' 
        ? "\n\n⚠️ **تذكير**: هاد المحادثة غير للمعلومات فقط. **شوف طبيب مختص** لأي مشكل صحي."
        : "\n\n⚠️ **Rappel**: Cette conversation est à titre informatif uniquement. **Consultez un professionnel de santé** pour tout problème médical.";
      
      enhanced += disclaimer;
    }

    // Apply safety filters for harmful content
    enhanced = this.applySafetyFilters(enhanced);

    // Enhance bold formatting for important medical terms
    enhanced = this.enhanceBoldFormatting(enhanced);

    return enhanced;
  }

  /**
   * Check if response has medical disclaimer
   */
  hasDisclaimer(response) {
    const disclaimerPatterns = [
      /professionnel de santé/i,
      /consultez.*médecin/i,
      /طبيب مختص/i,
      /شوف.*طبيب/i
    ];

    return disclaimerPatterns.some(pattern => pattern.test(response));
  }

  /**
   * Apply safety filters to remove harmful content
   */
  applySafetyFilters(response) {
    const harmfulPatterns = [
      /ne consultez pas de médecin/gi,
      /évitez les médecins/gi,
      /les médecins sont inutiles/gi,
      /auto-médication recommandée/gi
    ];

    let filtered = response;
    harmfulPatterns.forEach(pattern => {
      filtered = filtered.replace(pattern, '[Consultez un professionnel de santé]');
    });

    return filtered;
  }

  /**
   * Enhance bold formatting for medical terms
   */
  enhanceBoldFormatting(response) {
    const medicalTerms = [
      'urgent', 'urgence', 'important', 'consultation', 'médecin', 'docteur',
      'symptômes', 'douleur', 'traitement', 'médicament', 'diagnostic',
      'neurologue', 'cardiologue', 'gastro-entérologue', 'dermatologue',
      'gynécologue', 'urologue', 'pneumologue', 'rhumatologue',
      'endocrinologue', 'psychiatre', 'psychologue', 'orl', 'ophtalmologue',
      '24h', '48h', '72h', 'heures', 'jours', 'semaines'
    ];

    let enhanced = response;
    
    medicalTerms.forEach(term => {
      // Only bold if not already bolded
      const regex = new RegExp(`(?<!\\*\\*)\\b${term}\\b(?!\\*\\*)`, 'gi');
      enhanced = enhanced.replace(regex, `**${term}**`);
    });

    return enhanced;
  }

  /**
   * Generate conversation ID
   */
  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get service status and metrics
   */
  async getStatus() {
    const isAvailable = await this.isAvailable();
    
    return {
      enabled: this.enabled,
      available: isAvailable,
      apiUrl: this.apiUrl ? this.apiUrl.replace(/\/+$/, '') : null,
      timeout: this.timeout,
      model: 'phi3:mini',
      service: 'Google Colab',
      lastCheck: new Date().toISOString()
    };
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      service: 'colab',
      model: 'phi3:mini',
      performance: performanceOptimizer.getStats(),
      config: {
        timeout: this.timeout,
        maxRetries: this.maxRetries,
        enabled: this.enabled
      }
    };
  }
}

module.exports = new ColabService(); 