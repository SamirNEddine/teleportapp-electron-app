const {ipcMain} = require('electron');
const {logout} = require('./app');
const {isUserLoggedIn} = require('./session');
const {closeAllWindows, loadWindowAfterInit, openOnboardingWindow, openMyDayWindow, processInitContext} = require('./windowManager');
const {reloadMenubarContextMenu} = require('./menuBar');
const {GoogleAuthFlow} = require('./googleAuthFlow');

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
ipcMain.on('connect-google', async (event, arg) => {
    if(isUserLoggedIn()){
        const googleAuthFlow = new GoogleAuthFlow();
        await googleAuthFlow.fetchServiceConfiguration();
        await googleAuthFlow.makeAuthorizationRequest();
    }
});

/** Integrations **/
ipcMain.on('missing-calendar-integration', async () => {
    closeAllWindows();
    await openOnboardingWindow();
});
ipcMain.on('add-calendar-integration-success', async () => {
    closeAllWindows();
    await openMyDayWindow();
});