/**
 * EPUB template generation functions
 */

import { escapeXml } from '../utils/xml.js';
import { formatDate } from '../utils/helpers.js';

/**
 * Create mimetype file
 * @param {JSZip} zip - JSZip instance
 */
export function createMimeType(zip) {
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
}

/**
 * Create META-INF/container.xml
 * @param {JSZip} zip - JSZip instance
 */
export function createContainer(zip) {
  zip.folder('META-INF');
  zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);
}

/**
 * Create content.opf file
 * @param {JSZip} zip - JSZip instance
 * @param {Object} articleData - Article data
 * @param {string} uuid - Book UUID
 * @param {Array} downloadedImages - Downloaded images metadata
 */
export function createContentOpf(zip, articleData, uuid, downloadedImages) {
  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${escapeXml(articleData.title)}</dc:title>
    <dc:creator>${escapeXml(articleData.author || 'Unknown Author')}</dc:creator>
    <dc:identifier id="BookID">urn:uuid:${uuid}</dc:identifier>
    <dc:language>en</dc:language>
    <dc:date>${articleData.publishDate || new Date().toISOString()}</dc:date>
    <dc:source>${escapeXml(articleData.url)}</dc:source>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="style" href="styles.css" media-type="text/css"/>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml"/>
    ${downloadedImages.map((img, index) => 
      `<item id="image${index}" href="Images/${img.filename}" media-type="${img.mediaType}"/>`
    ).join('\n    ')}
  </manifest>
  <spine toc="ncx">
    <itemref idref="chapter1"/>
  </spine>
</package>`;
  
  zip.file('OEBPS/content.opf', contentOpf);
}

/**
 * Create toc.ncx file
 * @param {JSZip} zip - JSZip instance
 * @param {Object} articleData - Article data
 * @param {string} uuid - Book UUID
 */
export function createTocNcx(zip, articleData, uuid) {
  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${escapeXml(articleData.title)}</text>
  </docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel>
        <text>${escapeXml(articleData.title)}</text>
      </navLabel>
      <content src="chapter1.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`;
  
  zip.file('OEBPS/toc.ncx', tocNcx);
}

/**
 * Create styles.css file
 * @param {JSZip} zip - JSZip instance
 */
export function createStyles(zip) {
  const styles = `body {
  font-family: Georgia, serif;
  line-height: 1.6;
  margin: 1em;
}

h1, h2, h3, h4, h5, h6 {
  font-family: Arial, sans-serif;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

p {
  margin-bottom: 1em;
  text-align: justify;
}

img {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
}

blockquote {
  margin: 1em 2em;
  padding-left: 1em;
  border-left: 3px solid #ccc;
  font-style: italic;
}

pre {
  background-color: #f4f4f4;
  padding: 1em;
  overflow-x: auto;
  font-family: Consolas, monospace;
}

code {
  background-color: #f4f4f4;
  padding: 0.2em 0.4em;
  font-family: Consolas, monospace;
}`;
  
  zip.file('OEBPS/styles.css', styles);
}

/**
 * Create chapter1.xhtml file
 * @param {JSZip} zip - JSZip instance
 * @param {Object} articleData - Article data
 */
export function createChapter(zip, articleData) {
  const chapter1 = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeXml(articleData.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <h1>${escapeXml(articleData.title)}</h1>
  ${articleData.author ? `<p><em>By ${escapeXml(articleData.author)}</em></p>` : ''}
  ${articleData.publishDate ? `<p><em>${escapeXml(formatDate(articleData.publishDate))}</em></p>` : ''}
  <hr/>
  ${articleData.htmlContent}
</body>
</html>`;
  
  zip.file('OEBPS/chapter1.xhtml', chapter1);
}