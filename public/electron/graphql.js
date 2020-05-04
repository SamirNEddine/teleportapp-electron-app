import {graphQLClient} from '../../src/helpers/graphql';
import {GET_USER_IS_ON_BOARDED} from '../../src/graphql/queries';
import {updateIsOnBoarded} from '../../src/helpers/localStorage';

export const getUserIsOnBoarded = async function () {
        const result = await graphQLClient.query({query: GET_USER_IS_ON_BOARDED});
        updateIsOnBoarded(result.data.user.onBoarded);
        return result.data.user.onBoarded;
};