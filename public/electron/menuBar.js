const {Menu, Tray} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const {isUserLoggedIn} = require('./session');
const {quitApp} = require('./app');

let menuBar = null;

/** Menubar actions **/
const _quit = function(){
    quitApp();
};
const _toggleTeleport = function () {
    console.log('Toggle Teleport');
};
const _signIn = function () {
    console.log('Sign in');
};
const _signOut = function () {
    console.log('Sign out');
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
            console.log('Menubar app is ready.');
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
            const iconPath = path.join(__dirname, '../..', 'assets', 'IconTemplate.png');
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

/** Exports **/
module.exports.loadMenubar = loadMenubar;