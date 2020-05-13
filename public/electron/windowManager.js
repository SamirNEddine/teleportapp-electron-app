const {BrowserWindow, shell} = require('electron');
const {screen} = require('electron');
const isDev = require('electron-is-dev');
const {isUserLoggedIn, isOnBoarded, hasSetupDay} = require('./session');
const electronLocalshortcut = require('electron-localshortcut');

const currentDisplayedWindows = {};


/** Constants **/
const POSITION_MIDDLE = 'middle';
const POSITION_TOP_RIGHT = 'top-right';
const POSITION_TOP_MIDDLE = 'top-middle';
const POSITION_TOP_LEFT = 'top-left';
const POSITION_RIGHT_OPTIMIZED = 'right-optimized';
const POSITION_TOP_OPTIMIZED = 'top-optimized';
const POSITION_CUSTOM = 'position-custom';
const SIGN_IN_WINDOW_PATH = 'sign-in';
const SIGN_IN_WINDOW_WIDTH = 240;
const SIGN_IN_WINDOW_HEIGHT = 274;
const MY_DAY_WINDOW_PATH = 'my-day-setup';
const MY_DAY_WINDOW_WIDTH = 680;
const MY_DAY_WINDOW_HEIGHT = 420;
const ONBOARDING_WINDOW_PATH = 'onboarding';
const ONBOARDING_WINDOW_WIDTH = 700;
const ONBOARDING_WINDOW_HEIGHT = 440;
const MISSING_CALENDAR_WINDOW_PATH = 'missing-calendar-integration';
const MISSING_CALENDAR_WINDOW_WIDTH = 700;
const MISSING_CALENDAR_WINDOW_HEIGHT = 440;
const CHANGE_STATUS_DROPDOWN_WINDOW_PATH = 'change-current-status';
const CHANGE_STATUS_DROPDOWN_WINDOW_WIDTH = 368;
const CHANGE_STATUS_DROPDOWN_WINDOW_HEIGHT = 87;
const CHANGE_STATUS_DROPDOWN_BOTTOM_MARGIN = 34;
const CURRENT_STATUS_WINDOW_PATH = 'current-status';
const CURRENT_STATUS_WINDOW_WIDTH = 240;
const CURRENT_STATUS_WINDOW_HEIGHT = 274;

