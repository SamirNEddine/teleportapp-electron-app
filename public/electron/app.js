require('dotenv').config();
const {app, powerMonitor, globalShortcut} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const {clearCurrentSession} = require('./session');
const {shouldAddToLoginItems} = require('./localPreferences');
const {scheduleReloadSetupDayState, scheduleDailySetup, stopAllTimers} = require('./scheduler');

//Auto Update
if (!isDev){
    require('./autoUpdate').config();
}
/** App Configuration **/
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
//URL Scheme
app.setAsDefaultProtocolClient('teleport');

/** App Events **/
app.on('ready', async () => {
    await require('./menuBar').loadMenubar();//Workaround for circular include issue
    await require('./windowManager').loadWindowAfterInit();//Workaround for circular include issue
    await scheduleReloadSetupDayState();
    await scheduleDailySetup();
    updateLoginItem();

    //OS Events
    powerMonitor.on('suspend', () => {
        console.log('The system is going to sleep, stop all timers');
        stopAllTimers();
    });
    powerMonitor.on('unlock-screen', async () => {
        console.log('The system waking up, resume timers if needed');
        await scheduleReloadSetupDayState();
        await scheduleDailySetup(false);
    });
});
app.on('window-all-closed', (event) => {
    event.preventDefault();
});
app.on('will-quit', () => {
    globalShortcut.unregisterAll()
});
app.on('open-url', function (event, uri) {
    event.preventDefault();
    const url = new URL(uri);
    //Auth
    if(url.href.includes('/slack/auth')){
        require('./windowManager').sendMessageToRenderedContent('sign-in-with-slack-success', url.searchParams.get('code'));//Workaround for circular include issue
    }
});

/** Public methods **/
const quitApp = function() {
    app.quit();
};
const getPreloadJSPath = function() {
    return path.join(__dirname, '../', 'preload.js');
};
const getAppURL = function() {
    return isDev ? 'http://localhost:3001/index.html' : `file://${path.join(__dirname, '../index.html')}`;
};
const logout = async function() {
    clearCurrentSession();
    stopAllTimers();
    await require('./windowManager').closeAllWindows();//Workaround for circular include issue
    await require('./windowManager').openSignWindow();//Workaround for circular include issue
    setTimeout( async () => {
        //Workaround to avoid reloading menubar when it's not already built. Happens when refresh token fails at app launch.
        await require('./menuBar').reloadMenubarContextMenu();//Workaround for circular include issue
    }, 100);
};
const missingCalendarIntegration = async function() {
    await require('./windowManager').openMissingCalendarWindow();
};
function updateLoginItem() {
    if (!isDev){
        app.setLoginItemSettings({
            openAtLogin: shouldAddToLoginItems()
        });
    }
    if(shouldAddToLoginItems()) {
        console.log('Login item enabled');
    }else{
        console.log('Login item disabled');
    }
}

/** Exports **/
module.exports.quitApp = quitApp;
module.exports.getPreloadJSPath = getPreloadJSPath;
module.exports.getAppURL = getAppURL;
module.exports.logout = logout;
module.exports.missingCalendarIntegration = missingCalendarIntegration;
module.exports.updateLoginItem = updateLoginItem;

//Workaround to use some shared code between electron and react
require = require("esm")(module);
const {setElectronApp} = require('../../src/helpers/electronApp');
setElectronApp(module.exports);