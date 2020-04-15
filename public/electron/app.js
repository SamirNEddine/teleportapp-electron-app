const {app} = require('electron');

/** App Configuration **/
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
//URL Scheme
app.setAsDefaultProtocolClient('teleport');

/** App Events **/
app.on('ready', async () => {
    await require('./menuBar').loadMenubar();//Workaround for circular include issue
});
app.on('window-all-closed', (event) => {
    event.preventDefault();
});
app.on('will-quit', () => {
});
app.on('open-url', function (event, uri) {
    event.preventDefault();
});

/** Public methods **/
const quitApp = function() {
    app.quit();
};

/** Exports **/
module.exports.quitApp = quitApp;