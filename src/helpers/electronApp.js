let electronApp = null;

const setElectronApp = function (app) {
    electronApp = app;
};

module.exports.setElectronApp = setElectronApp;
module.exports.app = electronApp;