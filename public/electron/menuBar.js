const {Menu, Tray, globalShortcut} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const
{
    isUserLoggedIn,
    hasSetupDay,
    clearLocalStorage,
    simulateRefreshToken,
    simulateRefreshTokenFailure
} = require('./session');
const isDev = require('electron-is-dev');

let menuBar = null;

/** Menubar actions **/
const _quit = function(){
    require('./app').quitApp();
};
const _openMyDay = async function () {
    await require('./windowManager').loadWindowAfterInit();
};
const _signIn = async function () {
    await require('./windowManager').openSignWindow();
};
const _signOut = async function () {
    await require('./app').logout();
};
const _openMyCurrentStatus = async function () {
    await require('./windowManager').openCurrentStatusWindow();
};
const _openPreferencesWindow = async function () {
    await require('./windowManager').openPreferencesWindow();
};

/** Menubar internals **/
const buildContextMenu = async function() {
    const items = [];
    if(isUserLoggedIn()){
        const hasSetupDayToday = await hasSetupDay();
        items.push({ label: 'Setup my day', type: 'normal', enabled: !hasSetupDayToday, click() { _openMyDay() } });
        items.push({ label: 'My current status', type: 'normal', enabled: true, click() { _openMyCurrentStatus() } });
        items.push({ type: 'separator' });
        items.push({ label: 'Sign out', type: 'normal', click() { _signOut() } });
    }else {
        items.push({ label: 'Sign in', type: 'normal', click() { _signIn() } });
    }

    if(isDev){
        items.push({ type: 'separator' });
        if(isUserLoggedIn()){
            items.push({ label: 'Dev - Clear local storage', type: 'normal', click() { clearLocalStorage(); _signOut() } });
            items.push({ label: 'Dev - Simulate refresh token', type: 'normal', click() { simulateRefreshToken() } });
            items.push({ label: 'Dev - Simulate refresh token failure', type: 'normal', click() { simulateRefreshTokenFailure()  } });
        }
    }
    items.push({ type: 'separator' });
    items.push({ label: 'Preferences...', type: 'normal', click() { _openPreferencesWindow() } });
    items.push({ type: 'separator' });
    items.push( { label: 'Quit', type: 'normal', click() { _quit() } });
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

const loadMenubar =  function () {
    return new Promise(async (resolve, reject) => {
        if(!menuBar){
            const iconPath = path.join(__dirname, '../', 'IconTemplate.png');
            const tray = new Tray(iconPath);
            tray.setContextMenu(await buildContextMenu());
            menuBar = menubar({
                tray
            });
            addMenubarListeners();

        }
        resolve();
    });
};
const reloadMenubarContextMenu = async function () {
    menuBar.tray.setContextMenu( await buildContextMenu());
};

/** Exports **/
module.exports.loadMenubar = loadMenubar;
module.exports.reloadMenubarContextMenu = reloadMenubarContextMenu;