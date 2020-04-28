const Store = require('electron-store');

const store = new Store();

const shouldAddToLoginItems = function () {
    if(!store.has('launchAtStart')){
        return true;
    }else{
        return store.get('launchAtStart');
    }
};

module.exports.shouldAddToLoginItems = shouldAddToLoginItems;