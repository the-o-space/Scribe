const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Generates HTML email template
 * @param {Object} metadata - Email metadata
 * @returns {string} - HTML email content
 */
const generateHtmlEmail = (metadata) => {
  const { title, author, source_url, timestamp } = metadata;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; background: #f4f4f4; }
        .metadata { margin: 20px 0; background: white; padding: 15px; border-radius: 5px; }
        .metadata-item { margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        a { color: #4CAF50; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your EPUB is Ready!</h1>
        </div>
        <div class="content">
            <p>The article has been converted to EPUB format and is attached to this email.</p>
            
            <div class="metadata">
                <div class="metadata-item"><strong>Title:</strong> ${title}</div>
                ${author ? `<div class="metadata-item"><strong>Author:</strong> ${author}</div>` : ''}
                ${source_url ? `<div class="metadata-item"><strong>Source:</strong> <a href="${source_url}">${source_url}</a></div>` : ''}
                <div class="metadata-item"><strong>Generated:</strong> ${timestamp}</div>
            </div>
            
            <p>The EPUB file is attached to this email. You can open it with any EPUB reader such as:</p>
            <ul>
                <li>Apple Books (iOS/macOS)</li>
                <li>Google Play Books</li>
                <li>Calibre (Windows/Mac/Linux)</li>
                <li>Adobe Digital Editions</li>
                <li>Kindle (after converting to MOBI)</li>
            </ul>
        </div>
        <div class="footer">
            <p>Sent by Scribe Chrome Extension</p>
            <p>Convert any article to EPUB format</p>
        </div>
    </div>
</body>
</html>`;
};

/**
 * Generates plain text email template
 * @param {Object} metadata - Email metadata
 * @returns {string} - Plain text email content
 */
const generateTextEmail = (metadata) => {
  const { title, author, source_url, timestamp } = metadata;
  
  return `Your EPUB is Ready!

The article has been converted to EPUB format and is attached to this email.

Title: ${title}
${author ? `Author: ${author}\n` : ''}${source_url ? `Source: ${source_url}\n` : ''}Generated: ${timestamp}

The EPUB file is attached to this email. You can open it with any EPUB reader.

--
Sent by Scribe Chrome Extension
Convert any article to EPUB format`;
};

/**
 * Sends an EPUB file via email
 * @param {Object} options - Email options
 * @returns {Promise} - SendGrid response
 */
const sendEpubEmail = async ({
  recipientEmail,
  ccEmail,
  epubBuffer,
  filename,
  metadata
}) => {
  try {
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    
    const emailMetadata = {
      ...metadata,
      timestamp
    };
    
    const msg = {
      to: recipientEmail,
      from: {
        email: process.env.EMAIL_FROM || 'noreply@scribe.com',
        name: metadata.sender_name || process.env.EMAIL_FROM_NAME || 'Scribe'
      },
      subject: `[Scribe] ${metadata.title} - EPUB Ready`,
      text: generateTextEmail(emailMetadata),
      html: generateHtmlEmail(emailMetadata),
      attachments: [
        {
          content: epubBuffer.toString('base64'),
          filename: filename,
          type: 'application/epub+zip',
          disposition: 'attachment'
        }
      ]
    };
    
    // Add CC if provided
    if (ccEmail) {
      msg.cc = ccEmail;
    }
    
    const response = await sgMail.send(msg);
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
      recipients: [recipientEmail, ccEmail].filter(Boolean)
    };
  } catch (error) {
    console.error('SendGrid error:', error);
    
    // Handle specific SendGrid errors
    if (error.response) {
      const { statusCode, body } = error.response;
      if (statusCode === 413) {
        throw new Error('Email size limit exceeded');
      }
      if (statusCode === 429) {
        throw new Error('Email service rate limit exceeded');
      }
    }
    
    throw error;
  }
};

/**
 * Tests email service connectivity
 * @returns {Promise<boolean>} - True if service is operational
 */
const testEmailService = async () => {
  try {
    // SendGrid doesn't have a specific health check endpoint,
    // but we can verify the API key is set
    if (!process.env.SENDGRID_API_KEY) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Email service test failed:', error);
    return false;
  }
};

module.exports = {
  sendEpubEmail,
  testEmailService
};
