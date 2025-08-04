/**
 * DOM cleaning utilities for preparing content for EPUB conversion
 */

/**
 * Clean and prepare DOM element for EPUB conversion
 * @param {Element} element - DOM element to clean
 * @returns {Element} Cleaned element
 */
export function cleanDomElement(element) {
  const clone = element.cloneNode(true);
  
  // Remove script tags and other unwanted elements
  const unwantedSelectors = 'script, style, iframe, noscript, object, embed, source, video, audio';
  const unwantedElements = clone.querySelectorAll(unwantedSelectors);
  unwantedElements.forEach(el => el.remove());
  
  // Fix self-closing tags that aren't valid in XHTML
  fixSelfClosingTags(clone);
  
  // Handle picture elements
  handlePictureElements(clone);
  
  // Fix image attributes
  fixImageElements(clone);
  
  return clone;
}

/**
 * Fix self-closing tags for XHTML compatibility
 * @param {Element} element - DOM element to process
 */
function fixSelfClosingTags(element) {
  const selfClosingTags = element.querySelectorAll('img, br, hr, input, meta, link, area, base, col, embed, source, track, wbr');
  selfClosingTags.forEach(el => {
    // Ensure self-closing tags are properly closed
    if (!el.innerHTML && !el.textContent) {
      el.innerHTML = '';
    }
  });
}

/**
 * Handle picture elements by extracting img tags
 * @param {Element} element - DOM element to process
 */
function handlePictureElements(element) {
  const pictureElements = element.querySelectorAll('picture');
  pictureElements.forEach(picture => {
    // Replace picture element with its img child if it exists
    const img = picture.querySelector('img');
    if (img) {
      picture.parentNode.replaceChild(img.cloneNode(true), picture);
    } else {
      picture.remove();
    }
  });
}

/**
 * Fix image elements for EPUB compatibility
 * @param {Element} element - DOM element to process
 */
function fixImageElements(element) {
  const imgElements = element.querySelectorAll('img');
  imgElements.forEach(img => {
    // Convert relative URLs to absolute
    if (img.src) {
      img.src = new URL(img.src, window.location.href).href;
    }
    
    // Remove problematic attributes
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.removeAttribute('loading');
    
    // Ensure alt attribute exists
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
  });
}