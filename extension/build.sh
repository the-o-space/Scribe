#!/bin/bash

echo "Building Sub-to-Pub Chrome Extension..."
echo ""

# Ensure dist directory exists
mkdir -p dist

# Function to concatenate files
concat_files() {
    local output=$1
    shift
    local files=("$@")
    
    echo "// Generated file - do not edit directly" > "$output"
    echo "// Built on $(date)" >> "$output"
    echo "" >> "$output"
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            echo "// --- Start of $file ---" >> "$output"
            # Remove import/export statements and append
            sed -e '/^import /d' -e 's/^export //g' "$file" >> "$output"
            echo "" >> "$output"
            echo "// --- End of $file ---" >> "$output"
            echo "" >> "$output"
        fi
    done
}

# Build content script
echo "Building content script..."
concat_files "dist/content.js" \
    "src/utils/xml.js" \
    "src/utils/helpers.js" \
    "src/content/dom-cleaner.js" \
    "src/content/metadata-extractor.js" \
    "src/content/html-converter.js" \
    "src/content/index.js"

# Build background script  
echo "Building background script..."
concat_files "dist/background.js" \
    "src/utils/xml.js" \
    "src/utils/helpers.js" \
    "src/background/image-downloader.js" \
    "src/background/epub-templates.js" \
    "src/background/epub-generator.js" \
    "src/background/index.js"

# Add JSZip import to the beginning of background.js
sed -i.bak '3i\
// Import JSZip at the top level for Manifest V3 compatibility\
importScripts("libs/jszip.min.js");\
' dist/background.js
rm dist/background.js.bak

# Copy additional required files
echo "Copying manifest.json..."
cp manifest.json dist/

# Update manifest.json paths in dist
sed -i.bak 's|"dist/background.js"|"background.js"|g' dist/manifest.json
rm dist/manifest.json.bak

# Copy icons directory
echo "Copying icons..."
cp -r icons dist/

# Copy libs directory
echo "Copying libs..."
cp -r libs dist/

# List all files in dist
echo ""
echo "✅ Build complete!"
echo ""
echo "Files created in dist/ directory:"
find dist -type f | sort