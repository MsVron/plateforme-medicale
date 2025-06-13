/**
 * Performance Optimizer for Ollama Chatbot
 * Monitors and optimizes response times
 */

class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      responseTime: [],
      cacheHitRate: 0,
      errorRate: 0,
      totalRequests: 0,
      cachedResponses: 0,
      errors: 0
    };
    
    this.thresholds = {
      slowResponseTime: 5000, // 5 seconds
      targetResponseTime: 2000, // 2 seconds
      maxCacheSize: 100,
      cacheTimeout: 600000 // 10 minutes
    };
  }

  // Start timing a request
  startTimer() {
    return Date.now();
  }

  // End timing and record metrics
  endTimer(startTime, fromCache = false, error = false) {
    const responseTime = Date.now() - startTime;
    
    this.metrics.totalRequests++;
    this.metrics.responseTime.push(responseTime);
    
    if (fromCache) {
      this.metrics.cachedResponses++;
    }
    
    if (error) {
      this.metrics.errors++;
    }
    
    // Keep only last 100 response times
    if (this.metrics.responseTime.length > 100) {
      this.metrics.responseTime.shift();
    }
    
    this.updateRates();
    
    return {
      responseTime,
      isSlowResponse: responseTime > this.thresholds.slowResponseTime,
      isFastResponse: responseTime < this.thresholds.targetResponseTime
    };
  }

  updateRates() {
    this.metrics.cacheHitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cachedResponses / this.metrics.totalRequests) * 100 
      : 0;
      
    this.metrics.errorRate = this.metrics.totalRequests > 0 
      ? (this.metrics.errors / this.metrics.totalRequests) * 100 
      : 0;
  }

  // Get performance statistics
  getStats() {
    const avgResponseTime = this.metrics.responseTime.length > 0
      ? this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length
      : 0;
      
    const p95ResponseTime = this.getPercentile(this.metrics.responseTime, 95);
    
    return {
      averageResponseTime: Math.round(avgResponseTime),
      p95ResponseTime: Math.round(p95ResponseTime),
      cacheHitRate: Math.round(this.metrics.cacheHitRate * 100) / 100,
      errorRate: Math.round(this.metrics.errorRate * 100) / 100,
      totalRequests: this.metrics.totalRequests,
      fastResponses: this.metrics.responseTime.filter(t => t < this.thresholds.targetResponseTime).length,
      slowResponses: this.metrics.responseTime.filter(t => t > this.thresholds.slowResponseTime).length
    };
  }

  // Get performance recommendations
  getRecommendations() {
    const stats = this.getStats();
    const recommendations = [];

    if (stats.averageResponseTime > this.thresholds.slowResponseTime) {
      recommendations.push({
        type: 'critical',
        issue: 'Slow average response time',
        suggestion: 'Consider using a smaller model (mistral:7b instead of llama3.1:8b) or reducing num_predict parameter',
        impact: 'high'
      });
    }

    if (stats.cacheHitRate < 20) {
      recommendations.push({
        type: 'warning',
        issue: 'Low cache hit rate',
        suggestion: 'Users asking unique questions. Consider expanding cache timeout or implementing semantic caching',
        impact: 'medium'
      });
    }

    if (stats.errorRate > 5) {
      recommendations.push({
        type: 'critical',
        issue: 'High error rate',
        suggestion: 'Check Ollama server status and increase timeout values if needed',
        impact: 'high'
      });
    }

    if (stats.slowResponses > stats.fastResponses) {
      recommendations.push({
        type: 'warning',
        issue: 'More slow responses than fast ones',
        suggestion: 'Optimize model parameters: reduce num_ctx, num_predict, or switch to faster model',
        impact: 'medium'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        issue: 'Good performance',
        suggestion: 'Performance is within acceptable limits',
        impact: 'none'
      });
    }

    return recommendations;
  }

  // Generate optimization config based on performance
  generateOptimizedConfig() {
    const stats = this.getStats();
    const config = {
      ollama: {
        model: 'phi3:mini', // Ultra-lightweight model for low VRAM
        timeout: 15000,
        temperature: 0.1,
        maxTokens: 150
      }
    };

    // Adjust based on performance for ultra-low VRAM systems
    if (stats.averageResponseTime > 5000) {
      // Very slow - use most aggressive optimizations for 128MB VRAM
      config.ollama = {
        ...config.ollama,
        model: 'phi3:mini',
        timeout: 10000,
        maxTokens: 100,
        modelOptions: {
          num_predict: 100,
          num_ctx: 256,     // Minimal context
          num_thread: 1,    // Single thread for ultra-low resources
          top_k: 5,         // Very limited choices
          top_p: 0.5,       // Aggressive pruning
          num_gpu: 0,       // Force CPU-only
          low_vram: true,
          f16_kv: false,
          no_mmap: true
        }
      };
    } else if (stats.averageResponseTime > 3000) {
      // Moderately slow - balanced optimizations for low VRAM
      config.ollama = {
        ...config.ollama,
        timeout: 12000,
        maxTokens: 125,
        modelOptions: {
          num_predict: 125,
          num_ctx: 384,
          num_thread: 2,
          top_k: 8,
          top_p: 0.6,
          num_gpu: 0,
          low_vram: true,
          f16_kv: false,
          no_mmap: true
        }
      };
    } else {
      // Good performance - standard low VRAM config
      config.ollama.modelOptions = {
        num_predict: 150,
        num_ctx: 512,
        num_thread: 2,
        top_k: 10,
        top_p: 0.6,
        num_gpu: 0,
        low_vram: true,
        f16_kv: false,
        no_mmap: true
      };
    }

    return config;
  }

  getPercentile(arr, percentile) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * (percentile / 100)) - 1;
    return sorted[index] || 0;
  }

  // Reset metrics
  reset() {
    this.metrics = {
      responseTime: [],
      cacheHitRate: 0,
      errorRate: 0,
      totalRequests: 0,
      cachedResponses: 0,
      errors: 0
    };
  }

  // Get formatted performance report
  getFormattedReport() {
    const stats = this.getStats();
    const recommendations = this.getRecommendations();

    return `
🚀 OLLAMA PERFORMANCE REPORT
============================

📊 Statistics:
- Average Response Time: ${stats.averageResponseTime}ms
- 95th Percentile: ${stats.p95ResponseTime}ms
- Cache Hit Rate: ${stats.cacheHitRate}%
- Error Rate: ${stats.errorRate}%
- Total Requests: ${stats.totalRequests}
- Fast Responses (<2s): ${stats.fastResponses}
- Slow Responses (>5s): ${stats.slowResponses}

💡 Recommendations:
${recommendations.map(r => `- ${r.type.toUpperCase()}: ${r.suggestion}`).join('\n')}

🎯 Target Performance:
- Response Time: <2 seconds
- Cache Hit Rate: >30%
- Error Rate: <2%
`;
  }
}

module.exports = new PerformanceOptimizer(); 