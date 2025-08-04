# Sub-to-Pub Email Backend API Specification

## Overview
A lightweight backend service for the Sub-to-Pub Chrome extension that handles EPUB email delivery. The service receives EPUB files from the extension and sends them via email to specified recipients.

**Base URL**: `https://backend.sub-to-pub.xn--the-2na.space`

## Architecture

### Technology Stack
- **Runtime**: Node.js (recommended) or Python
- **Framework**: Express.js / Fastify (Node.js) or FastAPI (Python)
- **Email Service**: Nodemailer with SMTP
- **File Handling**: Multer (Node.js) or python-multipart
- **Rate Limiting**: express-rate-limit or custom implementation
- **CORS**: Configured for Chrome extension origins

### Email Provider Options
1. **Self-hosted** (Postfix/Sendmail on your Hetzner server)
2. **Transactional Email Service** (recommended):
   - Resend (simple, affordable)
   - SendLayer (good deliverability)
   - Postmark (reliable)
   - SendGrid (free tier available)

## API Endpoints

### 1. Send EPUB Email
**Endpoint**: `POST /api/send-epub`

**Headers**:
```
Content-Type: multipart/form-data
Origin: chrome-extension://[extension-id]
```

**Request Body** (FormData):
```
epub_file: File (required) - The EPUB file to send
title: string (required) - Article/book title
author: string (optional) - Author name
source_url: string (optional) - Original article URL
recipient_email: string (required) - Primary recipient
cc_email: string (optional) - Secondary recipient
sender_name: string (optional, default: "Sub-to-Pub") - Sender display name
```

**Validation Rules**:
- `epub_file`: Max 25MB, must be valid EPUB (check magic bytes)
- `recipient_email` & `cc_email`: Valid email format
- `title`: Max 200 characters, sanitized
- `source_url`: Valid URL format if provided

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "abc123@backend.sub-to-pub.xn--the-2na.space",
  "recipients": ["user@example.com", "cc@example.com"]
}
```

**Error Responses**:

400 Bad Request:
```json
{
  "success": false,
  "error": "Invalid request",
  "details": {
    "field": "epub_file",
    "message": "File too large. Maximum size is 25MB"
  }
}
```

429 Too Many Requests:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

500 Internal Server Error:
```json
{
  "success": false,
  "error": "Failed to send email",
  "message": "Internal server error"
}
```

### 2. Health Check
**Endpoint**: `GET /api/health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-01-10T12:00:00Z",
  "version": "1.0.0",
  "email_service": "operational"
}
```

## Security Measures

### 1. CORS Configuration
```javascript
const allowedOrigins = [
  'chrome-extension://*',  // Allow all Chrome extensions
  'moz-extension://*'      // Allow Firefox if needed
];
```

### 2. Rate Limiting
- **Global**: 100 requests per hour per IP
- **Per Email**: 10 emails per hour per recipient
- **File Size**: Max 25MB per EPUB

### 3. Input Validation
- Sanitize all text inputs (prevent XSS)
- Validate email addresses (RFC 5322)
- Check EPUB file headers (application/epub+zip)
- Reject executable files

### 4. Request Verification
- Check `Origin` header matches extension pattern
- Optionally implement request signing using a shared secret
- Log all requests with timestamps and IPs

## Email Template

### Subject Line
```
[Sub-to-Pub] {title} - EPUB Ready
```

### HTML Email Body
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f4f4f4; }
        .metadata { margin: 20px 0; }
        .metadata-item { margin: 10px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
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
                <div class="metadata-item"><strong>Title:</strong> {title}</div>
                {if author}
                <div class="metadata-item"><strong>Author:</strong> {author}</div>
                {/if}
                {if source_url}
                <div class="metadata-item"><strong>Source:</strong> <a href="{source_url}">{source_url}</a></div>
                {/if}
                <div class="metadata-item"><strong>Generated:</strong> {timestamp}</div>
            </div>
            
            <p>The EPUB file is attached to this email. You can open it with any EPUB reader.</p>
        </div>
        <div class="footer">
            <p>Sent by Sub-to-Pub Chrome Extension</p>
            <p>Convert any article to EPUB format</p>
        </div>
    </div>
</body>
</html>
```

### Plain Text Fallback
```
Your EPUB is Ready!

The article has been converted to EPUB format and is attached to this email.

Title: {title}
Author: {author}
Source: {source_url}
Generated: {timestamp}

The EPUB file is attached to this email. You can open it with any EPUB reader.

--
Sent by Sub-to-Pub Chrome Extension
Convert any article to EPUB format
```

## Implementation Example (Node.js/Express)

