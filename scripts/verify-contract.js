import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
console.log('Validating repository contracts at:', rootDir);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. package.json exists at repository root
const pkgPath = path.join(rootDir, 'package.json');
assert(fs.existsSync(pkgPath), 'package.json exists at root');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
assert(pkg.dependencies?.react && pkg.dependencies?.['react-dom'], 'React and react-dom are dependencies in package.json');

// 2. README.md exists and contains required sections
const readmePath = path.join(rootDir, 'README.md');
assert(fs.existsSync(readmePath), 'README.md exists at root');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

assert(readmeContent.includes('Architecture') || readmeContent.includes('Architectural Overview'), 'README includes System Architecture');
assert(readmeContent.includes('Tech Stack') || readmeContent.includes('Technology Stack'), 'README includes Tech Stack');
assert(readmeContent.includes('Features') || readmeContent.includes('Core Features'), 'README includes Features');
assert(readmeContent.includes('Testing') || readmeContent.includes('Automated Testing'), 'README includes Testing Strategy');
assert(readmeContent.includes('Getting Started') || readmeContent.includes('Local Development'), 'README includes Getting Started instructions');
assert(!readmeContent.toLowerCase().includes('.png)') && !readmeContent.toLowerCase().includes('.jpg)'), 'README contains no screenshots');
assert(!readmeContent.includes('Blessy') && !readmeContent.includes('partnr'), 'README contains no personal/platform-specific user details');

// 3. .gitignore ignores node_modules/
const gitignorePath = path.join(rootDir, '.gitignore');
assert(fs.existsSync(gitignorePath), '.gitignore exists');
const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
assert(gitignoreContent.includes('node_modules'), '.gitignore explicitly ignores node_modules');

// 4. Source code files check
const appPath = path.join(rootDir, 'src', 'App.jsx');
const canvasPath = path.join(rootDir, 'src', 'components', 'Canvas.jsx');
const toolbarPath = path.join(rootDir, 'src', 'components', 'Toolbar.jsx');
const galleryPath = path.join(rootDir, 'src', 'components', 'Gallery.jsx');

assert(fs.existsSync(appPath), 'src/App.jsx exists');
assert(fs.existsSync(canvasPath), 'src/components/Canvas.jsx exists');
assert(fs.existsSync(toolbarPath), 'src/components/Toolbar.jsx exists');
assert(fs.existsSync(galleryPath), 'src/components/Gallery.jsx exists');

// 5. Check required data-testid attributes
const canvasContent = fs.readFileSync(canvasPath, 'utf8');
const toolbarContent = fs.readFileSync(toolbarPath, 'utf8');
const galleryContent = fs.readFileSync(galleryPath, 'utf8');

assert(canvasContent.includes('data-testid="drawing-canvas"'), 'Canvas component includes data-testid="drawing-canvas"');
assert(canvasContent.includes('window.getCanvasDataURL'), 'Canvas exposes window.getCanvasDataURL helper');
assert(toolbarContent.includes('data-testid="tool-pen"'), 'Toolbar includes data-testid="tool-pen"');
assert(toolbarContent.includes('data-testid="tool-eraser"'), 'Toolbar includes data-testid="tool-eraser"');
assert(toolbarContent.includes('data-testid="tool-line"'), 'Toolbar includes data-testid="tool-line"');
assert(toolbarContent.includes('data-testid="tool-rectangle"'), 'Toolbar includes data-testid="tool-rectangle"');
assert(toolbarContent.includes('data-testid="color-picker"'), 'Toolbar includes data-testid="color-picker"');
assert(toolbarContent.includes('data-testid="brush-size-slider"'), 'Toolbar includes data-testid="brush-size-slider"');
assert(toolbarContent.includes('data-testid="clear-canvas-button"'), 'Toolbar includes data-testid="clear-canvas-button"');
assert(toolbarContent.includes('data-testid="undo-button"'), 'Toolbar includes data-testid="undo-button"');
assert(toolbarContent.includes('data-testid="save-storage-button"'), 'Toolbar includes data-testid="save-storage-button"');
assert(toolbarContent.includes('data-testid="export-png-button"'), 'Toolbar includes data-testid="export-png-button"');
assert(galleryContent.includes('data-testid="gallery-container"'), 'Gallery includes data-testid="gallery-container"');
assert(galleryContent.includes('data-testid={`gallery-item-${index}`}'), 'Gallery includes data-testid="gallery-item-*" indexing');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
