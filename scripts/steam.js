const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const { copyFolder, getInfo, extractFrontMatterData, markdownToBbcode } = require("./utils");

/**
 * Generate workshop.txt from workshop.md.
 * @param {string} workshopMdPath
 * @param {string} outputTxtPath
 */
async function generateWorkshopTxt(workshopMdPath, outputTxtPath) {
	if (!(await fs.pathExists(workshopMdPath))) {
		console.warn(`workshop.md not found at ${workshopMdPath}. Skipping workshop.txt generation.`);
		return null;
	}

	const { version } = getInfo();
	const workshopMd = await fs.readFile(workshopMdPath, "utf8");
	const { extracted, content } = extractFrontMatterData(workshopMd, {
		id: "string",
		title: "string",
		tags: "array",
		visibility: "string"
	});

	const { id, title, tags, visibility } = extracted;
	const description = markdownToBbcode(content);

	const workshopTxt = [
		`version=${version}`,
		`id=${id}`,
		`title=${title}`,
		`description=${description}`,
		`tags=${tags}`,
		`visibility=${visibility}`
	].join("\n");

	await fs.writeFile(outputTxtPath, `${workshopTxt}\n`, "utf8");
	console.info(`Generated workshop.txt at ${outputTxtPath}`);
}

/**
 * Creates steam workshop folder payload at ~/Zomboid/Workshop/{modName}
 */
async function prepareSteam() {
	const { name } = getInfo();
	const tempPath = path.join(os.tmpdir(), `${name}-temp`);
	const modPath = path.join(tempPath, "contents", "mods");
	const workshopPath = path.join(os.homedir(), "Zomboid", "Workshop", name);

	await fs.ensureDir(modPath);

	const previewCandidates = [
		path.join(process.cwd(), "steam", "preview.png"),
		path.join(process.cwd(), "contents", "preview.png")
	];
	const previewPath = (await Promise.all(previewCandidates.map(candidate => fs.pathExists(candidate))))
		.findIndex(Boolean);
	if (previewPath >= 0) {
		await fs.copy(previewCandidates[previewPath], path.join(tempPath, "preview.png"));
	} else {
		console.warn("No preview image found in steam/preview.png or contents/preview.png");
	}

	const generatedWorkshopPath = path.join(tempPath, "workshop.txt");
	await generateWorkshopTxt(path.join(process.cwd(), "steam", "workshop.md"), generatedWorkshopPath);

	if (!(await fs.pathExists(generatedWorkshopPath))) {
		const legacyWorkshopTxt = path.join(process.cwd(), "contents", "workshop.txt");
		if (await fs.pathExists(legacyWorkshopTxt)) {
			await fs.copy(legacyWorkshopTxt, generatedWorkshopPath);
			console.info("Using legacy contents/workshop.txt");
		}
	}

	await copyFolder(path.join(process.cwd(), "dist"), modPath);

	if (await fs.pathExists(workshopPath)) {
		await fs.remove(workshopPath);
		console.info(`Removed existing ${name} folder at: ${workshopPath}`);
	}

	await fs.ensureDir(workshopPath);
	await copyFolder(tempPath, workshopPath);

	console.info(`Steam workshop files prepared at: ${workshopPath}`);
	await fs.remove(tempPath);
}

prepareSteam().catch(err => {
	console.error("Error preparing Steam zip file:", err);
	process.exitCode = 1;
});
