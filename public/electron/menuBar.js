const {Menu, Tray} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const {isUserLoggedIn} = require('./session');
const {quitApp, logout} = require('./app');

require = require("esm")(module);
const {getUserHasSetupDay} = require('./graphql');

let menuBar = null;

/** Menubar actions **/
const _quit = function(){
    quitApp();
};
const _openMyDay = async function () {
    await require('./windowManager').loadWindowAfterInit();
};
const _signIn = async function () {
    await require('./windowManager').openSignWindow();
};
const _signOut = async function () {
    await logout();
};

/** Menubar internals **/
const buildContextMenu = async function(availabilityJustScheduled) {
    let enableMyDayMenu = false;
    if(isUserLoggedIn()){
        if(!availabilityJustScheduled){
            try{
                enableMyDayMenu = !await getUserHasSetupDay();
            }catch (e) {
                enableMyDayMenu = true;
            }
        }
    }
    return Menu.buildFromTemplate([
        { label: 'Setup my day', type: 'normal', enabled: enableMyDayMenu, click() { _openMyDay() } },
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
const reloadMenubarContextMenu = async function (availabilityJustScheduled=false) {
    menuBar.tray.setContextMenu( await buildContextMenu(availabilityJustScheduled));
};

/** Exports **/
module.exports.loadMenubar = loadMenubar;
module.exports.reloadMenubarContextMenu = reloadMenubarContextMenu;