const {ensureDirSync, existsSync, readdirSync, copySync, createWriteStream, removeSync} = require('fs-extra');
const { join } = require('path');
const { tmpdir } = require('os');
const archiver = require('archiver');
const { generateZippedFiles, getZipName, getInfo, removeDSStore } = require('./utils');

async function prepareSteamZip() {
    const { name } = getInfo()
    const tempDir = join(tmpdir(), `${name}-steam-temp`);
    const projectFolder = join(tempDir, name); // Root folder for the project
    const contentsFolder = join(projectFolder, 'contents');
    const modsFolder = join(contentsFolder, 'mods', name); // Place mods inside contents
    const outputZip = getZipName();

    // Ensure folder structure in temp directory
    ensureDirSync(modsFolder);

    // Generate files using zipper.js directly into the mods folder
    await generateZippedFiles(modsFolder);

    // Copy items from the source contents folder to the generated contents folder
    const originalContentsFolder = join(process.cwd(), 'contents');
    if (existsSync(originalContentsFolder)) {
        readdirSync(originalContentsFolder).forEach(file => {
            const srcPath = join(originalContentsFolder, file);
            const destPath = join(projectFolder, file);
            copySync(srcPath, destPath);
        });
    }

    // Remove .DS_Store files from the temp directory
    removeDSStore(tempDir);

    // Create zip
    const output = createWriteStream(outputZip);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        console.info(`${outputZip} has been created.`);
    });

    archive.pipe(output);
    archive.directory(projectFolder, name); // Include the project folder as the root
    await archive.finalize();

    // Clean up temporary folders
    removeSync(tempDir);
}

prepareSteamZip()
.catch(err => {
    console.error('Error preparing Steam zip file:', err);
});