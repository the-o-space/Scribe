const express = require('express');
const { testEmailService } = require('../services/emailService');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    // Test email service connectivity
    const emailServiceOperational = await testEmailService();
    
    // Get package version
    const packageJson = require('../../package.json');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: packageJson.version || '1.0.0',
      email_service: emailServiceOperational ? 'operational' : 'degraded',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service health check failed'
    });
  }
});

module.exports = router;
