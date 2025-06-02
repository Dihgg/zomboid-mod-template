const { readdirSync, copySync } = require('fs-extra');
const { join } = require('path');
const { isMatch } = require('micromatch');
const { getInfo } = require('./info');

const EXCLUDE_PATTERNS = [
    'node_modules',
    'contents',
    'scripts',
    'dev',
    '*.md',
    'package*',
    '.git*',
    '.nvm*',
    '*.zip',
    '*.code-workspace'
];

function shouldInclude(filePath) {
    return !isMatch(filePath, EXCLUDE_PATTERNS);
}

async function generateZippedFiles(outputDir) {
    // Copy files directly into the output directory
    const { id } = getInfo();
    const distPath = join(process.cwd(), 'dist', id);
    const files = readdirSync(distPath);
    files
        .filter(shouldInclude)
        .forEach(file => {
            const srcPath = join(distPath, file);
            const destPath = join(outputDir, file);            
            copySync(srcPath, destPath);
        });
}

module.exports = { generateZippedFiles };