### Project Structure
```
backend.sub-to-pub/
├── src/
│   ├── app.js           # Express app setup
│   ├── routes/
│   │   ├── email.js     # Email endpoint
│   │   └── health.js    # Health check
│   ├── middleware/
│   │   ├── cors.js      # CORS configuration
│   │   ├── rateLimiter.js
│   │   └── validator.js # Input validation
│   ├── services/
│   │   └── emailService.js
│   └── utils/
│       └── fileValidator.js
├── .env.example
├── package.json
└── README.md
```

### Environment Variables (.env)
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Email Configuration
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@xn--the-2na.space
EMAIL_FROM_NAME=Sub-to-Pub

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
RATE_LIMIT_MAX=100

# File Limits
MAX_FILE_SIZE_MB=25

# CORS
ALLOWED_ORIGINS=chrome-extension://,moz-extension://
```

### Key Implementation Points

1. **File Validation** (fileValidator.js):
```javascript
const validateEpub = (buffer) => {
  // Check magic bytes for EPUB (ZIP format)
  const zipSignature = buffer.slice(0, 4).toString('hex');
  if (zipSignature !== '504b0304') {
    throw new Error('Invalid EPUB file');
  }
  
  // Additional validation can check for mimetype file
  // and META-INF/container.xml presence
};
```

2. **Email Service** (emailService.js):
```javascript
const sendEpubEmail = async ({
  recipientEmail,
  ccEmail,
  epubBuffer,
  filename,
  metadata
}) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: recipientEmail,
    cc: ccEmail,
    subject: `[Sub-to-Pub] ${metadata.title} - EPUB Ready`,
    html: generateHtmlEmail(metadata),
    text: generateTextEmail(metadata),
    attachments: [{
      filename: filename,
      content: epubBuffer,
      contentType: 'application/epub+zip'
    }]
  };
  
  return await transporter.sendMail(mailOptions);
};
```

3. **Rate Limiting** (rateLimiter.js):
```javascript
const createRateLimiter = () => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.ip + ':' + req.body.recipient_email;
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    // Clean old entries and count recent requests
    // Implement sliding window algorithm
    
    if (recentRequests >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: 60
      });
    }
    
    next();
  };
};
```

## Deployment Instructions

### 1. Server Setup (Hetzner)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup
git clone [your-repo]
cd backend.sub-to-pub
npm install
cp .env.example .env
# Edit .env with your configuration

# Start with PM2
pm2 start src/app.js --name sub-to-pub-backend
pm2 save
pm2 startup
```

### 2. Nginx Configuration
```nginx
server {
    listen 80;
    server_name backend.sub-to-pub.xn--the-2na.space;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # File upload settings
        client_max_body_size 30M;
        proxy_request_buffering off;
    }
}
```

### 3. SSL Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d backend.sub-to-pub.xn--the-2na.space
```

## Monitoring & Logging

### Recommended Logging
- All API requests (timestamp, IP, endpoint)
- Email send attempts (success/failure)
- Rate limit hits
- File validation failures
- SMTP errors

### Health Monitoring
- Check SMTP connection on startup
- Periodic health checks
- Alert on high error rates
- Monitor disk space (for temporary files)

## Extension Integration

### Chrome Extension Code Example
```javascript
async function sendEpubEmail(epubBlob, metadata) {
  const formData = new FormData();
  formData.append('epub_file', epubBlob, `${metadata.title}.epub`);
  formData.append('title', metadata.title);
  formData.append('author', metadata.author || '');
  formData.append('source_url', metadata.url || '');
  formData.append('recipient_email', settings.primaryEmail);
  
  if (settings.secondaryEmail) {
    formData.append('cc_email', settings.secondaryEmail);
  }
  
  try {
    const response = await fetch('https://backend.sub-to-pub.xn--the-2na.space/api/send-epub', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }
    
    return result;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}
```

## Testing

### Manual Testing
```bash
# Test with curl
curl -X POST https://backend.sub-to-pub.xn--the-2na.space/api/send-epub \
  -F "epub_file=@test.epub" \
  -F "title=Test Article" \
  -F "recipient_email=test@example.com" \
  -F "author=Test Author"
```

### Automated Tests
- Unit tests for validators
- Integration tests for email sending
- Load tests for rate limiting
- File size boundary tests

## Future Enhancements

1. **Queue System**: Add Redis/Bull for async processing
2. **Webhooks**: Notify extension of delivery status
3. **Analytics**: Track email opens/downloads
4. **Templates**: Multiple email template options
5. **Compression**: Zip multiple EPUBs
6. **Virus Scanning**: ClamAV integration
7. **Backup**: Store EPUBs temporarily (24h)

## Version History

- **v1.0.0** - Initial release with basic email functionality