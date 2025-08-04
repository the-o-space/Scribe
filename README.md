# Scribe

A Chrome extension and backend service for converting Substack articles to EPUB format.

## Repository Structure

This is a monorepo containing two main components:

```
scribe/
├── extension/          # Chrome extension for capturing articles
├── backend/            # Email backend service (coming soon)
├── docs/               # Shared documentation
└── scripts/            # Shared scripts
```

## Components

### Chrome Extension
The Chrome extension allows users to convert Substack articles directly from their browser into EPUB format.

See [extension/README.md](extension/README.md) for extension-specific documentation.

### Backend Service
The backend service handles email-based article conversion (NOT IMPLEMENTED YET).

See [backend/README.md](backend/README.md) for backend-specific documentation.

## Installing extension

1. Download the latest release .zip file from [the-o-space/scribe/releases](https://github.com/the-o-space/scribe/releases)
2. Unzip the file and open your favourite chormium browser
3. Navigate to `chrome://extensions/`
4. Enable Developer Mode
5. Click "Load unpacked" and select the unzipped extension folder
6. You should see the extension icon in the Chrome toolbar
7. Navigate to any article on the supported sites and click the extension icon to convert the article to EPUB

## Getting Started

### Full Repository Setup
```bash
# Clone the entire repository
git clone https://github.com/the-o-space/scribe.git
cd scribe

# Setup both components
./scripts/setup-all.sh
```

### Working with Individual Components

#### Extension Only (Git Sparse Checkout)
```bash
# Clone repository without checking out files
git clone --no-checkout https://github.com/the-o-space/scribe.git
cd scribe

# Enable sparse checkout
git sparse-checkout init --cone

# Select only extension directory
git sparse-checkout set extension

# Checkout the files
git checkout main
```

#### Backend Only (Git Sparse Checkout)
```bash
# Clone repository without checking out files
git clone --no-checkout https://github.com/the-o-space/scribe.git
cd scribe

# Enable sparse checkout
git sparse-checkout init --cone

# Select only backend directory
git sparse-checkout set backend

# Checkout the files
git checkout main
```

## License

This project is licensed under the MIT License.