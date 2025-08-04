#!/usr/bin/env node

/**
 * Test script for Scribe backend email functionality
 * Usage: node test-email.js <recipient-email> [epub-file-path]
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const DEFAULT_EPUB = path.join(__dirname, 'test.epub');

async function testEmailEndpoint(recipientEmail, epubPath) {
  console.log('Testing Scribe Email Backend...\n');
  
  // Check if EPUB file exists
  if (!fs.existsSync(epubPath)) {
    console.error(`Error: EPUB file not found at ${epubPath}`);
    console.log('Please provide a valid EPUB file path or create test.epub in the backend directory');
    process.exit(1);
  }
  
  // Create form data
  const form = new FormData();
  form.append('epub_file', fs.createReadStream(epubPath), {
    filename: path.basename(epubPath),
    contentType: 'application/epub+zip'
  });
  form.append('title', 'Test Article - Scribe Backend Test');
  form.append('author', 'Test Author');
  form.append('source_url', 'https://example.com/test-article');
  form.append('recipient_email', recipientEmail);
  
  try {
    console.log(`Sending EPUB to: ${recipientEmail}`);
    console.log(`Using file: ${epubPath}`);
    console.log(`API endpoint: ${API_URL}/api/send-epub\n`);
    
    const response = await axios.post(`${API_URL}/api/send-epub`, form, {
      headers: {
        ...form.getHeaders(),
        'Origin': 'chrome-extension://test-extension-id'
      }
    });
    
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error sending email:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Try: npm run dev');
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Test health endpoint
async function testHealthEndpoint() {
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    console.log('Health check:', JSON.stringify(response.data, null, 2));
    console.log('');
  } catch (error) {
    console.error('❌ Health check failed. Server may not be running.');
    process.exit(1);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node test-email.js <recipient-email> [epub-file-path]');
    console.log('Example: node test-email.js test@example.com mybook.epub');
    process.exit(1);
  }
  
  const recipientEmail = args[0];
  const epubPath = args[1] || DEFAULT_EPUB;
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    console.error('Error: Invalid email format');
    process.exit(1);
  }
  
  // Test health first
  await testHealthEndpoint();
  
  // Test email sending
  await testEmailEndpoint(recipientEmail, epubPath);
}

// Check if axios is installed
try {
  require.resolve('axios');
} catch (e) {
  console.log('Installing axios for testing...');
  require('child_process').execSync('npm install axios', { stdio: 'inherit' });
}

main().catch(console.error);