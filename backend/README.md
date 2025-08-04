# Scribe Email Backend

## Overview

A lightweight Node.js/Express backend service for the Scribe Chrome extension that handles EPUB email delivery using SendGrid's free tier (100 emails/day).

## Features

- **Email Delivery**: Send EPUB files as email attachments via SendGrid
- **Rate Limiting**: Protect against abuse (100 req/hour per IP, 10 emails/hour per recipient)
- **Security**: CORS protection for Chrome extensions, input validation, file validation
- **File Validation**: Ensures uploaded files are valid EPUB format (ZIP with proper structure)
- **Health Monitoring**: Built-in health check endpoint

## Architecture

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── routes/
│   │   ├── email.js        # POST /api/send-epub endpoint
│   │   └── health.js       # GET /api/health endpoint
│   ├── middleware/
│   │   ├── cors.js         # CORS configuration for extensions
│   │   ├── rateLimiter.js  # Rate limiting implementation
│   │   └── validator.js    # Input validation rules
│   ├── services/
│   │   └── emailService.js # SendGrid email service
│   └── utils/
│       └── fileValidator.js # EPUB file validation
├── .env.example            # Environment variables template
├── package.json
└── README.md
```

## Prerequisites

- Node.js >= 14.0.0
- SendGrid account (free tier: 100 emails/day)
- Server with public IP (for Chrome extension to reach)

## Setup

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Configure SendGrid

1. Create a free SendGrid account at https://signup.sendgrid.com/
2. Verify your sender email address (Single Sender Verification)
3. Generate an API key: https://app.sendgrid.com/settings/api_keys
4. Set appropriate permissions for the API key (Mail Send access)

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Server
PORT=3000
NODE_ENV=production

# SendGrid
SENDGRID_API_KEY=SG.your-actual-api-key-here

# Email Settings
EMAIL_FROM=your-verified-sender@domain.com
EMAIL_FROM_NAME=Scribe
```

### 4. Run the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Send EPUB Email
```
POST /api/send-epub
Content-Type: multipart/form-data

Fields:
- epub_file (File, required): EPUB file to send
- title (string, required): Article title
- author (string, optional): Author name
- source_url (string, optional): Original article URL
- recipient_email (string, required): Primary recipient
- cc_email (string, optional): CC recipient
- sender_name (string, optional): Email sender name
```

### Health Check
```
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2024-01-10T12:00:00Z",
  "version": "1.0.0",
  "email_service": "operational"
}
```

## Testing

Test with curl:
```bash
curl -X POST http://localhost:3000/api/send-epub \
  -F "epub_file=@test.epub" \
  -F "title=Test Article" \
  -F "recipient_email=test@example.com" \
  -F "author=Test Author"
```

## Deployment (PM2)

1. Install PM2:
```bash
sudo npm install -g pm2
```

2. Start the application:
```bash
pm2 start src/app.js --name scribe-backend
pm2 save
pm2 startup
```

3. Monitor:
```bash
pm2 status
pm2 logs scribe-backend
```

## Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS (use Nginx reverse proxy)
- [ ] Configure firewall rules
- [ ] Set up logging and monitoring
- [ ] Test rate limiting
- [ ] Verify SendGrid domain authentication
- [ ] Set up backup email service (optional)

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure Chrome extension ID is allowed in CORS config
2. **Rate limit errors**: Check rate limiting configuration
3. **SendGrid errors**: Verify API key and sender email
4. **File too large**: Maximum file size is 25MB

### Logs

Check PM2 logs:
```bash
pm2 logs scribe-backend --lines 100
```

## Security Considerations

- Only accepts connections from Chrome/Firefox extensions
- Validates all inputs to prevent injection attacks
- Rate limits to prevent abuse
- File validation to ensure only EPUBs are processed
- No file storage - files are processed in memory only

## License

MIT