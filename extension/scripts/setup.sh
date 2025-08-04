#!/bin/bash

echo "Setting up Sub-to-Pub Chrome Extension..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if libs directory exists
if [ ! -d "libs" ]; then
    mkdir -p libs
fi

# Download JSZip if not present (still needed for service worker)
if [ ! -f "libs/jszip.min.js" ]; then
    echo ""
    echo "📥 Downloading JSZip library..."
    if command -v wget &> /dev/null; then
        wget -q https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js -O libs/jszip.min.js
    elif command -v curl &> /dev/null; then
        curl -s https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js -o libs/jszip.min.js
    else
        echo "❌ Error: Neither wget nor curl is installed."
        echo "Please download JSZip manually:"
        echo "URL: https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
        echo "Save it as: libs/jszip.min.js"
        exit 1
    fi
    echo "✅ JSZip downloaded successfully!"
else
    echo "✅ JSZip already present"
fi

# Build the extension
echo ""
echo "🔨 Building extension..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "To install the extension in Chrome:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' in the top right"
echo "3. Click 'Load unpacked' and select the 'dist' directory"
echo ""
echo "For development:"
echo "  npm run build   - Build the extension"
echo "  npm run watch   - Build and watch for changes"
echo "  npm run clean   - Clean the dist directory"