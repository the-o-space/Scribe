/**
 * Main background script for the extension
 */

import { generateEpub } from './epub-generator.js';

// JSZip will be imported at the build step

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Inject the content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['dist/content.js']
    });
    
    // Send message to extract article
    chrome.tabs.sendMessage(tab.id, { action: 'extractArticle' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError.message);
        return;
      }
      
      if (response && response.error) {
        console.error('Error:', response.error);
        return;
      }
      
      if (response && response.data) {
        generateEpub(response.data)
          .then(() => {
            console.log('EPUB generated successfully');
          })
          .catch(error => {
            console.error('Failed to generate EPUB:', error);
          });
      }
    });
  } catch (error) {
    console.error('Failed to inject content script:', error);
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateEpub') {
    generateEpub(request.data)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        sendResponse({ error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});