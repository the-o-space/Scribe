const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is from a Chrome or Firefox extension
    if (origin.startsWith('chrome-extension://') || 
        origin.startsWith('moz-extension://')) {
      return callback(null, true);
    }
    
    // In development, allow localhost
    if (process.env.NODE_ENV === 'development' && 
        (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    
    // Otherwise, reject the request
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Origin'],
  maxAge: 86400 // 24 hours
};

module.exports = cors(corsOptions);
