const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const corsMiddleware = require('./middleware/cors');
const emailRoutes = require('./routes/email');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// CORS
app.use(corsMiddleware);

// Body parsing - Note: multer handles multipart/form-data in routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', emailRoutes);
app.use('/api', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request',
      details: {
        field: 'epub_file',
        message: 'File too large. Maximum size is 25MB'
      }
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Failed to send email',
    message: 'Internal server error'
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Sub-to-Pub Backend running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
