const path = require("path");
const fs = require("fs-extra");
const { srcPath, distPath, copyFolder, moveFolder, getInfo, patchPipeWrenchLua } = require("./utils");

const copyBuild42JsonTranslations = async (outputPath, locale = "EN") => {
	const sourceDir = srcPath(`src/translations-json/${locale}`);
	if (!(await fs.pathExists(sourceDir))) {
		console.info(`No src/translations-json/${locale} found; skipping Build 42 json translations.`);
		return;
	}

	await fs.ensureDir(path.join(outputPath, locale));
	const translationFiles = await fs.readdir(sourceDir);

	for (const file of translationFiles) {
		const json = await fs.readJSON(path.join(sourceDir, file));
		const sortedTranslations = new Map(Object.entries(json).sort());
		await fs.writeJson(path.join(outputPath, locale, file), Object.fromEntries(sortedTranslations), { spaces: 4 });
	}

	console.info(`${locale} Build 42 translations copied successfully.`);
};

const run = async () => {
	try {
		const { id } = getInfo();

		const generatedDistPath = path.join(process.cwd(), "dist", id);
		if (generatedDistPath !== distPath()) {
			await moveFolder(generatedDistPath, distPath());
		} else {
			console.warn(`Generated dist path ${generatedDistPath} is the same as target dist path ${distPath()}. Skipping move.`);
		}

		await copyFolder(srcPath("src/root"), distPath());
		await copyFolder(srcPath("src/root"), distPath("42"));

		if (await fs.pathExists(distPath("mod.info"))) {
			await fs.copy(distPath("mod.info"), distPath("42/mod.info"));
		}

		if (await fs.pathExists(distPath("media"))) {
			await moveFolder(distPath("media"), distPath("42/media"));
		}

		await copyFolder(srcPath("src/media"), distPath("42/media"));
		await copyFolder(srcPath("src/ui"), distPath("42/media/ui"));
		await copyBuild42JsonTranslations(distPath("42/media/lua/shared/Translate"));

		await patchPipeWrenchLua(distPath("42"));
		console.info("PipeWrench Lua files patched.");
	} catch (err) {
		console.error("Error copying files:", err);
		process.exitCode = 1;
	}
};

run();
