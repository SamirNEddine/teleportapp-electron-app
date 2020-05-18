const {reloadMenubarContextMenu} = require('./menuBar');
const {
    hasSetupDay,
    isUserLoggedIn,
    hasDisplayedDailySetupForToday,
    updateHasDisplayedDailySetupForToday
} = require('./session');
const {displayDailySetup} = require('./windowManager');
require = require("esm")(module);
const {getUserTodayDailySetupDate} = require('../../src/helpers/api');

let nextSetupMyDayTimeOut = null;
let setupMyDayInterval = null;
const stopSetupDayTimers =  function () {
    if(nextSetupMyDayTimeOut){
        clearTimeout(nextSetupMyDayTimeOut);
        nextSetupMyDayTimeOut = null;
    }
    if(setupMyDayInterval){
        clearInterval(setupMyDayInterval);
        setupMyDayInterval = null;
    }
};
const scheduleReloadSetupDayState = async function () {
    stopSetupDayTimers();
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
            console.log('Scheduling next reload menu bar for setup my day');
            nextSetupMyDayTimeOut = setTimeout(async () => {
                await reloadMenubarContextMenu();
            }, timeout);
        } else {
            if (!setupMyDayInterval) {
                console.log('Time interval for checking setup my day state');
                setupMyDayInterval = setInterval(async () => {
                    await scheduleReloadSetupDayState();
                }, 5 * 60 * 1000)
            }
        }
    }
};
let dailySetupTimeout = null;
const stopDailySetupTimers =  function () {
    if(dailySetupTimeout){
        clearTimeout(dailySetupTimeout);
        dailySetupTimeout = null;
    }
};
const scheduleDailySetup = async function(forceNextDay=true) {
    stopDailySetupTimers();
    if(isUserLoggedIn()){
        const dailySetupDate = await getUserTodayDailySetupDate();
        if(dailySetupDate && dailySetupDate !== 'none'){
            if(forceNextDay || hasDisplayedDailySetupForToday()){
                console.log(forceNextDay ? 'Force schedule daily setup for next day' : 'Daily setup already shown for today - Schedule for tomorrow ');
                dailySetupDate.setDate(dailySetupDate.getDate()+1);
            }else{
                console.log('Daily setup not yet shown. Schedule displaying it.');
            }
            const timeout = dailySetupDate.getTime() - new Date().getTime();
            dailySetupTimeout = setTimeout( async () => {
                if(isUserLoggedIn){
                    await displayDailySetup();
                    updateHasDisplayedDailySetupForToday(true);
                    await scheduleDailySetup(true);
                }
            }, timeout >= 0 ? timeout : 0);
        }else {
            console.log('Daily setup disabled');
        }
    }
};

const stopAllTimers =  function () {
    stopSetupDayTimers();
    stopDailySetupTimers();
};

module.exports.scheduleReloadSetupDayState = scheduleReloadSetupDayState;
module.exports.scheduleDailySetup = scheduleDailySetup;
module.exports.stopAllTimers = stopAllTimers;