/** Common **/
function _getScreenWidth() {
    const displays = screen.getAllDisplays();
    let width = 0;
    for(let i in displays) {
        width+= displays[i].bounds.width;
    }
    return width;
}
const _windowURLForPath = function (path) {
  return `${require('./app').getAppURL()}/#${path}`;
};
function _setWindowPosition(window, position) {
    switch (position.type) {
        case POSITION_TOP_RIGHT: {
            const [windowSize] = window.getSize();
            window.setPosition(_getScreenWidth() - windowSize,0);
            break;
        }
        case POSITION_TOP_MIDDLE: {
            const [windowSize] = window.getSize();
            window.setPosition(_getScreenWidth()/2 - windowSize/2,0);
            break;
        }
        case POSITION_TOP_LEFT: {
            window.setPosition(0,0);
            break;
        }
        case POSITION_RIGHT_OPTIMIZED: {
            const [windowSize] = window.getSize();
            window.setPosition(_getScreenWidth() - 2*windowSize , windowSize/2);
            break;
        }
        case POSITION_TOP_OPTIMIZED: {
            const [windowSize] = window.getSize();
            window.setPosition(_getScreenWidth()/2 - windowSize/2,windowSize/2);
            break;
        }
        case POSITION_CUSTOM: {
            const {coordinates} = position;
            window.setPosition(coordinates.x, coordinates.y);
        }
    }
}
 function _hideOrCloseWindow(window) {
    const windowURL = window.webContents.getURL();
     const path = windowURL.substring(windowURL.lastIndexOf('/') + 1).slice(0);
    switch (path) {
        case CHANGE_STATUS_DROPDOWN_WINDOW_PATH:
        case CURRENT_STATUS_WINDOW_PATH:
        {
            window.hide();
            break;
        }
        default:{
            window.close();
        }
    }
}
async function _cacheWindowOnCloseIfNeeded(windowURL) {
    const path = windowURL.substring(windowURL.lastIndexOf('/') + 1).slice(1);
    switch (path) {
        case CHANGE_STATUS_DROPDOWN_WINDOW_PATH:
        {
            await openChangeStatusDropdownWindow(0, 1,false);
            break;
        }
        case CURRENT_STATUS_WINDOW_PATH:
        {
            await openCurrentStatusWindow(false);
            break;
        }
        default:{}
    }
}
async function _createWindow(windowURL, width, height, frameLess=false, hasShadow=true, movable=true){
    const window = new BrowserWindow({
        width: width,
        height: height,
        show: false,
        fullscreenable: false,
        movable: movable,
        minimizable: false,
        maximizable: false,
        resizable: false,
        alwaysOnTop: true,
        closable: true,
        frame: !frameLess,
        showOnAllWorkspaces: true,
        useContentSize: true,
        hasShadow: hasShadow,
        webPreferences: {
            nodeIntegration: true,
            preload: require('./app').getPreloadJSPath(),
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
    window.on('close',  async () => {
        delete  currentDisplayedWindows[windowURL];
        await _cacheWindowOnCloseIfNeeded(windowURL);
    });
    electronLocalshortcut.register(window, 'Esc', () => {''
        _hideOrCloseWindow(window);
    });
    return window;
};
const _openWindow = async function(path, width, height, frameLess, position={type: POSITION_MIDDLE}, hasShadow, show=true, movable) {
    const windowURL =  _windowURLForPath(path);
    if(!currentDisplayedWindows[windowURL]){
        currentDisplayedWindows[windowURL] = await _createWindow(windowURL, width, height, frameLess, hasShadow, movable);
    }
    if(show){
        currentDisplayedWindows[windowURL].setSize(width, height);
        currentDisplayedWindows[windowURL].show();
    }
    _setWindowPosition(currentDisplayedWindows[windowURL], position);
};

/** Sign in Window **/
async function openSignWindow() {
    const coordinates = {x:_getScreenWidth()/2 - SIGN_IN_WINDOW_WIDTH/2, y:SIGN_IN_WINDOW_HEIGHT};
    await _openWindow(SIGN_IN_WINDOW_PATH, SIGN_IN_WINDOW_WIDTH, SIGN_IN_WINDOW_HEIGHT, true, {type: POSITION_CUSTOM, coordinates});
}
/** My Day Window **/
 async function openMyDayWindow() {
    const coordinates = {x:_getScreenWidth()/2 - MY_DAY_WINDOW_WIDTH/2, y:MY_DAY_WINDOW_HEIGHT/2.5};
    await _openWindow(MY_DAY_WINDOW_PATH, MY_DAY_WINDOW_WIDTH, MY_DAY_WINDOW_HEIGHT, true, {type: POSITION_CUSTOM, coordinates});
}
/** Onboarding Window **/
async function openOnboardingWindow() {
    await _openWindow(ONBOARDING_WINDOW_PATH, ONBOARDING_WINDOW_WIDTH, ONBOARDING_WINDOW_HEIGHT, true);
}
/** Missing Integration Window**/
const openMissingCalendarWindow = async function () {
    await _openWindow(MISSING_CALENDAR_WINDOW_PATH, MISSING_CALENDAR_WINDOW_WIDTH, MISSING_CALENDAR_WINDOW_HEIGHT, true);
};
/** Change Status Dropdown Window**/
const openChangeStatusDropdownWindow = async function (leftMargin=0, numberOfOptions=1, show=true) {
    const currentStatusWindowURL = _windowURLForPath(CURRENT_STATUS_WINDOW_PATH);
    const currentStatusWindow = currentDisplayedWindows[currentStatusWindowURL];
    if(currentStatusWindow){
        const isCached = currentDisplayedWindows[_windowURLForPath(CHANGE_STATUS_DROPDOWN_WINDOW_PATH)];
        let [x, y] = currentStatusWindow.getPosition();
        x += leftMargin;
        y += (CURRENT_STATUS_WINDOW_HEIGHT - CHANGE_STATUS_DROPDOWN_BOTTOM_MARGIN);
        const screenWidth = _getScreenWidth();
        if((x+CHANGE_STATUS_DROPDOWN_WINDOW_WIDTH) > screenWidth){
            x = screenWidth - CHANGE_STATUS_DROPDOWN_WINDOW_WIDTH;
        }
        await _openWindow(
            CHANGE_STATUS_DROPDOWN_WINDOW_PATH,
            CHANGE_STATUS_DROPDOWN_WINDOW_WIDTH,
            numberOfOptions*CHANGE_STATUS_DROPDOWN_WINDOW_HEIGHT,
            true,
            {type: POSITION_CUSTOM, coordinates: {x, y}},
            true,
             show,
            false
        );
        if(!isCached){
            const changeStatusWindowURL = _windowURLForPath(CHANGE_STATUS_DROPDOWN_WINDOW_PATH);
            const changeStatusWindow = currentDisplayedWindows[changeStatusWindowURL];
            changeStatusWindow.on('blur', function () {
                changeStatusWindow.hide();
            });
            changeStatusWindow.on('hide', function () {
                sendMessageToWindow(_windowURLForPath(CURRENT_STATUS_WINDOW_PATH), 'change-status-drop-down-closed');
            });
            changeStatusWindow.on('close', function () {
                sendMessageToWindow(_windowURLForPath(CURRENT_STATUS_WINDOW_PATH), 'change-status-drop-down-closed');
            });
        }
    }
};
/** Current Status Window**/
async function openCurrentStatusWindow(show=true) {
    await _openWindow(CURRENT_STATUS_WINDOW_PATH, CURRENT_STATUS_WINDOW_WIDTH, CURRENT_STATUS_WINDOW_HEIGHT, true, {type: POSITION_RIGHT_OPTIMIZED},true, show);
    await openChangeStatusDropdownWindow(0, 1,false);
};

/** Helper methods **/
const loadWindowAfterInit = async function() {
    if(isUserLoggedIn()) {
        if(! await isOnBoarded()) {
            await openOnboardingWindow();
        }else{
            if(! await hasSetupDay()){
                await openMyDayWindow();
            }
            //For better user experience, cache the window for faster display
            await openCurrentStatusWindow(false);
        }
    }else {
        await openSignWindow();
    }
}
function closeAllWindows() {
    for(const url in currentDisplayedWindows){
        if(currentDisplayedWindows.hasOwnProperty(url)){
            currentDisplayedWindows[url].close();
            delete currentDisplayedWindows[url];
        }
    }
}
function sendMessageToWindow(windowURL, message, data){
    if(currentDisplayedWindows[windowURL]){
        currentDisplayedWindows[windowURL].webContents.send(message, data);
    }
}
function sendMessageToRenderedContent(message, data) {
    for(const url in currentDisplayedWindows){
        if(currentDisplayedWindows.hasOwnProperty(url)){
            currentDisplayedWindows[url].webContents.send(message, data);
        }
    }
};
 async function displayDailySetup() {
    if(isUserLoggedIn()){
        await openMyDayWindow();
    }
}

/** Exports **/
module.exports.loadWindowAfterInit = loadWindowAfterInit;
module.exports.openSignWindow = openSignWindow;
module.exports.openMyDayWindow = openMyDayWindow;
module.exports.openOnboardingWindow = openOnboardingWindow;
module.exports.closeAllWindows = closeAllWindows;
module.exports.sendMessageToRenderedContent = sendMessageToRenderedContent;
module.exports.openMissingCalendarWindow = openMissingCalendarWindow;
module.exports.openCurrentStatusWindow = openCurrentStatusWindow;
module.exports.openChangeStatusDropdownWindow = openChangeStatusDropdownWindow;
module.exports.displayDailySetup = displayDailySetup;