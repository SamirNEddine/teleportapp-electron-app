const {BrowserWindow, shell} = require('electron');
const {getPreloadJSPath, getAppURL} = require('./app');
const isDev = require('electron-is-dev');
const {isUserLoggedIn} = require('./session');


/** Common **/
const _createWindow = async function(path, width, height, frameLess=false){
    const window = new BrowserWindow({
        width: width,
        height: height,
        show: false,
        fullscreenable: false,
        movable: true,
        minimizable: false,
        maximizable: false,
        resizable: false,
        alwaysOnTop: true,
        closable: true,
        frame: !frameLess,
        showOnAllWorkspaces: true,
        webPreferences: {
            nodeIntegration: true,
            preload: getPreloadJSPath()
        }
    });
    await window.loadURL(`${getAppURL()}/${path}`);
    if (isDev) {
        window.webContents.openDevTools();
    }
    //Open external urls externally
    window.webContents.on('will-navigate', async (event, url) => {
        if(url !== window.getURL()){
            event.preventDefault();
            await shell.openExternal(url);
        }
    });

    return window;
};

/** Sign in Window **/
//Constants
const SIGN_IN_WINDOW_WIDTH = 400;
const SIGN_IN_WINDOW_HEIGHT = 200;
const SIGN_IN_WINDOW_PATH = 'sign-in';
let _signInWindow = null;
const openSignWindow = async function () {
    if(!_signInWindow){
        _signInWindow = await _createWindow(SIGN_IN_WINDOW_PATH, SIGN_IN_WINDOW_WIDTH, SIGN_IN_WINDOW_HEIGHT, true);
    }
   _signInWindow.show();
};

/** Sign in Window **/
//Constants
const MY_DAY_WINDOW_WIDTH = 650;
const MY_DAY_WINDOW_HEIGHT = 55;
const MY_DAY_WINDOW_PATH = 'search-contacts';
let _myDayWindow = null;
const openMyDayWindow = async function () {
    if(!_myDayWindow){
        _myDayWindow = await _createWindow(MY_DAY_WINDOW_PATH, MY_DAY_WINDOW_WIDTH, MY_DAY_WINDOW_HEIGHT, true);
    }
    _myDayWindow.show();
};

/** Helper methods **/
const loadWindowAfterInit = async function() {
    if(isUserLoggedIn()) {
        await openMyDayWindow();
    }else {
        await openSignWindow();
    }
};

/** Exports **/
module.exports.loadWindowAfterInit = loadWindowAfterInit;
module.exports.openSignWindow = openSignWindow;
module.exports.openMyDayWindow = openMyDayWindow;