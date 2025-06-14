const colabService = require('./services/colabService');
const axios = require('axios');

/**
 * Google Colab API Monitor
 * Monitors Colab API health and provides timeout prevention
 */
class ColabMonitor {
  constructor() {
    this.checkInterval = 60000; // Check every minute
    this.isMonitoring = false;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeouts: 0,
      averageResponseTime: 0,
      lastSuccessfulRequest: null,
      lastFailedRequest: null
    };
  }

  /**
   * Start monitoring Colab API
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.log('⚠️ Monitoring already active');
      return;
    }

    this.isMonitoring = true;
    console.log('🔍 Starting Colab API monitoring...');
    
    this.monitorInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, this.checkInterval);

    // Initial health check
    this.performHealthCheck();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.isMonitoring = false;
      console.log('🛑 Colab API monitoring stopped');
    }
  }

  /**
   * Perform health check on Colab API
   */
  async performHealthCheck() {
    const startTime = Date.now();
    
    try {
      console.log('🔍 Performing Colab API health check...');
      
      // Test basic connectivity
      const status = await colabService.getStatus();
      
      if (status.available) {
        // Test actual API call
        const testResponse = await colabService.testConnection();
        
        if (testResponse.success) {
          const responseTime = Date.now() - startTime;
          this.recordSuccess(responseTime);
          console.log(`✅ Colab API healthy (${responseTime}ms)`);
        } else {
          this.recordFailure('connection_test_failed');
          console.log(`❌ Colab API connection test failed: ${testResponse.error}`);
        }
      } else {
        this.recordFailure('service_unavailable');
        console.log('❌ Colab service unavailable');
      }
      
    } catch (error) {
      this.recordFailure(error.message.includes('timeout') ? 'timeout' : 'error');
      console.log(`❌ Colab API health check failed: ${error.message}`);
    }
  }

  /**
   * Record successful request
   */
  recordSuccess(responseTime) {
    this.stats.totalRequests++;
    this.stats.successfulRequests++;
    this.stats.lastSuccessfulRequest = new Date().toISOString();
    
    // Update average response time
    this.stats.averageResponseTime = 
      (this.stats.averageResponseTime * (this.stats.successfulRequests - 1) + responseTime) / 
      this.stats.successfulRequests;
  }

  /**
   * Record failed request
   */
  recordFailure(reason) {
    this.stats.totalRequests++;
    this.stats.failedRequests++;
    this.stats.lastFailedRequest = new Date().toISOString();
    
    if (reason === 'timeout') {
      this.stats.timeouts++;
    }
  }

  /**
   * Get monitoring statistics
   */
  getStats() {
    const successRate = this.stats.totalRequests > 0 
      ? (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      successRate: `${successRate}%`,
      isMonitoring: this.isMonitoring,
      checkInterval: this.checkInterval
    };
  }

  /**
   * Test Colab API with sample message
   */
  async testColabAPI() {
    console.log('🧪 Testing Colab API...');
    try {
      const response = await colabService.generateMedicalResponse(
        "Test de connexion",
        { conversationId: 'test_' + Date.now() }
      );
      console.log('✅ Colab API test successful!');
      return { success: true };
    } catch (error) {
      console.log(`❌ Colab API test failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get comprehensive status report
   */
  async getStatusReport() {
    console.log('\n📊 COLAB API STATUS REPORT');
    console.log('=' .repeat(50));
    
    // Environment check
    console.log('\n🔧 Environment Configuration:');
    console.log(`   COLAB_ENABLED: ${process.env.COLAB_ENABLED}`);
    console.log(`   COLAB_API_URL: ${process.env.COLAB_API_URL ? 'configured' : 'not configured'}`);
    console.log(`   COLAB_TIMEOUT: ${process.env.COLAB_TIMEOUT || 'default (120000ms)'}`);
    
    // Service status
    console.log('\n🌐 Service Status:');
    try {
      const status = await colabService.getStatus();
      console.log(`   Enabled: ${status.enabled}`);
      console.log(`   Available: ${status.available}`);
      console.log(`   API URL: ${status.apiUrl}`);
      console.log(`   Model: ${status.model}`);
      console.log(`   Timeout: ${status.timeout}ms`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
    
    // Statistics
    console.log('\n📈 Statistics:');
    const stats = this.getStats();
    console.log(`   Total Requests: ${stats.totalRequests}`);
    console.log(`   Success Rate: ${stats.successRate}`);
    console.log(`   Average Response Time: ${stats.averageResponseTime.toFixed(0)}ms`);
    console.log(`   Timeouts: ${stats.timeouts}`);
    console.log(`   Last Success: ${stats.lastSuccessfulRequest || 'Never'}`);
    console.log(`   Last Failure: ${stats.lastFailedRequest || 'Never'}`);
    
    // Monitoring status
    console.log('\n🔍 Monitoring:');
    console.log(`   Active: ${this.isMonitoring}`);
    console.log(`   Check Interval: ${this.checkInterval / 1000}s`);
    
    console.log('\n' + '=' .repeat(50));
    
    return stats;
  }

  /**
   * Troubleshoot common issues
   */
  async troubleshoot() {
    console.log('\n🔧 TROUBLESHOOTING COLAB API ISSUES');
    console.log('=' .repeat(50));
    
    const issues = [];
    
    // Check environment variables
    if (process.env.COLAB_ENABLED !== 'true') {
      issues.push({
        issue: 'COLAB_ENABLED not set to true',
        solution: 'Add COLAB_ENABLED=true to your .env file'
      });
    }
    
    if (!process.env.COLAB_API_URL) {
      issues.push({
        issue: 'COLAB_API_URL not configured',
        solution: 'Add your ngrok URL to .env file as COLAB_API_URL'
      });
    }
    
    // Check API connectivity
    try {
      const testResult = await this.testColabAPI();
      if (!testResult.success) {
        issues.push({
          issue: `API test failed: ${testResult.error}`,
          solution: 'Check if Google Colab notebook is running and ngrok URL is active'
        });
      }
    } catch (error) {
      issues.push({
        issue: `Cannot test API: ${error.message}`,
        solution: 'Verify Colab service configuration'
      });
    }
    
    // Display issues and solutions
    if (issues.length === 0) {
      console.log('✅ No issues detected!');
    } else {
      console.log(`❌ Found ${issues.length} issue(s):\n`);
      issues.forEach((item, index) => {
        console.log(`${index + 1}. Issue: ${item.issue}`);
        console.log(`   Solution: ${item.solution}\n`);
      });
    }
    
    console.log('=' .repeat(50));
    return issues;
  }
}

// Create and export monitor instance
const colabMonitor = new ColabMonitor();

module.exports = colabMonitor;

// CLI usage
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      colabMonitor.startMonitoring();
      break;
    case 'stop':
      colabMonitor.stopMonitoring();
      break;
    case 'status':
      colabMonitor.getStatusReport();
      break;
    case 'test':
      colabMonitor.testColabAPI();
      break;
    case 'troubleshoot':
      colabMonitor.troubleshoot();
      break;
    default:
      console.log('Usage: node colab_monitor.js [start|stop|status|test|troubleshoot]');
  }
} 