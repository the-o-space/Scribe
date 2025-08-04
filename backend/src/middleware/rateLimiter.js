const rateLimit = require('express-rate-limit');

// Create a custom key generator that includes both IP and email
const keyGenerator = (req) => {
  const email = req.body?.recipient_email || 'unknown';
  return `${req.ip}:${email}`;
};

// Global rate limiter - 100 requests per hour per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    success: false,
    error: 'Rate limit exceeded',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email-specific rate limiter - 10 emails per hour per recipient
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  keyGenerator: keyGenerator,
  message: {
    success: false,
    error: 'Rate limit exceeded for this email address',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.body?.recipient_email // Skip if no email provided
});

module.exports = {
  globalLimiter,
  emailLimiter
};
