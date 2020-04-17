const {ipcMain} = require('electron');
const {logout} = require('./app');
const {isUserLoggedIn} = require('./session');
const {closeAllWindows, loadWindowAfterInit, openOnboardingWindow} = require('./windowManager');
const {reloadMenubarContextMenu} = require('./menuBar');

/** Auth **/
ipcMain.on('auth-failed', async (event, arg) => {
    await logout();
});
ipcMain.on('signin-success', async (event, arg) => {
    if(isUserLoggedIn()){
        closeAllWindows();
        await loadWindowAfterInit();
        reloadMenubarContextMenu();
    }
});

/** Integrations **/
ipcMain.on('missing-calendar-integration', async () => {
    closeAllWindows();
    await openOnboardingWindow();
});