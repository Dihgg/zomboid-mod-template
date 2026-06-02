const path = require("path");
const os = require("os");
const fs = require("fs-extra");
const { getInfo, distPath } = require("./utils");

const deployPlaytest = async () => {
	const { name } = getInfo();
	const dist = distPath();

	const modsPath = path.join(os.homedir(), "Zomboid", "mods");
	const modPath = path.join(modsPath, name);

	if (!(await fs.pathExists(dist))) {
		console.error(`Built mod folder not found at ${dist}. Run npm run build first.`);
		process.exit(1);
	}

	if (await fs.pathExists(modPath)) {
		await fs.remove(modPath);
		console.info(`Removed existing ${name} folder at: ${modPath}`);
	}

	await fs.ensureDir(modPath);
	await fs.copy(dist, modPath);
	console.info(`Deployed ${name} to: ${modPath}`);
};

deployPlaytest().catch(err => {
	console.error("Error during playtest deployment:", err);
	process.exit(1);
});
