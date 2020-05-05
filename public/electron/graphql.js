import {graphQLClient} from '../../src/helpers/graphql';
import {GET_USER_IS_ON_BOARDED, GET_USER_HAS_SETUP_DAY} from '../../src/graphql/queries';
import {updateIsOnBoarded} from '../../src/helpers/localStorage';

export const getUserIsOnBoarded = async function () {
        const result = await graphQLClient.query({query: GET_USER_IS_ON_BOARDED, errorPolicy: 'ignore'});
        updateIsOnBoarded(result.data.user.onBoarded);
        return result.data.user.onBoarded;
};
export const getUserHasSetupDay = async function () {
        const result = await graphQLClient.query({query: GET_USER_HAS_SETUP_DAY, errorPolicy: 'ignore'});
        return result.data.user.hasScheduledAvailabilityForToday;
};