require = require("esm")(module);
const {
    shouldLaunchAtLogin
} = require('../../src/helpers/localStorage');

const shouldAddToLoginItems = function () {
    return shouldLaunchAtLogin();
};

module.exports.shouldAddToLoginItems = shouldAddToLoginItems;