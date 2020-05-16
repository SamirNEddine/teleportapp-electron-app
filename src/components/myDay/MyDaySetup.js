import React, {useEffect, useState} from 'react';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {GET_SUGGESTED_AVAILABILITY_FOR_TODAY, SCHEDULE_AVAILABILITY_FOR_TODAY} from '../../graphql/queries';
import {updateHasDisplayedDailySetupForToday, updateHasSetupDayForToday} from '../../helpers/localStorage';
import LoadingScreen from '../loading/LoadingScreen';
import FadeIn from "react-fade-in";
import StatusTimeIndicator from './StatusTimeIndicator';
import CalendarPreview from '../Calendar/CalendarPreview';
import Zoom from 'react-reveal/Zoom'
import '../../assets/animate.css';
import './myDay.css'
import Lottie from "react-lottie";
import * as doneData from "./assets/done";
const {ipcRenderer} = window.require('electron');

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: doneData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const FAKE_LOADING_TIMEOUT = 3000;

const MyDaySetup = function () {
    const getAvailabilityQuery = useQuery(GET_SUGGESTED_AVAILABILITY_FOR_TODAY);
    const [scheduleAvailabilityMutation, {error}] = useMutation(SCHEDULE_AVAILABILITY_FOR_TODAY);
    const [timeSlots, setTimeSlots] = useState(null);
    const [fakeLoading, setFakeLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestedAvailabilityForToday, setSuggestedAvailabilityForToday] = useState(null);
    const [setupDone, setSetupDone] = useState(false);

    /**Effects**/
    useEffect( () => {
        setFakeLoading(true);
        setLoading(true);
        //Do not show daily setup if the user opens the setup window before time.
        updateHasDisplayedDailySetupForToday(true);
    }, []);
    useEffect( () => {
        if(!fakeLoading && !getAvailabilityQuery.loading){
            setLoading(false);
        }
    }, [fakeLoading, getAvailabilityQuery.loading]);
    useEffect( () => {
        const onContextParamsChange = async () => {
            await getAvailabilityQuery.refetch()
        };
        if(getAvailabilityQuery.data && getAvailabilityQuery.data.user) {
            setSuggestedAvailabilityForToday(getAvailabilityQuery.data.user.suggestedAvailabilityForToday);
        }
        ipcRenderer.removeListener('context-params-changed', onContextParamsChange);
        ipcRenderer.on('context-params-changed', onContextParamsChange);
        return () => {
            ipcRenderer.removeListener('context-params-changed', onContextParamsChange);
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
                if(!error && result.data.scheduleAvailabilityForToday === 'ok'){
                    setSetupDone(true);
                    updateHasSetupDayForToday(true);
                    setTimeout( () => {
                        ipcRenderer.send('setup-my-day-done');
                    }, 2500);

                }
            }catch(e) {
                console.log(e);
            }
        }
    };
    const onLoadingAnimationFinished = function () {
        setFakeLoading(false);
    };

    const freeHoursInMills = suggestedAvailabilityForToday ? suggestedAvailabilityForToday.totalTimeFocus + suggestedAvailabilityForToday.totalTimeAvailable : 0;
    const hours = Math.floor(freeHoursInMills/(1000*60*60));
    const minutes = Math.floor(freeHoursInMills/(1000*60) - hours*60);
    const timeStr = hours > 0 ? `${hours}${minutes > 0 ? `h${minutes}` : ` ${hours > 1 ? 'hours' : 'hour'}`}` : `${minutes > 0 ? `${minutes} minutes` : '0h'}`;
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
                                <div className='my-day-setup-welcome'>Hi {getAvailabilityQuery.data.user.firstName}</div>
                                <div className='my-day-free-time'>You have <b>{timeStr}</b> free from meetings today! </div>
                                <div className='my-day-free-explanation'>Based on your profile, we suggest you this organization to help you to get the most out of it:</div>
                                <ul className='availability-times-list'>
                                    <li><StatusTimeIndicator status="available" time={suggestedAvailabilityForToday.totalTimeAvailable}/></li>
                                    <li><StatusTimeIndicator status="focus" time={suggestedAvailabilityForToday.totalTimeFocus}/></li>
                                    <li><StatusTimeIndicator status="busy" time={suggestedAvailabilityForToday.totalTimeBusy}/></li>
                                </ul>
                                <ul className='my-day-setup-actions-list'>
                                    <li>👉 We will <b>setup your calendar</b>.</li>
                                    <li>👉 We update your <b>Slack status</b> through the day.</li>
                                </ul>
                                <button className='confirm-button my-day-setup-button-position' onClick={scheduleAvailabilityForToday}>Let's go!</button>
                            </div>
                            <div className='my-day-setup-right'>
                                <div className='my-day-setup-right-title'>Preview of your day</div>
                                <CalendarPreview startDayTime={parseInt(suggestedAvailabilityForToday.startTime)} endDayTime={parseInt(suggestedAvailabilityForToday.endTime)} schedule={suggestedAvailabilityForToday.schedule}/>
                            </div>
                        </Zoom>)
                }
            {setupDone ?
                (
                    <div className='setup-day-done-container'>
                        <FadeIn className="setup-day-done-logo" childClassName='setup-day-done-logo'>
                            <Lottie options={defaultOptions} height={120} width={120} />
                        </FadeIn>
                        <FadeIn className="setup-day-done-message" childClassName='setup-day-done-message'>
                            <h1>All set!</h1>
                        </FadeIn>

                    </div>
                ) : (
                    <div/>
                )}

        </div>
    );
};

export default MyDaySetup;