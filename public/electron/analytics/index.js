const Analytics = require('analytics-node');
const {isUserLoggedIn, getUser, getAnonymousUserId} = require('../session');
const Events = require('./Events');

const analytics = new Analytics(process.env.SEGMENT_KEY);

/** Private functions **/
const _identifyUser = function(){
    if(isUserLoggedIn()){
        const user = getUser();
        analytics.identify({
            userId: user.id,
            traits: {
                email: user.email,
                channel: process.env.DISTRIBUTION_CHANNEL ? process.env.DISTRIBUTION_CHANNEL : "dev"
            }
        });
    }else {
        analytics.identify({
            anonymousId: getAnonymousUserId()
        });
    }
};

const trackEvent = function (event, properties = {}, flush=false, flushCallback) {
    if(event === Events.SIGN_IN_WITH_SLACK_SUCCESS){
        _identifyUser();
    }
    if(isUserLoggedIn()){
        analytics.track({
            userId: getUser().id,
            event: event,
            properties
        });
    }else{
        analytics.track({
            anonymousId: getAnonymousUserId(),
            event: event,
            properties
        });
    }
    if(flush){
        analytics.flush(flushCallback);
    }
};
const setupOnAppReady = function () {
    _identifyUser(getUser());
    trackEvent(Events.APP_OPENED);
};

module.exports.setupOnAppReady = setupOnAppReady;
module.exports.trackEvent = trackEvent;
module.exports.Events = Events;