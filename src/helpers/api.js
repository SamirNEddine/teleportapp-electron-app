import {graphQLClient} from './graphql';
import {GET_USER_IS_ON_BOARDED, GET_USER_HAS_SETUP_DAY} from '../graphql/queries';

export const getUserIsOnBoarded = async function () {
    const result = await graphQLClient.query({query: GET_USER_IS_ON_BOARDED});
    return result.data.user.onBoarded;
};
export const getUserHasSetupDay = async function () {
    const result = await graphQLClient.query({query: GET_USER_HAS_SETUP_DAY});
    return result.data.user.hasScheduledAvailabilityForToday;
};