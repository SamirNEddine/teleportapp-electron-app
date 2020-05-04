const {reloadMenubarContextMenu} = require('./menuBar');

const scheduleReloadUSetupDayState = function () {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59.9);
    const now = new Date();
    const timeout = endOfDay.getTime() - now.getTime() + 5000;

    setTimeout( async () => {
        await reloadMenubarContextMenu();
    }, timeout);
};

module.exports.scheduleReloadUSetupDayState = scheduleReloadUSetupDayState;