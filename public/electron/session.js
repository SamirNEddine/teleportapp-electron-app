const Store = require('electron-store');

require = require("esm")(module);
const {isUserOnBoarded,
    hasSetupDayForToday,
    getLastSetupDate,
    hasDisplayedDailySetupForToday: localHasDisplayedDailySetupForToday,
    updateHasDisplayedDailySetupForToday: localUpdateHasDisplayedDailySetupForToday,
    updateLocalStorageFromServerIfNeeded: localUpdateLocalStorageFromServerIfNeeded
} = require('../../src/helpers/localStorage');

const store = new Store();

const isUserLoggedIn = function () {
    return (store.has('accessToken') && store.has('refreshToken') && store.has('user'));
};
const completelyClearLocalStorage = function () {
    store.clear();
};
const clearCurrentSession = function (){
    completelyClearLocalStorage();
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
const hasDisplayedDailySetupForToday = function() {
    return localHasDisplayedDailySetupForToday();
};
const updateHasDisplayedDailySetupForToday = function(value) {
    return localUpdateHasDisplayedDailySetupForToday(value);
};
const simulateRefreshToken = function() {
    store.set('accessToken', 'XXX');
};
const simulateRefreshTokenFailure = function() {
    simulateRefreshToken();
    store.set('refreshToken', 'XXX');
};
const updateLocalStorageFromServerIfNeeded = async function() {
    await localUpdateLocalStorageFromServerIfNeeded();
};

/** Exports **/
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.clearCurrentSession = clearCurrentSession;
module.exports.isOnBoarded = isOnBoarded;
module.exports.hasSetupDay = hasSetupDay;
module.exports.lastSetupDate = lastSetupDate;
module.exports.hasDisplayedDailySetupForToday = hasDisplayedDailySetupForToday;
module.exports.updateHasDisplayedDailySetupForToday = updateHasDisplayedDailySetupForToday;
module.exports.completelyClearLocalStorage = completelyClearLocalStorage;
module.exports.simulateRefreshToken = simulateRefreshToken;
module.exports.simulateRefreshTokenFailure = simulateRefreshTokenFailure;
module.exports.updateLocalStorageFromServerIfNeeded = updateLocalStorageFromServerIfNeeded;