const {autoUpdater, dialog, app} = require('electron');
const server = 'http://localhost:4001/electron-app/update';
const channel = 'internal';
const feed = `${server}/update/channel/${channel}/${process.platform}/${app.getVersion()}`;

module.exports.config = function () {
    autoUpdater.setFeedURL(feed);

    setInterval(() => {
        autoUpdater.checkForUpdates()
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
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })
};