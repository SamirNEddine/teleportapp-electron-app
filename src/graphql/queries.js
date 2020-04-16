import {gql} from "apollo-boost";


export const SIGN_IN_WITH_SLACK = gql`
    mutation($code: String!) {
        signInWithSlack(code: $code, redirectURI:"teleport://slack/auth") {
            accessToken
            refreshToken
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
export const GET_GOOGLE_CALENDAR_AUTH_URL = gql`
    query{
        getGoogleCalendarAuthURL
    }
`;
export const ADD_GOOGLE_CALENDAR_INTEGRATION = gql`
    mutation($code: String!){
        addGoogleCalendarIntegration(code: $code)
    }
`;
export const GET_SUGGESTED_AVAILABILITY_FOR_TODAY = gql`
    query{
        user {
            suggestedAvailabilityForToday{
                busyTimeSlots{
                    start
                    end
                    status
                }
                availableTimeSlots{
                    start
                    end
                    status
                }
                unassignedTimeSlots{
                    start
                    end
                    status
                }
                focusTimeSlots{
                    start
                    end
                    status
                }
            }
        }
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