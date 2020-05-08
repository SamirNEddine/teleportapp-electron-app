import {graphQLClient} from './graphql';
import {
    GET_USER_IS_ON_BOARDED,
    GET_USER_HAS_SETUP_DAY,
    GET_USER_PREFERENCES
} from '../graphql/queries';

export const getUserIsOnBoarded = async function () {
    try{
        const result = await graphQLClient.query({query: GET_USER_IS_ON_BOARDED});
        return result.data.user.onBoarded;
    }catch(e){

    }

};
export const getUserHasSetupDay = async function () {
    try{
        const result = await graphQLClient.query({query: GET_USER_HAS_SETUP_DAY});
        return result.data.user.hasScheduledAvailabilityForToday;
    }catch(e){

    }
};
export const getUserTodayDailySetupDate = async function () {
    try{
        const result = await graphQLClient.query({query: GET_USER_PREFERENCES});
        const timeRepresentation = result.data.user.preferences.dailySetupTime;
        const hour = parseInt(timeRepresentation.slice(0,2));
        const minutes = parseInt(timeRepresentation.slice(2));
        const now = new Date();
        now.setHours(hour, minutes, 0, 0);
        return now;
    }catch(e){

    }
};