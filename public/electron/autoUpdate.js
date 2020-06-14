const {autoUpdater, dialog, app} = require('electron');
const {forceCloseAllWindows} = require('./windowManager');
const envURI = process.env.GRAPHQL_API_SERVER_URL ? process.env.GRAPHQL_API_SERVER_URL : 'https://api.teleport.so/stable';
const channel = process.env.DISTRIBUTION_CHANNEL ? process.env.DISTRIBUTION_CHANNEL : 'public';
const feed = `${envURI}/electron-app/update/channel/${channel}/${process.platform}/${app.getVersion()}`;

module.exports.config = function () {
    autoUpdater.setFeedURL(feed);

    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 60000);

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        };

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) {
                forceCloseAllWindows();
                autoUpdater.quitAndInstall();
            }
        })
    })
};