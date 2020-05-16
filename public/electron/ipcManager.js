const {ipcMain} = require('electron');
const {logout, missingCalendarIntegration} = require('./app');
const {isUserLoggedIn} = require('./session');
const {closeAllWindows, loadWindowAfterInit, openMyDayWindow, openChangeStatusDropdownWindow, hideWindowWithPath, sendMessageToWindowWithPath} = require('./windowManager');
const {reloadMenubarContextMenu} = require('./menuBar');
const {GoogleAuthFlow} = require('./googleAuthFlow');
const {scheduleReloadSetupDayState, scheduleDailySetup} = require('./scheduler');
/** Auth **/
ipcMain.on('auth-failed', async (event, arg) => {
    await logout();
});
ipcMain.on('signin-success', async (event, arg) => {
    if(isUserLoggedIn()){
        closeAllWindows();
        await loadWindowAfterInit();
        await reloadMenubarContextMenu();
        await scheduleReloadSetupDayState();
        await scheduleDailySetup();
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
});

/** Integrations **/
ipcMain.on('missing-calendar-integration', async () => {
    await missingCalendarIntegration();
});
ipcMain.on('add-calendar-integration-success', async () => {
    closeAllWindows();
    await openMyDayWindow();
});

/** Current status **/
ipcMain.on('display-change-status-dropdown-window', async (event, leftMargin, numberOfOptions) => {
    await openChangeStatusDropdownWindow(leftMargin, numberOfOptions);
});
ipcMain.on('force-hide-change-status-dropdown', () => {
    hideWindowWithPath('change-current-status');
});
ipcMain.on('update-current-availability', (event, newAvailability) => {
    hideWindowWithPath('change-current-status');
    sendMessageToWindowWithPath('current-status', 'update-current-availability', newAvailability);
});
ipcMain.on('current-availability-updated', () => {
    sendMessageToWindowWithPath('change-current-status', 'current-availability-updated');
});

/** Preferences **/
ipcMain.on('daily-setup-time-changed', async () => {
    await scheduleDailySetup();
});