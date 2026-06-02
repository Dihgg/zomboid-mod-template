const cliProgress = require("cli-progress");

const createProgressBar = (options = {}) => {
	const { format, unit = "items" } = options;
	return new cliProgress.SingleBar({
		format: format || `Progress |{bar}| {percentage}% | {value}/{total} ${unit}`,
		barCompleteChar: "#",
		barIncompleteChar: "-",
		hideCursor: true
	});
};

const startProgressBar = (total, options = {}) => {
	if (!Number.isFinite(total) || total <= 0) {
		return null;
	}

	const progressBar = createProgressBar(options);
	progressBar.start(total, 0);
	return progressBar;
};

const stopProgressBar = progressBar => {
	if (progressBar) {
		progressBar.stop();
	}
};

module.exports = {
	createProgressBar,
	startProgressBar,
	stopProgressBar
};
