const {BrowserWindow, shell} = require('electron');
const {getPreloadJSPath, getAppURL} = require('./app');
const isDev = require('electron-is-dev');
const {isUserLoggedIn, isOnBoarded} = require('./session');
const {scheduleReloadUSetupDayState} = require('./scheduler');
const electronLocalshortcut = require('electron-localshortcut');

const currentDisplayedWindows = {};

require = require("esm")(module);
const {getUserIsOnBoarded, getUserHasSetupDay} = require('./graphql');

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
        useContentSize: true,
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
    const windowURL =  `${getAppURL()}/#${path}`;
    if(!currentDisplayedWindows[windowURL]){
        currentDisplayedWindows[windowURL] = await _createWindow(windowURL, width, height, frameLess);
    }
    currentDisplayedWindows[windowURL].show();
};

/** Sign in Window **/
//Constants
const SIGN_IN_WINDOW_WIDTH = 360;
const SIGN_IN_WINDOW_HEIGHT = 300;
const SIGN_IN_WINDOW_PATH = 'sign-in';
const openSignWindow = async function () {
    await _openWindow(SIGN_IN_WINDOW_PATH, SIGN_IN_WINDOW_WIDTH, SIGN_IN_WINDOW_HEIGHT, true);
};

/** My Day Window **/
//Constants
const MY_DAY_WINDOW_WIDTH = 650;
const MY_DAY_WINDOW_HEIGHT = 420;
const MY_DAY_WINDOW_PATH = 'my-day-setup';
const openMyDayWindow = async function () {
    await _openWindow(MY_DAY_WINDOW_PATH, MY_DAY_WINDOW_WIDTH, MY_DAY_WINDOW_HEIGHT, true);
};
/** Onboarding Window **/
//Constants
const ONBOARDING_WINDOW_WIDTH = 700;
const ONBOARDING_WINDOW_HEIGHT = 440;
const ONBOARDING_WINDOW_PATH = 'onboarding';
const openOnboardingWindow = async function () {
    await _openWindow(ONBOARDING_WINDOW_PATH, ONBOARDING_WINDOW_WIDTH, ONBOARDING_WINDOW_HEIGHT, true);
};
/****/
const MISSING_CALENDAR_WINDOW_WIDTH = 700;
const MISSING_CALENDAR_WINDOW_HEIGHT = 440;
const MISSING_CALENDAR_WINDOW_PATH = 'missing-calendar-integration';
const openMissingCalendarWindow = async function () {
    await _openWindow(MISSING_CALENDAR_WINDOW_PATH, MISSING_CALENDAR_WINDOW_WIDTH, MISSING_CALENDAR_WINDOW_HEIGHT, true);
};

/** Helper methods **/
const loadWindowAfterInit = async function() {
    try {
        if(isUserLoggedIn()) {
            let onBoarded = await getUserIsOnBoarded();
            if (onBoarded === 'unknown'){
                onBoarded = await getUserIsOnBoarded();
            }
            if(!onBoarded) {
                await openOnboardingWindow();
            }else{
                if(! await getUserHasSetupDay()){
                    await openMyDayWindow();
                }else{
                    scheduleReloadUSetupDayState();
                }
            }
        }else {
            await openSignWindow();
        }
    }catch(e){
        console.debug(e.message)
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
const processInitContext = async function(initContext) {
    closeAllWindows();
    const {onBoarded} = initContext;
    if(onBoarded) {
        await openMyDayWindow();
    }else{
        await openOnboardingWindow();
    }
};

/** Exports **/
module.exports.loadWindowAfterInit = loadWindowAfterInit;
module.exports.openSignWindow = openSignWindow;
module.exports.openMyDayWindow = openMyDayWindow;
module.exports.openOnboardingWindow = openOnboardingWindow;
module.exports.closeAllWindows = closeAllWindows;
module.exports.sendMessageToRenderedContent = sendMessageToRenderedContent;
module.exports.processInitContext = processInitContext;
module.exports.openMissingCalendarWindow = openMissingCalendarWindow;