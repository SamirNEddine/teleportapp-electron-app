const Store = require('electron-store');

const store = new Store();

const isUserLoggedIn = function () {
    return (store.has('accessToken') && store.has('refreshToken') && store.has('user'));
};
const clearCurrentSession = function (){
    store.delete('accessToken');
    store.delete('refreshToken');
    store.delete('user');
};

/** Exports **/
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.clearCurrentSession = clearCurrentSession;