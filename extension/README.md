# Sub-to-Pub Chrome Extension

A Chrome extension that converts web articles from Substack and other platforms to EPUB (pub) format for offline reading. Works with Substack, LessWrong, and other platforms using similar markup structures.

## Features

- One-click export of articles to EPUB format
- Works with multiple platforms:
  - Substack (`div.body.markup`)
  - LessWrong (`div#postBody`)
  - Other compatible sites
- Preserves article formatting and metadata
- **Downloads and embeds images directly into the EPUB file**
- Includes article title, author, and publication date
- Clean, readable EPUB output
- No popup interface - just click the extension icon
- Automatic download to your default Downloads folder

## Installation

### Prerequisites

- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- npm (comes with Node.js)

### Quick Setup (Recommended)

```bash
./setup.sh
```

This script will:
- Install npm dependencies
- Download the JSZip library
- Build the extension using esbuild

### Manual Setup

1. Clone this repository or download the source code
2. Install dependencies:
   ```bash
   npm install
   ```
3. Download JSZip library:
   ```bash
   mkdir -p libs
   curl -o libs/jszip.min.js https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
   ```
4. Build the extension:
   ```bash
   npm run build
   ```
5. Open Chrome and navigate to `chrome://extensions/`
6. Enable "Developer mode" in the top right corner
7. Click "Load unpacked" and select the `dist` directory (not the root directory)
8. The extension icon will appear in your Chrome toolbar

## Usage

1. Navigate to a supported article:
   - Substack articles (e.g., astralcodexten.com)
   - LessWrong posts (lesswrong.com)
   - Other sites with compatible markup
2. Click the extension icon in your toolbar
3. The EPUB file will be generated and downloaded automatically to your Downloads folder

## Technical Details

The extension extracts content from web articles by:
- Finding supported article containers:
  - `div.body.markup` (Substack and similar)
  - `div#postBody` (LessWrong)
- Extracting the page title from the `<title>` tag
- **Downloading all images and embedding them in the EPUB**
- Converting the content to EPUB format using proper XHTML structure
- Detecting author information from various selector patterns
- Using data URLs for Manifest V3 service worker compatibility
- Robust HTML-to-XHTML conversion to ensure valid EPUB files
- Properly escapes special characters in URLs and attributes for XML compliance
- Storing images in the EPUB's Images folder with proper manifest entries

## File Structure

```
Sub-to-Pub/
├── src/                    # Source code (modular)
│   ├── background/         # Background script modules
│   │   ├── index.js       # Main background logic
│   │   ├── epub-generator.js
│   │   ├── epub-templates.js
│   │   └── image-downloader.js
│   ├── content/           # Content script modules
│   │   ├── index.js       # Main content logic
│   │   ├── dom-cleaner.js
│   │   ├── html-converter.js
│   │   └── metadata-extractor.js
│   └── utils/             # Shared utilities
│       ├── xml.js
│       └── helpers.js
├── dist/                  # Built files (generated)
│   ├── background.js
│   └── content.js
├── icons/                 # Extension icons
├── libs/                  # External libraries
│   └── jszip.min.js      # (not included, see installation)
├── manifest.json         # Chrome extension manifest
├── package.json          # Node.js dependencies and scripts
├── build.js              # esbuild configuration
└── setup.sh              # Setup script

## Limitations

- Only works on supported article structures:
  - `div.body.markup` (Substack)
  - `div#postBody` (LessWrong)
- Requires manual installation of JSZip library
- Some complex formatting may not be perfectly preserved
- No visual feedback during export (check browser downloads)
- Some images may fail to download due to CORS restrictions

## Development

### Build System

The extension uses **esbuild** for fast, modern JavaScript bundling. The source code is organized using ES6 modules with proper imports/exports.

### Available Commands

```bash
npm run build   # Build the extension
npm run watch   # Build and watch for changes
npm run clean   # Clean the dist directory
```

### Development Workflow

1. Run the watch command to automatically rebuild on changes:
   ```bash
   npm run watch
   ```
2. Edit files in the `src/` directory
3. The extension will automatically rebuild
4. Reload the extension in Chrome (`chrome://extensions/`)
5. Test your changes

### Project Structure

- **Source files**: All source code uses ES6 modules
  - `src/background/` - Background service worker code
  - `src/content/` - Content script for article extraction
  - `src/utils/` - Shared utilities
- **Build output**: The `dist/` directory contains the built extension
- **Dependencies**: Managed via npm, bundled with esbuild

### Adding New Features

When adding new functionality:
1. Create new modules using ES6 import/export syntax
2. Import them in the appropriate entry point (`background/index.js` or `content/index.js`)
3. The build system will automatically bundle all dependencies

Example:
```javascript
// src/utils/new-feature.js
export function myNewFeature() {
  // ...
}

// src/background/index.js
import { myNewFeature } from '../utils/new-feature.js';
```

## License

MIT License