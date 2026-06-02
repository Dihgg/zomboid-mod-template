const getLocale = language => {
	switch (language.toLowerCase()) {
		case "pt":
			return "PTBR";
		case "zh":
			return "CN";
		default:
			return language.toUpperCase();
	}
};

module.exports = {
	getLocale
};
