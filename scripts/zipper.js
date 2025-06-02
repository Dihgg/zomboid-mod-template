const {join} = require('path');
const { tmpdir } = require('os');
const { getZipName, generateZippedFiles, removeDSStore, getInfo } = require('./utils');
const { ensureDirSync, createWriteStream, removeSync } = require('fs-extra');

const archiver = require('archiver');

const createZip = async () => {
	const {name} = getInfo();
	const tempDir = join(tmpdir(), `${name}-zip-temp`);
	const projectFolder = join(tempDir, name);
	const outputZip = getZipName();
	
	ensureDirSync(projectFolder);

	await generateZippedFiles(projectFolder);

	removeDSStore(tempDir);

	const output = createWriteStream(outputZip);
	const archive = archiver('zip', {  zlib : { level: 9 } });

	archive.pipe(output);
	archive.directory(projectFolder, name);
	await archive.finalize();

	removeSync(tempDir);
};

createZip()
.catch(err => {
	console.error('Error preparing zip file:', err);
})