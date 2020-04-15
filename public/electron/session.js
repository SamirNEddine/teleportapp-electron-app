const Store = require('electron-store');

const store = new Store();

const isUserLoggedIn = function () {
    return (store.get('accessToken') && store.get('refreshToken') && store.get('user'));
};

/** Exports **/
module.exports.isUserLoggedIn = isUserLoggedIn;