const {reloadMenubarContextMenu} = require('./menuBar');
const {hasSetupDay, isUserLoggedIn} = require('./session');

let nextSetupMyDayTimeOut = null;
let setupMyDayInterval = null;

const stopAllTimers =  function () {
    if(nextSetupMyDayTimeOut){
        clearTimeout(nextSetupMyDayTimeOut);
        nextSetupMyDayTimeOut = null;
    }
    if(setupMyDayInterval){
        clearInterval(setupMyDayInterval);
        setupMyDayInterval = null;
    }
};
const scheduleReloadUSetupDayState = async function () {
    stopAllTimers();
    if(isUserLoggedIn()) {
        if (await hasSetupDay()) {
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59.9);
            const now = new Date();
            const timeout = endOfDay.getTime() - now.getTime() + 5000;
            if (nextSetupMyDayTimeOut) {
                clearTimeout(nextSetupMyDayTimeOut);
                nextSetupMyDayTimeOut = null;
            }
            if (setupMyDayInterval) {
                clearInterval(setupMyDayInterval);
                setupMyDayInterval = null;
            }
            nextSetupMyDayTimeOut = setTimeout(async () => {
                await reloadMenubarContextMenu();
            }, timeout);
        } else {
            if (!setupMyDayInterval) {
                setupMyDayInterval = setInterval(async () => {
                    await scheduleReloadUSetupDayState();
                }, 5 * 60 * 1000)
            }
        }
    }
};

module.exports.scheduleReloadUSetupDayState = scheduleReloadUSetupDayState;
module.exports.stopAllTimers = stopAllTimers;