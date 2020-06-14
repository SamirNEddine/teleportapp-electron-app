const Index = require('analytics-node');
const {isUserLoggedIn, getUser} = require('../session');
const Events = require('./Events');

const analytics = new Index(process.env.SEGMENT_KEY);

/** Private functions **/
const _identifyUser = function(user){
    analytics.identify({
        userId: user.id,
        traits: {
            email: user.email
        }
    });
};

const trackEvent = function (event, properties = {}) {
    let userId = null;
    if(isUserLoggedIn()){
        userId = getUser().id;
    }
    analytics.track({
        userId,
        event: event,
    });
};
const setupOnAppReady = function () {
    if(isUserLoggedIn()){
        _identifyUser(getUser());
    }
    trackEvent(Events.APP_OPENED);
};

module.exports.setupOnAppReady = setupOnAppReady;