/**
 * XML utility functions for EPUB generation
 */

/**
 * Escape special characters for XML/XHTML
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for XML
 */
export function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Escape special characters in attributes (mainly for URLs)
 * @param {string} attr - Attribute value to escape
 * @returns {string} Escaped attribute value
 */
export function escapeAttribute(attr) {
  if (!attr) return '';
  return attr
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}