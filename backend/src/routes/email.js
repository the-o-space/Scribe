const express = require('express');
const multer = require('multer');
const { sendEpubValidation, handleValidationErrors } = require('../middleware/validator');
const { globalLimiter, emailLimiter } = require('../middleware/rateLimiter');
const { validateEpub, sanitizeFilename } = require('../utils/fileValidator');
const { sendEpubEmail } = require('../services/emailService');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Basic file type check (more thorough check happens after upload)
    if (file.mimetype === 'application/epub+zip' || 
        file.originalname.toLowerCase().endsWith('.epub')) {
      cb(null, true);
    } else {
      cb(new Error('Only EPUB files are allowed'));
    }
  }
});

/**
 * POST /api/send-epub
 * Send an EPUB file via email
 */
router.post('/send-epub',
  globalLimiter,
  emailLimiter,
  upload.single('epub_file'),
  sendEpubValidation,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request',
          details: {
            field: 'epub_file',
            message: 'EPUB file is required'
          }
        });
      }
      
      // Validate EPUB file
      try {
        validateEpub(req.file.buffer, req.file.originalname);
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request',
          details: {
            field: 'epub_file',
            message: validationError.message
          }
        });
      }
      
      // Prepare email metadata
      const metadata = {
        title: req.body.title,
        author: req.body.author || null,
        source_url: req.body.source_url || null,
        sender_name: req.body.sender_name || null
      };
      
      // Sanitize filename
      const filename = sanitizeFilename(
        req.file.originalname || `${metadata.title}.epub`
      );
      
      // Send email
      const result = await sendEpubEmail({
        recipientEmail: req.body.recipient_email,
        ccEmail: req.body.cc_email || null,
        epubBuffer: req.file.buffer,
        filename: filename,
        metadata: metadata
      });
      
      // Log successful send
      console.log(`Email sent successfully: ${result.messageId} to ${result.recipients.join(', ')}`);
      
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
        recipients: result.recipients
      });
      
    } catch (error) {
      // Pass to error handler
      next(error);
    }
  }
);

module.exports = router;
