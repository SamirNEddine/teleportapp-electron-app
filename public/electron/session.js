const Store = require('electron-store')

require = require("esm")(module);
const {isUserOnBoarded, hasSetupDayForToday, getLastSetupDate} = require('../../src/helpers/localStorage');

const store = new Store();

const isUserLoggedIn = function () {
    return (store.has('accessToken') && store.has('refreshToken') && store.has('user'));
};
const clearCurrentSession = function (){
    store.delete('accessToken');
    store.delete('refreshToken');
    store.delete('user');
    store.clear();
};
const isOnBoarded = async function() {
    return await isUserOnBoarded();
};
const hasSetupDay = async function() {
    return await hasSetupDayForToday();
};
const lastSetupDate = function() {
    return getLastSetupDate();
};

/** Exports **/
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.clearCurrentSession = clearCurrentSession;
module.exports.isOnBoarded = isOnBoarded;
module.exports.hasSetupDay = hasSetupDay;
module.exports.lastSetupDate = lastSetupDate;