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
const isOnBoarded = function() {
    if(isUserLoggedIn()){
        const user = JSON.parse(store.get('user'));
        const key = `${user.id}_isOnBoarded`;
        if(store.has(key)){
            return store.get(key);
        }else{
            return 'unknown';
        }

    }else{
        return false;
    }
};

/** Exports **/
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.clearCurrentSession = clearCurrentSession;
module.exports.isOnBoarded = isOnBoarded;