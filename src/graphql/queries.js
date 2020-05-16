import {gql} from "apollo-boost";

export const SIGN_IN_WITH_SLACK = gql`
    mutation($code: String!) {
        signInWithSlack(code: $code, redirectURI:"teleport://slack/auth") {
            accessToken
            refreshToken
        }
    }
`;
export const GET_USER_IS_ON_BOARDED = gql `
    query{
        user {
            onBoarded
        }
    }
`;
export const GET_USER_HAS_SETUP_DAY = gql `
    query{
        user {
            hasScheduledAvailabilityForToday
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
                key
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
export const GET_SKILLS = gql `
    query {
        skills {
            id
            name
            key
        }
    }
`;
export const GET_USER_AVAILABILITY_PROFILE = gql `
    query {
        user {
            availabilityProfile {
                id
            }
        }
    }
`;
export const UPDATE_USER_PROFILE = gql `
    mutation($firstName: String, $lastName: String, $jobTitle: String, $skills: [ID]){
        updateUserProfile(firstName: $firstName, lastName: $lastName, jobTitle: $jobTitle, skills: $skills){
            firstName
            lastName
            emailAddress
            jobTitle
            skills {
                id
            }
            profilePictureURL
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
export const GET_USER_PREFERENCES = gql `
    query{
        user {
            preferences {
                startWorkTime
                dailySetupTime
                endWorkTime
                lunchTime
                lunchDurationInMinutes
            }
        }
    }
`;
export const UPDATE_USER_PREFERENCES = gql `
    mutation($startWorkTime: String, $endWorkTime: String, $lunchTime: String, $dailySetupTime: String, $lunchDurationInMinutes: Int){
        updateUserPreferences(startWorkTime: $startWorkTime, endWorkTime: $endWorkTime, lunchTime: $lunchTime, dailySetupTime: $dailySetupTime, lunchDurationInMinutes: $lunchDurationInMinutes){
            startWorkTime
            endWorkTime
            lunchTime
            dailySetupTime
            lunchDurationInMinutes
        }
    }
`;
export const UPDATE_USER_AVAILABILITY_PROFILE = gql `
    mutation($availabilityProfileId: String!){
        updateAvailabilityProfile(availabilityProfileId: $availabilityProfileId){
            id
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
export const GET_USER_CURRENT_AVAILABILITY = gql `
    query{
        user {
            currentAvailability
            {
                start
                end
                status
            }
        }
    }
`;
export const GET_USER_NEXT_AVAILABILITY = gql `
    query{
        user {
            currentAvailability
            {
                start
                end
                status
            }
            nextAvailability
            {
                start
                end
                status
            }
        }
    }
`;
export const OVERRIDE_CURRENT_AVAILABILITY = gql `
    mutation($newAvailability: String!) {
        overrideCurrentAvailability(newAvailability: $newAvailability) {
            start
            end
            status
        }
    }
`;