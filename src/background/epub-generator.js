/**
 * EPUB file generation
 */

import { escapeXml } from '../utils/xml.js';
import { generateUUID, formatDate, sanitizeFilename } from '../utils/helpers.js';
import { downloadImages } from './image-downloader.js';
import { createMimeType, createContainer, createContentOpf, createTocNcx, createStyles, createChapter } from './epub-templates.js';

/**
 * Generate EPUB from article data
 * @param {Object} articleData - Article data object
 * @returns {Promise<void>}
 */
export async function generateEpub(articleData) {
  try {
    const zip = new JSZip();
    const uuid = generateUUID();
    
    // Download images if any
    const downloadedImages = await downloadImages(articleData.images, zip);
    
    // Create EPUB structure
    createMimeType(zip);
    createContainer(zip);
    
    // Create OEBPS directory
    zip.folder('OEBPS');
    
    // Create content files
    createContentOpf(zip, articleData, uuid, downloadedImages);
    createTocNcx(zip, articleData, uuid);
    createStyles(zip);
    createChapter(zip, articleData);
    
    // Generate the EPUB file
    const epubBlob = await zip.generateAsync({ 
      type: 'blob',
      mimeType: 'application/epub+zip',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });
    
    // Convert to data URL and download
    await downloadEpub(epubBlob, articleData.title);
    
  } catch (error) {
    throw new Error('Failed to generate EPUB: ' + error.message);
  }
}

/**
 * Download EPUB file
 * @param {Blob} epubBlob - EPUB blob
 * @param {string} title - Article title for filename
 */
async function downloadEpub(epubBlob, title) {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onloadend = function() {
      // Create a proper data URL with EPUB MIME type
      const base64 = reader.result.split(',')[1];
      const dataUrl = `data:application/epub+zip;base64,${base64}`;
      const filename = sanitizeFilename(title) + '.epub';
      
      chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: true
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('Download failed:', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          console.log('Download started with ID:', downloadId);
          resolve(downloadId);
        }
      });
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(epubBlob);
  });
}