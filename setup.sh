#!/bin/bash

echo "Setting up Substack to EPUB Chrome Extension..."
echo ""

# Check if libs directory exists
if [ ! -d "libs" ]; then
    mkdir -p libs
fi

# Download JSZip if not present
if [ ! -f "libs/jszip.min.js" ]; then
    echo "Downloading JSZip library..."
    if command -v wget &> /dev/null; then
        wget -q https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js -O libs/jszip.min.js
    elif command -v curl &> /dev/null; then
        curl -s https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js -o libs/jszip.min.js
    else
        echo "Error: Neither wget nor curl is installed. Please download JSZip manually."
        echo "URL: https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
        echo "Save it as: libs/jszip.min.js"
        exit 1
    fi
    echo "JSZip downloaded successfully!"
else
    echo "JSZip already present."
fi

# Build the extension
echo ""
echo "Building extension..."
if [ -f "build.sh" ]; then
    ./build.sh
else
    echo "Warning: build.sh not found. You'll need to build manually."
fi

echo ""
echo "Setup complete!"
echo ""
echo "To install the extension in Chrome:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' in the top right"
echo "3. Click 'Load unpacked' and select this directory"
echo ""
echo "The extension is now ready to use!"