const {BrowserWindow, shell} = require('electron');
const {getPreloadJSPath, getAppURL} = require('./app');
const isDev = require('electron-is-dev');
const {isUserLoggedIn} = require('./session');
const electronLocalshortcut = require('electron-localshortcut');

const currentDisplayedWindows = {};

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
    window.on('close',  () => {
        delete  currentDisplayedWindows[path];
    });
    electronLocalshortcut.register(window, 'Esc', () => {
        window.close();
    });
    return window;
};

/** Sign in Window **/
//Constants
const SIGN_IN_WINDOW_WIDTH = 400;
const SIGN_IN_WINDOW_HEIGHT = 200;
const SIGN_IN_WINDOW_PATH = 'sign-in';
const openSignWindow = async function () {
    if(!currentDisplayedWindows[SIGN_IN_WINDOW_PATH]){
        currentDisplayedWindows[SIGN_IN_WINDOW_PATH] = await _createWindow(SIGN_IN_WINDOW_PATH, SIGN_IN_WINDOW_WIDTH, SIGN_IN_WINDOW_HEIGHT, true);
    }
    currentDisplayedWindows[SIGN_IN_WINDOW_PATH].show();
};

/** My Day Window **/
//Constants
const MY_DAY_WINDOW_WIDTH = 690;
const MY_DAY_WINDOW_HEIGHT = 420;
const MY_DAY_WINDOW_PATH = 'my-day-setup';
const openMyDayWindow = async function () {
    if(!currentDisplayedWindows[MY_DAY_WINDOW_PATH]){
        currentDisplayedWindows[MY_DAY_WINDOW_PATH] = await _createWindow(MY_DAY_WINDOW_PATH, MY_DAY_WINDOW_WIDTH, MY_DAY_WINDOW_HEIGHT, true);
    }
    currentDisplayedWindows[MY_DAY_WINDOW_PATH].show();
    currentDisplayedWindows[MY_DAY_WINDOW_PATH].setContentSize(MY_DAY_WINDOW_WIDTH, MY_DAY_WINDOW_HEIGHT);
};
/** Onboarding Window **/
//Constants
const ONBOARDING_WINDOW_WIDTH = 650;
const ONBOARDING_WINDOW_HEIGHT = 450;
const ONBOARDING_WINDOW_PATH = 'calendar-integration';
const openOnboardingWindow = async function () {
    if(!currentDisplayedWindows[ONBOARDING_WINDOW_PATH]){
        currentDisplayedWindows[ONBOARDING_WINDOW_PATH] = await _createWindow(ONBOARDING_WINDOW_PATH, ONBOARDING_WINDOW_WIDTH, ONBOARDING_WINDOW_HEIGHT, true);
    }
    currentDisplayedWindows[ONBOARDING_WINDOW_PATH].show();
};

/** Helper methods **/
const loadWindowAfterInit = async function() {
    if(isUserLoggedIn()) {
        await openMyDayWindow();
    }else {
        await openSignWindow();
    }
};
const closeAllWindows = function() {
    for(const path in currentDisplayedWindows){
        if(currentDisplayedWindows.hasOwnProperty(path)){
            currentDisplayedWindows[path].close();
            delete currentDisplayedWindows[path];
        }
    }
};
const sendMessageToRenderedContent = function(message, data) {
    for(const path in currentDisplayedWindows){
        if(currentDisplayedWindows.hasOwnProperty(path)){
            currentDisplayedWindows[path].webContents.send(message, data);
        }
    }
};

/** Exports **/
module.exports.loadWindowAfterInit = loadWindowAfterInit;
module.exports.openSignWindow = openSignWindow;
module.exports.openMyDayWindow = openMyDayWindow;
module.exports.openOnboardingWindow = openOnboardingWindow;
module.exports.closeAllWindows = closeAllWindows;
module.exports.sendMessageToRenderedContent = sendMessageToRenderedContent;