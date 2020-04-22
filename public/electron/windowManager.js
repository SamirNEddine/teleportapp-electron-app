const {BrowserWindow, shell} = require('electron');
const {getPreloadJSPath, getAppURL} = require('./app');
const isDev = require('electron-is-dev');
const {isUserLoggedIn} = require('./session');
const electronLocalshortcut = require('electron-localshortcut');

const currentDisplayedWindows = {};

/** Common **/
const _createWindow = async function(windowURL, width, height, frameLess=false){
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
            preload: getPreloadJSPath(),
            webSecurity: false
        }
    });
    await window.loadURL(windowURL);
    if (isDev) {
        window.webContents.openDevTools();
    }
    //Open external urls externally
    window.webContents.on('will-navigate', async (event, url) => {
        if(url !== windowURL){
            event.preventDefault();
            await shell.openExternal(url);
        }
    });
    window.on('close',  () => {
        delete  currentDisplayedWindows[windowURL];
    });
    electronLocalshortcut.register(window, 'Esc', () => {
        window.close();
    });
    return window;
};
const _openWindow = async function(path, width, height, frameLess) {
    const windowURL =  `${getAppURL()}/${path}`;
    if(!currentDisplayedWindows[windowURL]){
        currentDisplayedWindows[windowURL] = await _createWindow(windowURL, width, height, frameLess);
    }
    currentDisplayedWindows[windowURL].show();
};

/** Sign in Window **/
//Constants
const SIGN_IN_WINDOW_WIDTH = 400;
const SIGN_IN_WINDOW_HEIGHT = 200;
const SIGN_IN_WINDOW_PATH = 'sign-in';
const openSignWindow = async function () {
    await _openWindow(SIGN_IN_WINDOW_PATH, SIGN_IN_WINDOW_WIDTH, SIGN_IN_WINDOW_HEIGHT, true);
};

/** My Day Window **/
//Constants
const MY_DAY_WINDOW_WIDTH = 690;
const MY_DAY_WINDOW_HEIGHT = 420;
const MY_DAY_WINDOW_PATH = 'my-day-setup';
const openMyDayWindow = async function () {
    await _openWindow(MY_DAY_WINDOW_PATH, MY_DAY_WINDOW_WIDTH, MY_DAY_WINDOW_HEIGHT, true);
};
/** Onboarding Window **/
//Constants
const ONBOARDING_WINDOW_WIDTH = 650;
const ONBOARDING_WINDOW_HEIGHT = 450;
const ONBOARDING_WINDOW_PATH = 'calendar-integration';
const openOnboardingWindow = async function () {
    await _openWindow(ONBOARDING_WINDOW_PATH, ONBOARDING_WINDOW_WIDTH, ONBOARDING_WINDOW_HEIGHT, true);
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
    for(const url in currentDisplayedWindows){
        if(currentDisplayedWindows.hasOwnProperty(url)){
            currentDisplayedWindows[url].close();
            delete currentDisplayedWindows[url];
        }
    }
};
const sendMessageToRenderedContent = function(message, data) {
    for(const url in currentDisplayedWindows){
        if(currentDisplayedWindows.hasOwnProperty(url)){
            currentDisplayedWindows[url].webContents.send(message, data);
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