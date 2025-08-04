/**
 * Extract metadata from web pages
 */

/**
 * Extract article metadata from the current page
 * @returns {Object} Metadata object with title, author, publishDate
 */
export function extractMetadata() {
  return {
    title: extractTitle(),
    author: extractAuthor(),
    publishDate: extractPublishDate(),
    url: window.location.href
  };
}

/**
 * Extract article title
 * @returns {string} Article title
 */
function extractTitle() {
  return document.title || 'Untitled Article';
}

/**
 * Extract author information
 * @returns {string} Author name or empty string
 */
function extractAuthor() {
  // Try multiple author selectors
  const authorSelectors = [
    'a[href*="/profile/"]',           // Substack
    'a[href*="/users/"]',             // LessWrong users
    '.PostsAuthors-author a',         // LessWrong author link
    '[class*="author"] a',            // Generic author link
    'meta[name="author"]',            // Meta tag
    'span[itemprop="author"]'         // Schema.org markup
  ];
  
  for (const selector of authorSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const content = element.content || element.textContent;
      if (content) {
        return content.trim();
      }
    }
  }
  
  return '';
}

/**
 * Extract publication date
 * @returns {string} Publication date or empty string
 */
function extractPublishDate() {
  // Try time element first
  const timeElement = document.querySelector('time');
  if (timeElement) {
    return timeElement.getAttribute('datetime') || timeElement.textContent;
  }
  
  // Try meta tags
  const metaSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="publish_date"]',
    'meta[itemprop="datePublished"]'
  ];
  
  for (const selector of metaSelectors) {
    const element = document.querySelector(selector);
    if (element && element.content) {
      return element.content;
    }
  }
  
  return '';
}

/**
 * Find the main article content element
 * @returns {Element|null} Article body element or null
 */
export function findArticleBody() {
  const selectors = [
    'div.body.markup',     // Substack and similar
    'div#postBody',        // LessWrong
    'div.postBody',        // Alternative LessWrong selector
    'article[role="main"]', // Semantic HTML
    'main article',        // Common pattern
    '[itemprop="articleBody"]' // Schema.org markup
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
  }
  
  return null;
}