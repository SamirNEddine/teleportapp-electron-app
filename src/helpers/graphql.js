import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {getAccessToken, clearLocalStorage} from './localStorage';
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
const errorHandlerLink = onError(({ graphQLErrors, networkError, extensions}) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, status, locations, path, extensions }) => {
            console.debug(`[GraphQL error]: Message: ${message}, Status: ${status}, Location: ${locations}, Path: ${path}, Extensions: ${JSON.stringify(extensions)}`);
            if (extensions && extensions.status === API_STATUS_CODES.UNAUTHORIZED){
                clearLocalStorage();
                ipcRenderer.send('auth-failed');
            }
        });
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