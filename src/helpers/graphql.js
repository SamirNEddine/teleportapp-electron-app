import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {onError} from 'apollo-link-error';
import {ApolloLink, Observable} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {getAccessToken, clearLocalStorage} from './localStorage';
import {refreshAccessToken} from './authentication';
const {ipcRenderer} = window.require('electron');
// import authenticationStore from '../stores/authenticationStore';
// import { authError } from '../reducers/authenticationReducer';

const API_STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500
};

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_SERVER_URL
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getAccessToken();
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            IANATimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    }
});
const errorHandlerLink = onError( ({ graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors)
        for (const graphQLError of graphQLErrors) {
            const {message, status, locations, path, extensions} = graphQLError;
            console.debug(`[GraphQL error]: Message: ${message}, Status: ${status}, Location: ${locations}, Path: ${path}, Extensions: ${JSON.stringify(extensions)}`);
            if (extensions && extensions.status === API_STATUS_CODES.UNAUTHORIZED){
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
                        console.log('TOKEN REFRESH FAILED! Logout');
                        clearLocalStorage();
                        ipcRenderer.send('auth-failed');
                        observer.error();
                    }
                });
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