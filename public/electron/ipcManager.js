const {ipcMain} = require('electron');
const {logout, missingCalendarIntegration, updateLoginItem} = require('./app');
const {isUserLoggedIn} = require('./session');
const {closeAllWindows,
    loadWindowAfterInit,
    openChangeStatusDropdownWindow,
    hideWindowWithPath,
    sendMessageToWindowWithPath,
    calendarIntegrationSuccess
} = require('./windowManager');
const {reloadMenubarContextMenu} = require('./menuBar');
const {GoogleAuthFlow} = require('./googleAuthFlow');
const {scheduleReloadSetupDayState, scheduleDailySetup} = require('./scheduler');
const {updateLocalStorageFromServerIfNeeded}  = require('./session');
const {trackEvent, Events} = require('./analytics');

/** Auth **/
ipcMain.on('auth-failed', async (event, arg) => {
    await logout();
});
ipcMain.on('signin-success', async (event, arg) => {
    if(isUserLoggedIn()){
        trackEvent(Events.SIGN_IN_WITH_SLACK_SUCCESS);
        closeAllWindows();
        await updateLocalStorageFromServerIfNeeded();
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
    trackEvent(Events.SETUP_MY_DAY_CONFIRMED);
    closeAllWindows();
    await reloadMenubarContextMenu();
    setTimeout( () => {
        sendMessageToWindowWithPath('current-status', 'refetch-current-availability');
    }, 2*1000);

});

/** Integrations **/
ipcMain.on('missing-calendar-integration', async () => {
    trackEvent(Events.CALENDAR_INTEGRATION_MISSING);
    await missingCalendarIntegration();
});
ipcMain.on('add-calendar-integration-success', async () => {
    closeAllWindows();
    calendarIntegrationSuccess();
    await loadWindowAfterInit();
});

/** Current status **/
ipcMain.on('display-change-status-dropdown-window', async (event, leftMargin, numberOfOptions) => {
    await openChangeStatusDropdownWindow(leftMargin, numberOfOptions);
});
ipcMain.on('force-hide-change-status-dropdown', () => {
    hideWindowWithPath('change-current-status');
});
ipcMain.on('update-current-availability', (event, newAvailability, previousAvailability) => {
    hideWindowWithPath('change-current-status');
    sendMessageToWindowWithPath('current-status', 'update-current-availability', newAvailability);
    trackEvent(Events.CURRENT_STATUS_CHANGED, {from: previousAvailability, to: newAvailability});
});
ipcMain.on('current-availability-updated', () => {
    sendMessageToWindowWithPath('change-current-status', 'current-availability-updated');
});

/** Preferences **/
ipcMain.on('context-params-changed', () => {
    sendMessageToWindowWithPath('my-day-setup', 'context-params-changed')
});
ipcMain.on('daily-setup-time-changed', async () => {
    await scheduleDailySetup();
});
ipcMain.on('login-item-changed', () => {
    updateLoginItem();
});

/** Analytics **/
ipcMain.on('track-analytics-event', (_, event, properties={}) => {
    trackEvent(event, properties);
});
