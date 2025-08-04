# Sub-to-Pub

A Chrome extension and backend service for converting Substack articles to EPUB format.

## Repository Structure

This is a monorepo containing two main components:

```
sub-to-pub/
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
The backend service handles email-based article conversion (coming soon).

See [backend/README.md](backend/README.md) for backend-specific documentation.

## Getting Started

### Full Repository Setup
```bash
# Clone the entire repository
git clone https://github.com/the-o-space/sub-to-pub.git
cd sub-to-pub

# Setup both components
./scripts/setup-all.sh
```

### Working with Individual Components

#### Extension Only (Git Sparse Checkout)
```bash
# Clone repository without checking out files
git clone --no-checkout https://github.com/the-o-space/sub-to-pub.git
cd sub-to-pub

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
git clone --no-checkout https://github.com/the-o-space/sub-to-pub.git
cd sub-to-pub

# Enable sparse checkout
git sparse-checkout init --cone

# Select only backend directory
git sparse-checkout set backend

# Checkout the files
git checkout main
```

## Documentation

- [Backend API Specification](docs/BACKEND_API_SPEC.md)

## License

This project is licensed under the MIT License.