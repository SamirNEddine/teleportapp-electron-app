const {app} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const {clearCurrentSession} = require('./session');

/** App Configuration **/
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
//URL Scheme
app.setAsDefaultProtocolClient('teleport');

/** App Events **/
app.on('ready', async () => {
    await require('./menuBar').loadMenubar();//Workaround for circular include issue
    await require('./windowManager').loadWindowAfterInit();//Workaround for circular include issue
});
app.on('window-all-closed', (event) => {
    event.preventDefault();
});
app.on('will-quit', () => {
});
app.on('open-url', function (event, uri) {
    event.preventDefault();
});

/** Public methods **/
const quitApp = function() {
    app.quit();
};
const getPreloadJSPath = function() {
    return path.join(app.getAppPath(), 'preload.js')
};
const getAppURL = function() {
    return isDev ? 'http://localhost:3001' : `file://${path.join(__dirname, '../build/index.html')}`;
};
const logout = async function() {
    await require('./windowManager').closeAllWindows();//Workaround for circular include issue
    clearCurrentSession();
    await require('./menuBar').reloadMenubarContextMenu();//Workaround for circular include issue
    await require('./windowManager').openSignWindow();//Workaround for circular include issue
};

/** Exports **/
module.exports.quitApp = quitApp;
module.exports.getPreloadJSPath = getPreloadJSPath;
module.exports.getAppURL = getAppURL;
module.exports.logout = logout;