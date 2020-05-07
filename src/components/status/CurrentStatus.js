import React, {useState, useEffect} from 'react'
import {useQuery} from '@apollo/react-hooks';
import {GET_USER_CURRENT_AVAILABILITY} from '../../graphql/queries';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Chevron from './assets/chevron-down.svg';
import FadeIn from "react-fade-in";

import './status.css';

const useStyles = makeStyles((theme) => ({
    staticNeutral: {
        position: 'absolute',
        color: '#a8a9be'
    },
    staticAvailable: {
        position: 'absolute',
        color: '#e127eb'
    },
    staticFocus: {
        position: 'absolute',
        color: '#8800f0'
    },
    staticBusy: {
        position: 'absolute',
        color: '#5a6383'
    }
}));

const CurrentStatus = function () {
    const classes = useStyles();
    const {data: currentAvailabilityQueryResponse, refetch: refetchCurrentAvailabilityQuery, error: currentAvailabilityQueryError} = useQuery(GET_USER_CURRENT_AVAILABILITY);
    const [currentTimeSlot, setCurrentTimeSlot] = useState(null);
    const [progress, setProgress] = useState(0);
    const [remainingTime, setRemainingTime] = useState('');
    const [updateUIInterval, setUpdateUIInterval] = useState(null);

    const updateUI = function() {
        const duration = currentTimeSlot.end - currentTimeSlot.start;
        const timeProgress = new Date().getTime() - currentTimeSlot.start;
        setProgress(timeProgress * 100 / duration);
        const remaining = currentTimeSlot.end - new Date().getTime();
        const remainingHours = Math.floor(remaining / 1000 / 60 / 60);
        const remainingMinutes = Math.floor((remaining / 1000 / 60 / 60 - remainingHours) * 60);
        const remainingTimeStr = `${remainingHours < 10 ? `0${remainingHours}` : remainingHours}:${remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes}`;
        setRemainingTime(remainingTimeStr);

        if(!updateUIInterval){
            //First time update the UI when the current minute is over and then every minute
            const remainingSeconds = Math.floor(((remaining/1000/60/60 - remainingHours)*60 - remainingMinutes)*60);
            setTimeout( () => {
                updateUI();
                setUpdateUIInterval(setInterval( async () => {
                    if(new Date().getTime() >= currentTimeSlot.end){
                        await refetchCurrentAvailabilityQuery()
                    }else{
                        updateUI()
                    }
                }, 1000*60));
            }, remainingSeconds*1000);

        }
    };
    useEffect( ()=> {
        if(currentAvailabilityQueryResponse && currentAvailabilityQueryResponse.user){
            setCurrentTimeSlot({
                start: parseInt(currentAvailabilityQueryResponse.user.currentAvailability.start),
                end: parseInt(currentAvailabilityQueryResponse.user.currentAvailability.end),
                status: currentAvailabilityQueryResponse.user.currentAvailability.status
            });
        }
    }, [currentAvailabilityQueryResponse]);
    useEffect( () => {
        if(currentTimeSlot && currentTimeSlot.status !== 'unassigned') {
            updateUI();
        }
    }, [currentTimeSlot]);

    if(!currentTimeSlot) {
        return <div className="my-status-container" />
    }else {
        let styles = null;
        let title = null;
        let dropDownBackgroundColor = null;
        switch (currentTimeSlot.status) {
            case 'available':
            {
                styles = classes.staticAvailable;
                title = 'Available';
                dropDownBackgroundColor = '#e127eb';
                break;
            }
            case 'focus':
            {
                styles = classes.staticFocus;
                title = 'Focus';
                dropDownBackgroundColor = '#8800f0';
                break;
            }
            case 'busy':
            {
                styles = classes.staticBusy;
                title = 'Busy';
                dropDownBackgroundColor = '#5a6383';
                break;
            }
            default:
            {
                styles = classes.staticNeutral;
                title = 'Unassigned';
                dropDownBackgroundColor = '#a8a9be';
            }
        }
        return (
            <FadeIn className="my-status-container">
                <div className='my-status-circular-progress'>
                    <CircularProgress className={classes.staticNeutral} size={150}  variant="static" value={100} />
                    <CircularProgress className={styles} size={150}  variant="static" value={progress} />
                    <div className="my-status-time-remaining">{remainingTime}</div>
                </div>
                <div className='my-status-title-dropdown'>
                    <p style={{backgroundColor: dropDownBackgroundColor}} className='my-status-title'>{title}</p>
                    <img className='my-status-title-chevron' src={Chevron} alt="chevron"/>
                </div>
            </FadeIn>
        )
    }

};

export default CurrentStatus;