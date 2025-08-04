/**
 * Convert HTML to XHTML for EPUB compatibility
 */

import { escapeXml, escapeAttribute } from '../utils/xml.js';
import { getImageExtension } from '../utils/helpers.js';

/**
 * Convert HTML element to XHTML-compatible format
 * @param {Element} element - DOM element to convert
 * @returns {Object} Object with html string and images array
 */
export function convertToXHTML(element) {
  let result = '';
  const images = [];
  let imageCounter = 0;
  
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Escape text content for XML
      result += escapeXml(node.textContent);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      switch (tagName) {
        // Block elements
        case 'p':
        case 'div':
          if (result && !result.endsWith('\n')) result += '\n';
          result += '<p>';
          processChildren(node);
          result += '</p>\n';
          break;
          
        // Headings
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          if (result && !result.endsWith('\n')) result += '\n';
          result += `<${tagName}>`;
          processChildren(node);
          result += `</${tagName}>\n`;
          break;
          
        // Inline formatting
        case 'strong':
        case 'b':
          result += '<strong>';
          processChildren(node);
          result += '</strong>';
          break;
          
        case 'em':
        case 'i':
          result += '<em>';
          processChildren(node);
          result += '</em>';
          break;
          
        case 'code':
          result += '<code>';
          processChildren(node);
          result += '</code>';
          break;
          
        // Self-closing tags
        case 'br':
          result += '<br/>';
          break;
          
        case 'hr':
          result += '\n<hr/>\n';
          break;
          
        // Links
        case 'a':
          if (node.href) {
            const href = escapeAttribute(node.href);
            result += `<a href="${href}">`;
            processChildren(node);
            result += '</a>';
          } else {
            processChildren(node);
          }
          break;
          
        // Blockquotes
        case 'blockquote':
          result += '\n<blockquote>';
          processChildren(node);
          result += '</blockquote>\n';
          break;
          
        // Lists
        case 'ul':
        case 'ol':
          result += `\n<${tagName}>`;
          processChildren(node);
          result += `</${tagName}>\n`;
          break;
          
        case 'li':
          result += '<li>';
          processChildren(node);
          result += '</li>';
          break;
          
        // Images
        case 'img':
          if (node.src) {
            const imageUrl = node.src;
            const imageFilename = `image${imageCounter}.${getImageExtension(imageUrl)}`;
            images.push({
              url: imageUrl,
              filename: imageFilename
            });
            const alt = escapeAttribute(node.alt || '');
            result += `<img src="Images/${imageFilename}" alt="${alt}"/>`;
            imageCounter++;
          }
          break;
          
        // Pre-formatted text
        case 'pre':
          result += '\n<pre>';
          processChildren(node);
          result += '</pre>\n';
          break;
          
        // Default: process children only
        default:
          processChildren(node);
      }
    }
  }
  
  function processChildren(node) {
    for (const child of node.childNodes) {
      processNode(child);
    }
  }
  
  processNode(element);
  
  return { html: result, images: images };
}