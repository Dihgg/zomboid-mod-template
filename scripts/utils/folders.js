const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const { startProgressBar, stopProgressBar } = require("./progressBar");
const { getInfo } = require("./info");

const removeDSStore = dir => {
	fs.readdirSync(dir).forEach(file => {
		const filePath = path.join(dir, file);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			removeDSStore(filePath);
		} else if (file === ".DS_Store") {
			fs.unlinkSync(filePath);
		}
	});
};

const optimizeImage = async (srcFilePath, destFilePath) => {
	try {
		const ext = path.extname(srcFilePath).toLowerCase();
		const image = sharp(srcFilePath);
		if (ext === ".png") {
			await image.png({ quality: 80, compressionLevel: 9 }).toFile(destFilePath);
		} else if ([".jpg", ".jpeg"].includes(ext)) {
			await image.jpeg({ quality: 80 }).toFile(destFilePath);
		}
	} catch (error) {
		console.error(`Failed to optimize image ${srcFilePath}:`, error);
	}
};

const gatherAllFiles = async dir => {
	const items = await fs.readdir(dir, { withFileTypes: true });
	const filePaths = [];

	for (const item of items) {
		const fullPath = path.join(dir, item.name);
		if (item.isDirectory()) {
			const subFiles = await gatherAllFiles(fullPath);
			filePaths.push(...subFiles);
		} else {
			filePaths.push(fullPath);
		}
	}
	return filePaths;
};

const copyAndOptimizeRecursive = async (srcDir, destDir, progressBar) => {
	const items = await fs.readdir(srcDir, { withFileTypes: true });
	await fs.ensureDir(destDir);

	for (const item of items) {
		const srcFilePath = path.join(srcDir, item.name);
		const destFilePath = path.join(destDir, item.name);

		if (item.isDirectory()) {
			await copyAndOptimizeRecursive(srcFilePath, destFilePath, progressBar);
		} else {
			const ext = path.extname(item.name).toLowerCase();
			const isImage = [".png", ".jpg", ".jpeg"].includes(ext);

			if (isImage) {
				await optimizeImage(srcFilePath, destFilePath);
			} else {
				await fs.copy(srcFilePath, destFilePath);
			}

			if (progressBar) {
				progressBar.increment();
			}
		}
	}
};

const copyFolder = async (fromPath, toPath) => {
	if (!fs.existsSync(fromPath)) {
		return;
	}

	const allFiles = await gatherAllFiles(fromPath);
	const progressBar = startProgressBar(allFiles.length, { unit: "files" });
	await copyAndOptimizeRecursive(fromPath, toPath, progressBar);
	removeDSStore(toPath);
	stopProgressBar(progressBar);
};

const moveFolder = async (fromPath, toPath) => {
	await fs.move(fromPath, toPath, { overwrite: true });
};

const srcPath = dirPath => path.join(process.cwd(), dirPath);

const distPath = (dirPath = "") => {
	const { name } = getInfo();
	return path.join(process.cwd(), "dist", name, dirPath);
};

module.exports = {
	copyFolder,
	moveFolder,
	srcPath,
	distPath
};
