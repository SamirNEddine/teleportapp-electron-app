import React, {useEffect} from 'react';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {ADD_GOOGLE_CALENDAR_INTEGRATION} from '../../graphql/queries';
import './onboarding.css'
import WhiteLogo from './../../assets/Teleport-logo-white.svg'
import SlackLogo from './../../assets/Slack-logo.svg'
import GoogleCalendarLogo from './../../assets/Google-calendar-logo.svg'
const {ipcRenderer} = window.require('electron');

const CalendarIntegration = function ({onConfirmButtonClick}) {
    const [addGoogleCalendarIntegration, {error}] = useMutation(ADD_GOOGLE_CALENDAR_INTEGRATION);
    useEffect( () => {
        ipcRenderer.on('google-calendar-permission-granted', async (event, {code, codeVerifier, clientId, redirectURI}) => {
            try {
                const result = await addGoogleCalendarIntegration({variables: {code, codeVerifier, clientId, redirectURI}});
                if(result.data.addGoogleCalendarIntegration === 'ok'){
                    ipcRenderer.send('add-calendar-integration-success');
                }
            }catch(e){
                console.debug(e);
            }
        });
    }, []);
    const connectCalendar = async (e) => {
        ipcRenderer.send('connect-google');
    };
    return (
        <div className='calendar-integration-container'>
            <div className="main-title">Put the pieces together ✨</div>
            <div className="secondary-title">Connect your Google Calendar</div>
            <div className="integration-context-title">Your context 👇</div>
            <ul className="integration-context-list">
                <li>Your availability level</li>
                <li>The communication tool to use</li>
                <li>The best time to reach you</li>
            </ul>
            <div className="integration-rings-container">
                <div className="integration-rings-ring1"/>
                <div className="integration-rings-ring2"/>
                <div className="integration-rings-ring3"/>
                <img className='integration-teleport-white-logo' src={WhiteLogo} alt='white-logo'/>
            </div>
            <img className='integration-slack-logo' src={SlackLogo} alt='slack-logo'/>
            <div className='integration-slack-text'>Your Slack status</div>
            <img className='integration-calendar-logo' src={GoogleCalendarLogo} alt='calendar-logo'/>
            <div className='integration-calendar-text'>Google Calendar</div>
            <div className="confirm-button-position confirm-button" onClick={connectCalendar}>Connect</div>
            {error ? <p className='auth-error-message'>{error.message}</p> : ''}
        </div>
    );
};

export default CalendarIntegration;