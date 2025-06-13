const aiConfig = require('../config/aiConfig');
const colabService = require('./colabService');
const performanceOptimizer = require('../utils/performanceOptimizer');

/**
 * AI Service Manager - Google Colab Only
 * Simplified manager that only uses Google Colab (phi3:mini)
 */
class AIManager {
  constructor() {
    this.config = aiConfig;
    this.service = colabService;
  }

  /**
   * Generate medical response using Google Colab only
   */
  async generateMedicalResponse(message, context = {}) {
    const startTime = performanceOptimizer.startTimer();

    // Only use Google Colab - no fallbacks
    if (process.env.COLAB_ENABLED !== 'true') {
      throw new Error('Google Colab service is not enabled. Set COLAB_ENABLED=true in your .env file.');
    }

    try {
      const response = await this.service.generateMedicalResponse(message, context);
      performanceOptimizer.endTimer(startTime, false, false);
      console.log('✅ AI Manager: Using Google Colab (phi3:mini)');
      return {
        response: response.response,
        service: 'colab',
        model: 'phi3:mini',
        confidence: 'high',
        conversationId: response.conversationId
      };
    } catch (error) {
      performanceOptimizer.endTimer(startTime, false, true);
      console.error('❌ Google Colab failed:', error.message);
      throw new Error(`Google Colab service failed: ${error.message}`);
    }
  }

  /**
   * Analyze symptoms with Google Colab only
   */
  async analyzeSymptomsWithAI(symptoms, additionalInfo) {
    if (process.env.COLAB_ENABLED !== 'true') {
      throw new Error('Google Colab service is not enabled. Set COLAB_ENABLED=true in your .env file.');
    }

    try {
      // Use the same generateMedicalResponse method for symptom analysis
      const symptomText = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;
      const message = `Analyze these symptoms: ${symptomText}. Additional info: ${additionalInfo || 'None'}`;
      
      const response = await this.service.generateMedicalResponse(message, {
        type: 'symptom_analysis',
        symptoms: symptoms,
        additionalInfo: additionalInfo
      });
      
      console.log('✅ AI Manager: Google Colab symptom analysis completed');
      return {
        analysis: response.response,
        service: 'colab',
        confidence: 'high'
      };
    } catch (error) {
      console.error('❌ Google Colab symptom analysis failed:', error.message);
      throw new Error(`Google Colab symptom analysis failed: ${error.message}`);
    }
  }

  /**
   * Check if Google Colab service is available
   */
  async getAvailableServices() {
    const services = {};

    // Only check Colab
    if (process.env.COLAB_ENABLED === 'true') {
      try {
        services.colab = await this.service.isAvailable();
      } catch (error) {
        services.colab = false;
      }
    } else {
      services.colab = false;
    }

    return services;
  }

  /**
   * Get Google Colab service status
   */
  async getServiceStatus() {
    const available = await this.getAvailableServices();
    const recommendations = [];

    if (!available.colab) {
      recommendations.push({
        type: 'critical',
        message: 'Google Colab service is not available. Check your COLAB_API_URL and ensure your Colab notebook is running.',
        action: 'setup_colab'
      });
    } else {
      recommendations.push({
        type: 'success',
        message: 'Google Colab (phi3:mini) is available and working perfectly.',
        action: 'none'
      });
    }

    return {
      available,
      recommendations,
      primaryService: available.colab ? 'colab' : 'none'
    };
  }

  /**
   * Apply medical safety filters
   */
  applySafetyFilters(response) {
    let filtered = response;
    
    this.config.medical.safetyFilters.forEach(pattern => {
      filtered = filtered.replace(pattern, '[Consultez un professionnel de santé]');
    });

    return filtered;
  }

  /**
   * Add medical disclaimer if not present
   */
  addMedicalDisclaimer(response) {
    if (!response.includes('professionnel de santé') && !response.includes('médecin')) {
      return response + '\n\n' + this.config.medical.disclaimer;
    }
    return response;
  }

  /**
   * Validate response quality
   */
  validateResponse(response) {
    const length = response.length;
    const minLength = this.config.medical.minResponseLength || 10;
    const maxLength = this.config.medical.maxResponseLength || 500;

    if (length < minLength) {
      throw new Error(`Response too short: ${length} < ${minLength}`);
    }

    if (length > maxLength) {
      console.warn(`Response length (${length}) exceeds maximum (${maxLength})`);
    }

    return true;
  }

  /**
   * Get performance metrics
   */
  getPerformanceReport() {
    return performanceOptimizer.getFormattedReport();
  }

  /**
   * Reset performance metrics
   */
  resetPerformanceMetrics() {
    performanceOptimizer.reset();
  }
}

module.exports = new AIManager(); 