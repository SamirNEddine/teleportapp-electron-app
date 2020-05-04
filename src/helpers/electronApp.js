let app = null;

export const setElectronApp = function (electronApp) {
    app = electronApp;
};
export const logout = async function() {
    await app.logout();
};
export const missingCalendarIntegration = async function() {
    await app.missingCalendarIntegration()
};

export default app;
