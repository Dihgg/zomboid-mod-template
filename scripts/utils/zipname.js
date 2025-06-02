const { getInfo } = require('./info');

const getZipName = () => {
    const {name, version} = getInfo()
    return `${name}-${version}.zip`;
};

module.exports = {
    getZipName
};