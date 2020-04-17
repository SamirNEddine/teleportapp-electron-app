import React from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_SUGGESTED_AVAILABILITY_FOR_TODAY} from '../../graphql/queries';
import StatusTimeIndicator from './StatusTimeIndicator';
import CalendarPreview from './CalendarPreview';
import './myDay.css'
import illustration from './my-day-illustration.png'

const MyDaySetup = function () {
    const {data, error} = useQuery(GET_SUGGESTED_AVAILABILITY_FOR_TODAY);

    if(data && data.user){
        const {firstName, suggestedAvailabilityForToday} = data.user;
        const {totalTimeBusy, totalTimeFocus, totalTimeAvailable} = suggestedAvailabilityForToday;

        const freeTime = (totalTimeFocus + totalTimeAvailable)/1000/60/60;
        return (
            <div className='my-day-setup-container'>
                <div className='my-day-setup-left'>
                    <div className='my-day-setup-welcome'>Hi {firstName},</div>
                    <div className='my-day-free-time'>You have <b>{freeTime} hours free from meetings</b> today. </div>
                    <div className='my-day-free-explanation'>Based on your profile, we help you to get the most out of it.</div>
                    <ul className='availability-times-list'>
                        <li><StatusTimeIndicator status="available" time={totalTimeAvailable}/></li>
                        <li><StatusTimeIndicator status="focus" time={totalTimeFocus}/></li>
                        <li><StatusTimeIndicator status="busy" time={totalTimeBusy}/></li>
                    </ul>
                    <img className='my-day-illustration' src={illustration} alt='illustration'/>
                    <div className='my-day-setup-explanation'>Teleport will show your context to your team automatically</div>
                    <button className='my-day-setup-button'>Setup my context</button>
                </div>
                <div className='my-day-setup-right'>
                    <CalendarPreview/>
                </div>
            </div>
        );
    }else{
        return (
            <div className='my-day-setup-container'>
                {error ? <h2>Something went wrong</h2> : ''}
            </div>
        );
    }
};

export default MyDaySetup;