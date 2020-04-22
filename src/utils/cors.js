const remote = window.require('electron').remote;

const filter = { urls: ['*://*.teleport.so/*'] };

export const addCorsHandler = function () {
    remote.session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.requestHeaders['Origin'] = null;
        callback({ requestHeaders: details.requestHeaders });
    });
};

