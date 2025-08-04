#!/bin/bash

echo "Setting up Scribe monorepo..."
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Setup extension
if [ -d "$ROOT_DIR/extension" ]; then
    echo "Setting up Chrome extension..."
    cd "$ROOT_DIR/extension"
    if [ -f "setup.sh" ]; then
        ./setup.sh
    else
        echo "⚠️  Extension setup script not found"
    fi
    cd "$ROOT_DIR"
    echo ""
fi

# Setup backend
if [ -d "$ROOT_DIR/backend" ]; then
    echo "Setting up backend service..."
    cd "$ROOT_DIR/backend"
    if [ -f "setup.sh" ]; then
        ./setup.sh
    elif [ -f "package.json" ]; then
        echo "Installing backend dependencies..."
        npm install
    else
        echo "⚠️  Backend not yet implemented"
    fi
    cd "$ROOT_DIR"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  - Extension: cd extension && ./build.sh"
echo "  - Backend: cd backend && npm start (when implemented)"