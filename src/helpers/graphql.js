import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {onError} from 'apollo-link-error';
import {ApolloLink, Observable} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {getAccessToken, clearLocalStorage, isUserOnBoarded} from './localStorage';
import {refreshAccessToken} from './authentication';

const isRenderer = (process && process.type === 'renderer');

const API_STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_ERROR: 500,
    MISSING_INTEGRATION: 800
};

const API_ERROR_CODES = {
    NO_ERROR_CODE: 0,
    EXPIRED_ACCESS_CODE: 401.1,
    INVALID_ACCESS_CODE: 400.1,
    MISSING_CALENDAR_INTEGRATION: 800.1
};

const envURI = isRenderer ? window.require('electron').remote.process.env.GRAPHQL_API_SERVER_URL : process.env.GRAPHQL_API_SERVER_URL;
let httpLink = null;
if(isRenderer){
    httpLink = createHttpLink({
        uri: envURI ? envURI : 'https://api.teleport.so/stable/graphql'
    })
}else{
    const fetch = require('node-fetch');
    httpLink = createHttpLink({
        uri: envURI ? envURI : 'https://api.teleport.so/stable/graphql',
        fetch: fetch
    })
}


const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getAccessToken();
    const isOnBoarded = await isUserOnBoarded();
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            IANATimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ByPassIntegrationCheck: (isOnBoarded && isOnBoarded === true) ? 'false' : 'true'
        }
    }
});
const errorHandlerLink = onError( ({ graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors)
        for (const graphQLError of graphQLErrors) {
            const {message, status, locations, path, extensions} = graphQLError;
            console.debug(`[GraphQL error]: Message: ${message}, Status: ${status}, Location: ${locations}, Path: ${path}, Extensions: ${JSON.stringify(extensions)}`);
            if (extensions){
                switch (extensions.status) {
                    case API_STATUS_CODES.UNAUTHORIZED:
                    {
                        console.log("Access token expired. Try to refresh it!");
                        return new Observable(async observer => {
                            if(await refreshAccessToken()){
                                console.log('Access token refreshed! Try query again');
                                const token = getAccessToken();
                                const oldHeaders = operation.getContext().headers;
                                operation.setContext({
                                    headers: {
                                        ...oldHeaders,
                                        authorization: token ? `Bearer ${token}` : "",
                                    },
                                });
                                const subscriber = {
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer)
                                };
                                forward(operation).subscribe(subscriber)
                            }else {
                                if(isRenderer){
                                    const {ipcRenderer} = window.require('electron');
                                    console.log('TOKEN REFRESH FAILED! Logout');
                                    clearLocalStorage();
                                    ipcRenderer.send('auth-failed');
                                    observer.error(graphQLError);
                                }else{
                                    const {logout} = await import('./electronApp');
                                    await logout();
                                    observer.error(graphQLError);
                                }
                            }
                        });
                    }
                    case API_STATUS_CODES.MISSING_INTEGRATION:
                    {
                        return new Observable(async observer => {
                            if(extensions.errorCode === API_ERROR_CODES.MISSING_CALENDAR_INTEGRATION){
                                if(isRenderer){
                                    const {ipcRenderer} = window.require('electron');
                                    ipcRenderer.send('missing-calendar-integration');
                                }else{
                                   const {missingCalendarIntegration} = await import('./electronApp');
                                   await missingCalendarIntegration();
                                }
                                observer.error(graphQLError);
                            }
                        });
                    }
                }

            }
        }
    if (networkError) console.log(`[Network error]: ${networkError.message}`);
});

const link = ApolloLink.from([
    errorHandlerLink,
    authLink,
    httpLink
]);

export const graphQLClient = new ApolloClient({
    link:link,
    cache: new InMemoryCache()
});

export const getErrorMessageFromGraphqlErrorMessage = function(errorMessage){
    return errorMessage.replace('GraphQL error:', ' ').trim();
};