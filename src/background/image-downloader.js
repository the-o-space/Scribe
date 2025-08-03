/**
 * Image downloading functionality for EPUB generation
 */

import { getMimeType } from '../utils/helpers.js';

/**
 * Download images for EPUB
 * @param {Array} images - Array of image objects with url and filename
 * @param {JSZip} zip - JSZip instance
 * @returns {Promise<Array>} Array of downloaded images with metadata
 */
export async function downloadImages(images, zip) {
  const downloadedImages = [];
  
  if (!images || images.length === 0) {
    return downloadedImages;
  }
  
  console.log(`Downloading ${images.length} images...`);
  
  // Create Images folder
  zip.folder('OEBPS/Images');
  
  for (const imageInfo of images) {
    try {
      const response = await fetch(imageInfo.url);
      if (response.ok) {
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        zip.file(`OEBPS/Images/${imageInfo.filename}`, arrayBuffer);
        
        downloadedImages.push({
          filename: imageInfo.filename,
          mediaType: getMimeType(imageInfo.filename)
        });
        
        console.log(`Downloaded: ${imageInfo.filename}`);
      } else {
        console.error(`Failed to download image: ${imageInfo.url}`);
      }
    } catch (error) {
      console.error(`Error downloading image ${imageInfo.url}:`, error);
    }
  }
  
  return downloadedImages;
}