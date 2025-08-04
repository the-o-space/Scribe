/**
 * General helper functions
 */

/**
 * Generate a UUID v4
 * @returns {string} UUID string
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Format date string to readable format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Sanitize filename for safe file system usage
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200); // Limit length
}

/**
 * Get MIME type from filename
 * @param {string} filename - Filename with extension
 * @returns {string} MIME type
 */
export function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Get image extension from URL
 * @param {string} url - Image URL
 * @returns {string} File extension
 */
export function getImageExtension(url) {
  const match = url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i);
  if (match) {
    return match[1].toLowerCase();
  }
  return 'jpg';
}