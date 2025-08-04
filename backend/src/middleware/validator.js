const { body, validationResult } = require('express-validator');

// Validation rules for the send-epub endpoint
const sendEpubValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters')
    .trim()
    .escape(),
  
  body('author')
    .optional()
    .isLength({ max: 100 }).withMessage('Author name must be less than 100 characters')
    .trim()
    .escape(),
  
  body('source_url')
    .optional()
    .isURL({ require_protocol: true }).withMessage('Invalid URL format'),
  
  body('recipient_email')
    .notEmpty().withMessage('Recipient email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('cc_email')
    .optional()
    .isEmail().withMessage('Invalid CC email format')
    .normalizeEmail(),
  
  body('sender_name')
    .optional()
    .isLength({ max: 50 }).withMessage('Sender name must be less than 50 characters')
    .trim()
    .escape()
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      error: 'Invalid request',
      details: {
        field: firstError.path,
        message: firstError.msg
      }
    });
  }
  
  next();
};

module.exports = {
  sendEpubValidation,
  handleValidationErrors
};
