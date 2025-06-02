const { generateZippedFiles } = require('./zipper');
const { getZipName } = require('./zipname');
const { getInfo } = require('./info');
const { removeDSStore } = require('./remove-ds');

module.exports = {
    generateZippedFiles,
    getZipName,
    getInfo,
    removeDSStore
};