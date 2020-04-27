import React, {useEffect, useState} from 'react';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {GET_SUGGESTED_AVAILABILITY_FOR_TODAY, SCHEDULE_AVAILABILITY_FOR_TODAY} from '../../graphql/queries';
import LoadingScreen from '../loading/LoadingScreen';
import FadeIn from "react-fade-in";
import StatusTimeIndicator from './StatusTimeIndicator';
import CalendarPreview from '../Calendar/CalendarPreview';
import Zoom from 'react-reveal/Zoom'
import '../../assets/animate.css';
import './myDay.css'
import illustration from './my-day-illustration.png'
const remote = window.require('electron').remote;

const FAKE_LOADING_TIMEOUT = 1000;

const MyDaySetup = function () {
    const getAvailabilityQuery = useQuery(GET_SUGGESTED_AVAILABILITY_FOR_TODAY);
    const [scheduleAvailabilityMutation, {error}] = useMutation(SCHEDULE_AVAILABILITY_FOR_TODAY);
    const [timeSlots, setTimeSlots] = useState(null);
    const [fakeLoading, setFakeLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestedAvailabilityForToday, setSuggestedAvailabilityForToday] = useState(null);

    /**Effects**/
    useEffect( () => {
        setFakeLoading(true);
        setLoading(true);
    }, []);
    useEffect( () => {
        if(!fakeLoading && !getAvailabilityQuery.loading){
            setLoading(false);
        }
    }, [fakeLoading, getAvailabilityQuery.loading]);
    useEffect( () => {
        if(getAvailabilityQuery.data && getAvailabilityQuery.data.user) {
            setSuggestedAvailabilityForToday(getAvailabilityQuery.data.user.suggestedAvailabilityForToday);
        }
    }, [getAvailabilityQuery.data]);
    useEffect( () => {
        if(suggestedAvailabilityForToday){
            setTimeSlots(suggestedAvailabilityForToday.schedule.map( ts => {return {start: ts.start, end:ts.end, status:ts.status}}));
        }
    }, [suggestedAvailabilityForToday]);

    /** Utility methods **/
    const scheduleAvailabilityForToday =  async (e) => {
        if(timeSlots){
            try{
                const result = await scheduleAvailabilityMutation({variables: {timeSlots}});
                console.log(result.data);
                if(!error && result.data.scheduleAvailabilityForToday === 'ok'){
                    remote.getCurrentWindow().close();
                }
            }catch(e) {
                console.log(e);
            }
        }
    };
    const onLoadingAnimationFinished = function () {
        setFakeLoading(false);
    };

    /** Render **/
    return (
        <div className='my-day-main-container'>
                {loading ?
                    <FadeIn className='my-day-loading-container' childClassName='my-day-loading-container' >
                            <LoadingScreen minLoadingTime={FAKE_LOADING_TIMEOUT} ready={!getAvailabilityQuery.loading} onAnimationFinished={onLoadingAnimationFinished} />
                    </FadeIn>
                    :
                    suggestedAvailabilityForToday === null ?
                        (<div/>)
                        :
                        (<Zoom duration={300}>
                            <div className='my-day-setup-left'>
                                <div className='my-day-setup-welcome'>Hi {getAvailabilityQuery.data.user.firstName},</div>
                                <div className='my-day-free-time'>You have <b>{(suggestedAvailabilityForToday.totalTimeFocus + suggestedAvailabilityForToday.totalTimeAvailable)/1000/60/60} hours free from meetings</b> today. </div>
                                <div className='my-day-free-explanation'>Based on your profile, we help you to get the most out of it.</div>
                                <ul className='availability-times-list'>
                                    <li><StatusTimeIndicator status="available" time={suggestedAvailabilityForToday.totalTimeAvailable}/></li>
                                    <li><StatusTimeIndicator status="focus" time={suggestedAvailabilityForToday.totalTimeFocus}/></li>
                                    <li><StatusTimeIndicator status="busy" time={suggestedAvailabilityForToday.totalTimeBusy}/></li>
                                </ul>
                                <img className='my-day-illustration' src={illustration} alt='illustration'/>
                                <div className='my-day-setup-explanation'>Teleport will show your context to your team automatically</div>
                                <button className='my-day-setup-button' onClick={scheduleAvailabilityForToday}>Setup my context</button>
                            </div>
                            <div className='my-day-setup-right'>
                                <div className='my-day-setup-right-title'>Preview of your day</div>
                                <CalendarPreview startDayTime={parseInt(suggestedAvailabilityForToday.startTime)} endDayTime={parseInt(suggestedAvailabilityForToday.endTime)} schedule={suggestedAvailabilityForToday.schedule}/>
                            </div>
                        </Zoom>)
                }
        </div>
    );
};

export default MyDaySetup;