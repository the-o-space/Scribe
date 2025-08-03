/**
 * Main content script for article extraction
 */

import { cleanDomElement } from './dom-cleaner.js';
import { extractMetadata, findArticleBody } from './metadata-extractor.js';
import { convertToXHTML } from './html-converter.js';

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractArticle') {
    extractArticle()
      .then(data => sendResponse({ data }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Keep the message channel open for async response
  }
});

/**
 * Extract article data from the current page
 * @returns {Promise<Object>} Article data
 */
async function extractArticle() {
  // Find article body
  const bodyElement = findArticleBody();
  
  if (!bodyElement) {
    throw new Error('Could not find article content. This page does not contain a supported article structure.');
  }
  
  // Extract metadata
  const metadata = extractMetadata();
  
  // Clean the DOM
  const cleanedElement = cleanDomElement(bodyElement);
  
  // Convert to XHTML
  const { html, images } = convertToXHTML(cleanedElement);
  
  return {
    title: metadata.title,
    author: metadata.author,
    publishDate: metadata.publishDate,
    url: metadata.url,
    htmlContent: html,
    images: images
  };
}