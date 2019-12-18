const { app, BrowserWindow, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');
const { menubar } = require('menubar');
const isDev = require('electron-is-dev');
const electronLocalshortcut = require('electron-localshortcut');

const iconPath = path.join(__dirname, '..', 'assets', 'IconTemplate.png');

app.commandLine.appendSwitch('disable-renderer-backgrounding');

let mainWindow = null;
let mainWindowShown = false;

const showMainWindow = function () {
    mainWindow.center();
    mainWindow.show();
    mainWindowShown = true;
};
const hideMainWindow = function () {
    mainWindow.hide();
    mainWindowShown = false;
};

const createSearchWindow = function () {
    const window = new BrowserWindow({
        width: 650,
        height: 55,
        show: false,
        fullscreenable: false,
        movable: true,
        minimizable: false,
        maximizable: false,
        skipTaskbar: true,
        resizable: false,
        showOnAllWorkspaces: true,
        frame: false,
        vibrancy: 'popover'
    });
    window.loadURL(isDev ? 'http://localhost:3001' : `file://${path.join(__dirname, '../build/index.html')}`);
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        // window.webContents.openDevTools();
    }

    window.on('blur', () => {
        hideMainWindow();
    });
    window.on('close', function (event) {
        event.preventDefault();
        hideMainWindow();
    });

    electronLocalshortcut.register(window, 'Esc', () => {
        hideMainWindow();
    });

    return window;
};

const toggleTeleport = function() {
    if(!mainWindow){
        mainWindow = createSearchWindow();
    }

    if(!mainWindowShown){
        showMainWindow();
    }else{
        hideMainWindow();
    }
};

const quit = function(){
    app.quit();
};

app.on('ready', () => {
    const tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Toggle Teleport', type: 'normal', click() { toggleTeleport() } },
        { type: 'separator' },
        { type: 'separator' },
        { label: 'Quit', type: 'normal', click() { quit() } },
    ]);
    tray.setContextMenu(contextMenu);

    const mb = menubar({
        tray
    });

    mb.on('ready', () => {
        console.log('Menubar app is ready.');

        //Preload search window
        mainWindow = createSearchWindow();

        //Register Teleport shortcut
        const ret = globalShortcut.register('Option+Shift+T', () => {
            toggleTeleport();
        });
        if (!ret) {
            console.log('registration failed')
        }
        // Check whether a shortcut is registered.
        console.log(globalShortcut.isRegistered('Option+Shift+T'))
    })
});

app.on('window-all-closed', (event) => {
    mainWindow = null;
    // app.dock.hide();
    event.preventDefault();
});

app.on('will-quit', () => {
    if(mainWindow){
        electronLocalshortcut.unregisterAll(mainWindow);
    }
    globalShortcut.unregisterAll()
});