const Store = require('electron-store')

require = require("esm")(module);
const {isUserOnBoarded, updateIsOnBoarded} = require('../../src/helpers/localStorage');

const store = new Store();

const isUserLoggedIn = function () {
    return (store.has('accessToken') && store.has('refreshToken') && store.has('user'));
};
const clearCurrentSession = function (){
    store.delete('accessToken');
    store.delete('refreshToken');
    store.delete('user');
};
const isOnBoarded = function() {
    return isUserOnBoarded();
};

/** Exports **/
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.clearCurrentSession = clearCurrentSession;
module.exports.isOnBoarded = isOnBoarded;