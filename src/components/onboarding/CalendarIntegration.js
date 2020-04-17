import React from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_GOOGLE_CALENDAR_AUTH_URL, ADD_GOOGLE_CALENDAR_INTEGRATION} from '../../graphql/queries';
import './onboarding.css'

const CalendarIntegration = function () {
    // const googleCalendarAuthURLQuery = useQuery(GET_GOOGLE_CALENDAR_AUTH_URL);

    return (
        <div className='calendar-integration-container'>
            <h1>Connect your Google Calendar!</h1>
            <button className="connect-calendar-button" onClick={ () =>{window.location.href = 'https://www.google.com'} }>Connect Calendar!</button>
        </div>
    );
};

export default CalendarIntegration;