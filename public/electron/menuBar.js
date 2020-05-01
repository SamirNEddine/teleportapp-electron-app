const {Menu, Tray} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const {isUserLoggedIn} = require('./session');
const {quitApp, logout} = require('./app');
const {openSignWindow, loadWindowAfterInit} = require('./windowManager');

let menuBar = null;

/** Menubar actions **/
const _quit = function(){
    quitApp();
};
const _toggleTeleport = async function () {
    await loadWindowAfterInit();
};
const _signIn = async function () {
    await openSignWindow();
};
const _signOut = async function () {
    await logout();
};

/** Menubar internals **/
const buildContextMenu = function() {
    return Menu.buildFromTemplate([
        { label: 'Toggle Teleport', type: 'normal', enabled: isUserLoggedIn(), click() { _toggleTeleport() } },
        { type: 'separator' },
        isUserLoggedIn() ? { label: 'Sign out', type: 'normal', click() { _signOut() } } : { label: 'Sign in', type: 'normal', click() { _signIn() } },
        { type: 'separator' },
        { label: 'Quit', type: 'normal', click() { _quit() } },
    ]);
};

const addMenubarListeners = function () {
    if(menuBar){
        menuBar.on('ready', () => {
            //
            // //Preload search window
            // if(isUserLoggedIn()){
            //     mainWindow = createSearchWindow();
            //     mainWindow.show();
            // }else {
            //     signInWindow = createSignInWindow();
            //     signInWindow.show();
            // }
            //
            // //Register Teleport shortcut
            // const ret = globalShortcut.register('Option+Shift+T', () => {
            //     toggleTeleport();
            // });
            // if (!ret) {
            //     console.log('registration failed')
            // }
            // // Check whether a shortcut is registered.
            // console.log(globalShortcut.isRegistered('Option+Shift+T'))
        });

    }
};

const loadMenubar = function () {
    return new Promise((resolve, reject) => {
        if(!menuBar){
            const iconPath = path.join(__dirname, '../', 'IconTemplate.png');
            const tray = new Tray(iconPath);
            tray.setContextMenu(buildContextMenu());
            menuBar = menubar({
                tray
            });
            addMenubarListeners();

        }
        resolve();
    });
};
const reloadMenubarContextMenu = function () {
    menuBar.tray.setContextMenu(buildContextMenu());
};

/** Exports **/
module.exports.loadMenubar = loadMenubar;
module.exports.reloadMenubarContextMenu = reloadMenubarContextMenu;