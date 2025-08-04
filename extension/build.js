const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const watch = process.argv.includes('--watch');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy static files
function copyStaticFiles() {
  // Copy manifest.json
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  // Update paths to remove 'dist/' prefix since files will be in dist
  manifest.background.service_worker = 'background.js';
  fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
  
  // Copy icons
  if (!fs.existsSync('dist/icons')) {
    fs.mkdirSync('dist/icons');
  }
  fs.readdirSync('icons').forEach(file => {
    fs.copyFileSync(`icons/${file}`, `dist/icons/${file}`);
  });
  
  // Copy libs
  if (!fs.existsSync('dist/libs')) {
    fs.mkdirSync('dist/libs');
  }
  fs.readdirSync('libs').forEach(file => {
    fs.copyFileSync(`libs/${file}`, `dist/libs/${file}`);
  });
  
  console.log('✅ Static files copied');
}

// Base build configuration
const baseBuildOptions = {
  bundle: true,
  format: 'iife',
  target: 'chrome90',
  logLevel: 'info',
  sourcemap: false
};

// Background script build options
const backgroundBuildOptions = {
  ...baseBuildOptions,
  entryPoints: ['src/background/index.js'],
  outfile: 'dist/background.js',
  banner: {
    js: `// Sub-to-Pub Chrome Extension
// Import JSZip for Manifest V3 service worker
importScripts("libs/jszip.min.js");
`
  }
};

// Content script build options
const contentBuildOptions = {
  ...baseBuildOptions,
  entryPoints: ['src/content/index.js'],
  outfile: 'dist/content.js',
  banner: {
    js: '// Sub-to-Pub Chrome Extension\n'
  }
};

async function build() {
  console.log('🔨 Building Sub-to-Pub Chrome Extension...\n');
  
  try {
    // Copy static files first
    copyStaticFiles();
    
    // Build background script
    console.log('📦 Building background script...');
    await esbuild.build(backgroundBuildOptions);
    
    // Build content script
    console.log('📦 Building content script...');
    await esbuild.build(contentBuildOptions);
    
    console.log('\n✅ Build complete!');
    console.log('\nFiles created in dist/ directory:');
    listDistFiles('dist');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

function listDistFiles(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      console.log(`${prefix}📁 ${file}/`);
      listDistFiles(filePath, prefix + '  ');
    } else {
      console.log(`${prefix}📄 ${file}`);
    }
  });
}

// Watch mode
if (watch) {
  console.log('👀 Watch mode enabled...\n');
  
  // Copy static files initially
  copyStaticFiles();
  
  // Set up esbuild watch
  Promise.all([
    esbuild.context(backgroundBuildOptions).then(ctx => ctx.watch()),
    esbuild.context(contentBuildOptions).then(ctx => ctx.watch())
  ]).then(() => {
    console.log('Watching for changes...');
  });
  
  // Watch for static file changes
  fs.watch('.', { recursive: true }, (eventType, filename) => {
    if (filename && (
      filename.startsWith('icons/') ||
      filename.startsWith('libs/') ||
      filename === 'manifest.json'
    )) {
      console.log(`\n📝 ${filename} changed, copying static files...`);
      copyStaticFiles();
    }
  });
} else {
  // Regular build
  build();
}