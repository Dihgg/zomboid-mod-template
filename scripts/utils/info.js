const { readFileSync } = require('fs-extra');
const { join } = require('path');

const getInfo = () => {
	const {name, version} = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
	const {modInfo} = JSON.parse(readFileSync(join(process.cwd(), 'pipewrench.json'), 'utf-8'));
	
	return {
		id: modInfo.id,
		name,
		version
	}
};

module.exports = {
	getInfo
};