const { readdirSync, unlinkSync, statSync } = require('fs-extra');
const { join } = require('path');
const removeDSStore = dir => {
    readdirSync(dir).forEach(file => {
        const filePath = join(dir, file);
        const stats = statSync(filePath);

        if (stats.isDirectory()) {
            removeDSStore(filePath);
        } else if (file === '.DS_Store') {
            unlinkSync(filePath);
        }
    });
};

module.exports = {
	removeDSStore
};