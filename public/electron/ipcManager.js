const {ipcMain} = require('electron');
const {logout, missingCalendarIntegration} = require('./app');
const {isUserLoggedIn} = require('./session');
const {closeAllWindows, loadWindowAfterInit, openOnboardingWindow, openMyDayWindow, processInitContext} = require('./windowManager');
const {reloadMenubarContextMenu} = require('./menuBar');
const {GoogleAuthFlow} = require('./googleAuthFlow');
const {scheduleReloadUSetupDayState} = require('./scheduler');
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

/** My day **/
ipcMain.on('setup-my-day-done', async (event, arg) => {
    closeAllWindows();
    await reloadMenubarContextMenu();
    scheduleReloadUSetupDayState();
});

/** Integrations **/
ipcMain.on('missing-calendar-integration', async () => {
    await missingCalendarIntegration();
});
ipcMain.on('add-calendar-integration-success', async () => {
    closeAllWindows();
    await openMyDayWindow();
});