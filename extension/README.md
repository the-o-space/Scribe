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

### Quick Setup (Recommended)

```bash
./setup.sh
```

This script will automatically download JSZip and create necessary files.

### Manual Setup

1. Clone this repository or download the source code
2. Download JSZip library:
   - Download `jszip.min.js` from https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
   - Create a `libs` folder in the extension directory
   - Place `jszip.min.js` in the `libs` folder
3. Create icon files (see ICONS_NOTE.md)
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" in the top right corner
6. Click "Load unpacked" and select the extension directory
7. The extension icon will appear in your Chrome toolbar

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
├── build.sh             # Build script
└── setup.sh             # Setup script

## Limitations

- Only works on supported article structures:
  - `div.body.markup` (Substack)
  - `div#postBody` (LessWrong)
- Requires manual installation of JSZip library
- Some complex formatting may not be perfectly preserved
- No visual feedback during export (check browser downloads)
- Some images may fail to download due to CORS restrictions

## Development

### Building the Extension

The source code is organized in modular files under `src/`. To build:

```bash
./build.sh
```

This will:
- Concatenate the modular source files
- Generate `dist/background.js` and `dist/content.js`
- Update `manifest.json` to use the built files

### Development Workflow

1. Edit files in the `src/` directory
2. Run `./build.sh` to rebuild
3. Reload the extension in Chrome (`chrome://extensions/`)
4. Test your changes

### Adding New Features

- Background functionality: Add to `src/background/`
- Content extraction: Add to `src/content/`
- Shared utilities: Add to `src/utils/`

## License

MIT License