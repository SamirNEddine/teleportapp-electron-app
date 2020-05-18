import {graphQLClient} from './graphql';
import {
    GET_USER_IS_ON_BOARDED,
    GET_USER_HAS_SETUP_DAY,
    GET_USER_PREFERENCES
} from '../graphql/queries';

export const getUserIsOnBoarded = async function () {
    try{
        const result = await graphQLClient.query({query: GET_USER_IS_ON_BOARDED, fetchPolicy: "network-only"});
        return result.data.user.onBoarded;
    }catch(e){
        return true;
    }

};
export const getUserHasSetupDay = async function () {
    try{
        const result = await graphQLClient.query({query: GET_USER_HAS_SETUP_DAY, fetchPolicy: "network-only"});
        return result.data.user.hasScheduledAvailabilityForToday;
    }catch(e){
        console.log(e);
        return false;
    }
};
export const getUserTodayDailySetupDate = async function () {
    try{
        const result = await graphQLClient.query({query: GET_USER_PREFERENCES, fetchPolicy: "network-only"});
        const timeRepresentation = result.data.user.preferences.dailySetupTime;
        if(timeRepresentation !== 'none'){
            const hour = parseInt(timeRepresentation.slice(0,2));
            const minutes = parseInt(timeRepresentation.slice(2));
            const date = new Date();
            date.setHours(hour, minutes, 0, 0);
            return date;
        }else{
            return 'none';
        }
    }catch(e){

    }
};