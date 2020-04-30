import {gql} from "apollo-boost";

export const SIGN_IN_WITH_SLACK = gql`
    mutation($code: String!) {
        signInWithSlack(code: $code, redirectURI:"teleport://slack/auth") {
            accessToken
            refreshToken
        }
    }
`;
export const GET_USER_PROFILE = gql `
    query{
        user {
            firstName
            lastName
            emailAddress
            jobTitle
            profilePictureURL
            skills {
                id
                name
            }
            preferences {
                startWorkTime
                endWorkTime
                lunchTime
            }
            availabilityProfile {
                id
            }
        }
    }
`;
export const GET_AVAILABILITY_PROFILES = gql `
    query {
        availabilityProfiles {
            id
            name
            key
            busyRatio
        }
    }
`;
export const REFRESH_ACCESS_TOKEN = gql`
    mutation($refreshToken: String!) {
        refreshAccessToken(refreshToken: $refreshToken) {
            accessToken
            refreshToken
        }
    }
`;
export const ADD_GOOGLE_CALENDAR_INTEGRATION = gql`
    mutation($code: String!, $codeVerifier: String!, $clientId: String!, $redirectURI: String!){
        addGoogleCalendarIntegration(code: $code, codeVerifier: $codeVerifier, clientId: $clientId, redirectURI: $redirectURI)
    }
`;
export const GET_SUGGESTED_AVAILABILITY_FOR_TODAY = gql`
    query{
        user {
            firstName
            suggestedAvailabilityForToday{
                totalTimeBusy
                totalTimeFocus
                totalTimeAvailable
                schedule{
                    start
                    end
                    status
                }
                startTime
                endTime
            }
        }
    }
`;
export const SCHEDULE_AVAILABILITY_FOR_TODAY = gql`
    mutation($timeSlots: [TimeSlotInput]!) {
        scheduleAvailabilityForToday(timeSlots: $timeSlots) 
    }
`;
export const SEARCH_USERS = gql`
    query($queryString: String!){
        searchUsers(queryString: $queryString){
            id
            firstName
            lastName
            email
            profilePicture
            status
            jobTitle
            company{
                id
            }
        }
    }
`;