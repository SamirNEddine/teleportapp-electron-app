const {Menu, Tray, globalShortcut} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const
{
    isUserLoggedIn,
    hasSetupDay,
    completelyClearLocalStorage,
    simulateRefreshToken,
    simulateRefreshTokenFailure
} = require('./session');
const isDev = require('electron-is-dev');
const i18n = require('./i18n');
const {trackEvent, Events} = require('./analytics');

let menuBar = null;

/** Menubar actions **/
const _quit = function(){
    trackEvent(Events.APP_QUIT, {}, true, function () {
        require('./app').quitApp();
    });
};
const _openMyDay = async function () {
    await require('./windowManager').loadWindowAfterInit();
    trackEvent(Events.SETUP_MY_DAY_OPENED);
};
const _signIn = async function () {
    await require('./windowManager').openSignWindow();
    trackEvent(Events.SIGN_IN_OPENED);
};
const _signOut = async function () {
    trackEvent(Events.APP_LOGGED_OUT, {}, true, async function () {
        await require('./app').logout();
    });
};
const _openMyCurrentStatus = async function () {
    await require('./windowManager').openCurrentStatusWindow();
    trackEvent(Events.CURRENT_STATUS_OPENED);
};
const _openPreferencesWindow = async function () {
    await require('./windowManager').openPreferencesWindow();
    trackEvent(Events.PREFERENCES_OPENED);
};

/** Menubar internals **/
const buildContextMenu = async function() {
    const items = [];
    if(isUserLoggedIn()){
        const hasSetupDayToday = await hasSetupDay();
        items.push({ label: i18n.t('Setup my day', 'Setup my day', {ns: 'Menubar'}), type: 'normal', enabled: !hasSetupDayToday, click() { _openMyDay() } });
        items.push({ label: i18n.t('My current status', 'My current status', {ns: 'Menubar'}), type: 'normal', enabled: true, click() { _openMyCurrentStatus() } });
        items.push({ type: 'separator' });
        items.push({ label: i18n.t('Sign out', 'Sign out', {ns: 'Menubar'}), type: 'normal', click() { _signOut() } });
    }else {
        items.push({ label: i18n.t('Sign in', 'Sign in', {ns: 'Menubar'}), type: 'normal', click() { _signIn() } });
    }

    if(isDev){
        items.push({ type: 'separator' });
        if(isUserLoggedIn()){
            items.push({ label: 'Dev - Clear local storage', type: 'normal', click() { completelyClearLocalStorage(); _signOut() } });
            items.push({ label: 'Dev - Simulate refresh token', type: 'normal', click() { simulateRefreshToken() } });
            items.push({ label: 'Dev - Simulate refresh token failure', type: 'normal', click() { simulateRefreshTokenFailure()  } });
        }
    }
    items.push({ type: 'separator' });
    items.push({ label: i18n.t('Preferences', 'Preferences...', {ns: 'Menubar'}), type: 'normal', click() { _openPreferencesWindow() } });
    items.push({ type: 'separator' });
    items.push( { label: i18n.t('Quit', 'Quit', {ns: 'Menubar'}), type: 'normal', click() { _quit() } });
    return Menu.buildFromTemplate(items);
};

const addMenubarListeners = function () {
    if(menuBar){
        menuBar.on('ready',async () => {
            // Register a 'CommandOrControl+X' shortcut listener.
            const ret = globalShortcut.register('Option+Shift+T', async () => {
                await _openMyCurrentStatus();
            });
            if (!ret) {
                console.log('registration failed')
            }
        });

    }
};

const loadMenubar =  async function () {
    if(!menuBar){
        await i18n.loadNamespaces('Menubar', async function () {
            if(!menuBar){
                const iconPath = path.join(__dirname, '../', 'IconTemplate.png');
                const tray = new Tray(iconPath);
                tray.setContextMenu(await buildContextMenu());
                menuBar = menubar({
                    tray
                });
                addMenubarListeners();
            }
        });
    }
};
const reloadMenubarContextMenu = async function () {
    if(menuBar){
        menuBar.tray.setContextMenu( await buildContextMenu());
    }
};
const isMenubarReady = function () {
    return menuBar !== null;
};

/** Exports **/
module.exports.loadMenubar = loadMenubar;
module.exports.reloadMenubarContextMenu = reloadMenubarContextMenu;
module.exports.isMenubarReady = isMenubarReady;