const {AuthorizationRequest} = require("@openid/appauth/built/authorization_request");
const {AuthorizationNotifier} = require("@openid/appauth/built/authorization_request_handler");
const  {AuthorizationServiceConfiguration}  = require("@openid/appauth/built/authorization_service_configuration");
const  {NodeCrypto}  = require('@openid/appauth/built/node_support/');
const  {NodeBasedHandler}  = require("@openid/appauth/built/node_support/node_request_handler");
const  {NodeRequestor}  = require("@openid/appauth/built/node_support/node_requestor");
const {sendMessageToRenderedContent} = require('./windowManager');

const requestor = new NodeRequestor();
const openIdConnectUrl = 'https://accounts.google.com';
const clientId = "7493390700-8latefq0fu6696o9jfduqasa99gag8b3.apps.googleusercontent.com";
const redirectURI = 'http://127.0.0.1:8000';
const scope = 'https://www.googleapis.com/auth/calendar.events';

class GoogleAuthFlow {
    notifier;
    authorizationHandler;
    configuration;

    constructor() {
        this.notifier = new AuthorizationNotifier();
        this.authorizationHandler = new NodeBasedHandler();
        // set notifier to deliver responses
        this.authorizationHandler.setAuthorizationNotifier(this.notifier);
        // set a listener to listen for authorization responses
        this.notifier.setAuthorizationListener((request, response, error) => {
            if (response) {
                let codeVerifier = null;
                if(request.internal && request.internal.code_verifier) {
                    codeVerifier = request.internal.code_verifier;
                }
                sendMessageToRenderedContent('google-calendar-permission-granted', {code: response.code, codeVerifier, clientId, redirectURI});
            }
        });
    }
    async fetchServiceConfiguration() {
        this.configuration = await AuthorizationServiceConfiguration.fetchFromIssuer(
            openIdConnectUrl,
            requestor
        );
    }
    makeAuthorizationRequest(username) {
        if (!this.configuration) {
            return;
        }
        const extras = { prompt: "consent", access_type: "offline" };
        if (username) {
            extras["console.login_hint"] = username;
        }
        // create a request
        const request = new AuthorizationRequest({
            client_id: clientId,
            redirect_uri: redirectURI,
            scope: scope,
            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
            state: undefined,
            extras: extras
        }, new NodeCrypto());
        this.authorizationHandler.performAuthorizationRequest(
            this.configuration,
            request
        );
    }
}

/** Exports **/
module.exports.GoogleAuthFlow = GoogleAuthFlow;