import {graphQLClient} from "./graphql";
import {REFRESH_ACCESS_TOKEN} from '../graphql/queries';
import {getRefreshToken, updateLocalUser} from './localStorage';

export const refreshAccessToken = async function() {
    try {
        const storedRefreshToken = getRefreshToken();
        const result = await graphQLClient.mutate({
            mutation: REFRESH_ACCESS_TOKEN,
            variables: {
                refreshToken: storedRefreshToken
            }
        });
        const {accessToken, refreshToken} = result.data.refreshAccessToken;
        await updateLocalUser(accessToken, refreshToken);
        return true;
    }catch(e){
        return false;
    }

};