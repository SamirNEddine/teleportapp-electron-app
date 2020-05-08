const {Menu, Tray} = require('electron');
const path = require('path');
const {menubar} = require('menubar');
const {isUserLoggedIn, hasSetupDay} = require('./session');

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
    items.push({ type: 'separator' });
    items.push( { label: 'Quit', type: 'normal', click() { _quit() } });
    return Menu.buildFromTemplate(items);
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
const reloadMenubarContextMenu = async function () {
    menuBar.tray.setContextMenu( await buildContextMenu());
};

/** Exports **/
module.exports.loadMenubar = loadMenubar;
module.exports.reloadMenubarContextMenu = reloadMenubarContextMenu;