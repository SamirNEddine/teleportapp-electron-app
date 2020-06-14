import React, {useState, useEffect} from 'react';
import {GET_USER_INTEGRATIONS} from '../../graphql/queries';
import {useQuery} from "@apollo/react-hooks";
import SlackLogo from './assets/slack-logo.svg';
import GoogleCalendarLogo from './assets/google-calendar-logo.svg';
import './preferences.css';
import {AnalyticsEvents} from "../../helpers/AnalyticsEvents";

const {ipcRenderer} = window.require('electron');

const Integrations = function () {
    const [integrations, setIntegrations] = useState(null);
    const {data: userIntegrationsQueryData, error: userIntegrationsQueryError} = useQuery(GET_USER_INTEGRATIONS, { fetchPolicy: "network-only"});

    useEffect( () => {
        ipcRenderer.send('track-analytics-event', AnalyticsEvents.PREFERENCES_INTEGRATIONS_OPENED);
    }, []);
    useEffect( () => {
        if(userIntegrationsQueryData && userIntegrationsQueryData.user.integrations){
            setIntegrations(userIntegrationsQueryData.user.integrations);
        }
    }, [userIntegrationsQueryData]);

    const titleForIntegration = (integration) => {
        let title = null;
        switch (integration) {
            case 'slack':
            {
                title = 'Slack';
                break;
            }
            case 'google':
            {
                title = 'Google Calendar';
                break;
            }
        }
        return title;
    };
    const logoForIntegration = (integration) => {
        let logo = null;
        switch (integration) {
            case 'slack':
            {
                logo = SlackLogo;
                break;
            }
            case 'google':
            {
                logo = GoogleCalendarLogo;
                break;
            }
        }
        return logo;
    };
    const renderIntegrationLists = () => {
        return integrations.map(integration => {
            const title = titleForIntegration(integration);
            const logo = logoForIntegration(integration);
            return <li key={integration}><img src={logo} alt={integration}/><span className='preferences-integrations-integration-title'>{title}</span></li>
        });
    };

    if(integrations){
        return (
            <div className='preferences-integrations-container'>
                <ul className='preferences-integrations-list'>
                    {renderIntegrationLists()}
                </ul>
            </div>
        )
    }else{
        return (
            <div className='preferences-integrations-container'/>
        )
    }

};

export default Integrations;