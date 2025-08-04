const path = require('path');

/**
 * Validates if the uploaded file is a valid EPUB
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Original filename
 * @returns {boolean} - True if valid EPUB
 * @throws {Error} - If validation fails
 */
const validateEpub = (buffer, filename) => {
  // Check file extension
  const ext = path.extname(filename).toLowerCase();
  if (ext !== '.epub') {
    throw new Error('File must have .epub extension');
  }
  
  // Check if buffer is large enough to contain magic bytes
  if (!buffer || buffer.length < 4) {
    throw new Error('Invalid file: too small');
  }
  
  // Check ZIP magic bytes (EPUB files are ZIP archives)
  // ZIP files start with PK (0x504B)
  const zipSignature = buffer.slice(0, 4).toString('hex');
  if (!zipSignature.startsWith('504b0304') && !zipSignature.startsWith('504b0506')) {
    throw new Error('Invalid EPUB file: not a valid ZIP archive');
  }
  
  // Additional validation could be added here:
  // - Check for mimetype file at specific offset
  // - Verify META-INF/container.xml exists
  // - Validate against EPUB specification
  
  return true;
};

/**
 * Sanitizes filename for safe storage/sending
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
const sanitizeFilename = (filename) => {
  // Remove any path components
  const basename = path.basename(filename);
  
  // Replace unsafe characters with underscores
  const safe = basename.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Ensure .epub extension
  if (!safe.endsWith('.epub')) {
    return safe + '.epub';
  }
  
  return safe;
};

module.exports = {
  validateEpub,
  sanitizeFilename
};
