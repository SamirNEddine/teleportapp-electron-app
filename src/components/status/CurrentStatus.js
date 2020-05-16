import React, {useState, useEffect} from 'react'
import {useMutation, useQuery} from '@apollo/react-hooks';
import {
    GET_USER_CURRENT_AVAILABILITY,
    OVERRIDE_CURRENT_AVAILABILITY
} from '../../graphql/queries';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getTimeElementsFromDuration} from '../../utils/dateTime';
import { makeStyles } from '@material-ui/core/styles';
import Chevron from './assets/chevron-down.svg';
import './status.css';

const {ipcRenderer} = window.require('electron');
const currentWindow = window.require('electron').remote.getCurrentWindow();
let firstUIUpdateTimeout = null;
let updateUIInterval = null;
let refetchStatusTimeout = null;
let refetchStatusTimeInterval = null;

const STATUS_CHECKER_TIME_INTERVAL = 1*60*1000;

const useStyles = makeStyles(() => ({
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
    },
    staticLunch: {
        position: 'absolute',
        color: '#5a6383'
    }
}));

const CurrentStatus = function () {
    const classes = useStyles();
    const {data: currentAvailabilityQueryResponse, refetch: refetchCurrentAvailabilityQuery, error: currentAvailabilityQueryError} = useQuery(GET_USER_CURRENT_AVAILABILITY);
    const [updateCurrentAvailabilityMutation, {error: updateCurrentAvailabilityMutationError}] = useMutation(OVERRIDE_CURRENT_AVAILABILITY);
    const [currentTimeSlot, setCurrentTimeSlot] = useState(null);
    const [progress, setProgress] = useState(0);
    const [remainingTime, setRemainingTime] = useState('');
    const [dropDownDisplayed, setDropDownDisplayed] = useState(false);

    const updateUI = () => {
        if(currentTimeSlot){
            const duration = currentTimeSlot.end - currentTimeSlot.start;
            const timeProgress = new Date().getTime() - currentTimeSlot.start;
            setProgress(timeProgress * 100 / duration);
            const remaining = currentTimeSlot.end - new Date().getTime();
            let {hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds} = getTimeElementsFromDuration(remaining);
            if(remainingSeconds > 0){
                remainingMinutes++;
            }
            const remainingTimeStr = `${remainingHours < 10 ? `0${remainingHours}` : remainingHours}:${remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes}`;
            setRemainingTime(remaining > 0 ? remainingTimeStr : '00:00');
        }
    };
    const clearTimers = () => {
        console.log('Cleaning timers:', firstUIUpdateTimeout, updateUIInterval, refetchStatusTimeout);
        if(firstUIUpdateTimeout){
            console.log("Cleaning firstUIUpdateTimeout");
            clearTimeout(firstUIUpdateTimeout);
            firstUIUpdateTimeout = null;
        }
        if(updateUIInterval) {
            console.log("Cleaning updateUIInterval");
            clearInterval(updateUIInterval);
            updateUIInterval = null;
        }
        if(refetchStatusTimeout){
            console.log("Cleaning refetchStatusTimeout");
            clearTimeout(refetchStatusTimeout);
            refetchStatusTimeout = null;
        }
        if(refetchStatusTimeInterval){
            console.log("Cleaning refetchStatusTimeInterval");
            clearInterval(refetchStatusTimeInterval);
            refetchStatusTimeInterval = null;
        }
    };
    const setupUIUpdateTimer = () => {
        if(firstUIUpdateTimeout){
            console.log("Cleaning firstUIUpdateTimeout");
            clearTimeout(firstUIUpdateTimeout);
            firstUIUpdateTimeout = null;
        }
        if(updateUIInterval) {
            console.log("Cleaning updateUIInterval");
            clearInterval(updateUIInterval);
            updateUIInterval = null;
        }
        if(currentTimeSlot){
            console.log("scheduling firstUIUpdateTimeout");
            //First time update the UI when the current minute is over and then every minute
            const now = new Date();
            const nextMinuteDate = new Date();
            nextMinuteDate.setMinutes(nextMinuteDate.getMinutes()+1, 0, 0);
            const {seconds} = getTimeElementsFromDuration(nextMinuteDate.getTime() - now.getTime());
            console.log("first UI update in:", seconds);
            firstUIUpdateTimeout = setTimeout( () => {
                updateUI();
                console.log("scheduling updateUIInterval");
                updateUIInterval = setInterval( async () => {
                    updateUI();
                }, 1000*60);
            }, seconds*1000);
        }
    };
    const setUpRefetchStatusTimer = () => {
        if(refetchStatusTimeout){
            console.log("Cleaning refetchStatusTimeout");
            clearTimeout(refetchStatusTimeout);
            refetchStatusTimeout = null;
        }
        if(currentTimeSlot){
            console.log("scheduling refetchStatusTimeout");
            const remaining = currentTimeSlot.end - new Date().getTime();
            refetchStatusTimeout = setTimeout(async _ => {
                clearTimers();
                await refetchCurrentAvailabilityQuery();
            }, remaining);
        }
    };
    const setupStatusCheckerTimeInterval = () => {
        if(refetchStatusTimeInterval){
            console.log("Cleaning refetchStatusTimeInterval");
            clearTimeout(refetchStatusTimeInterval);
            refetchStatusTimeInterval = null;
        }
        refetchStatusTimeInterval = setInterval( async () => {
            console.log("scheduling setupStatusCheckerTimeInterval");
            await refetchCurrentAvailabilityQuery()
        }, STATUS_CHECKER_TIME_INTERVAL);
    };
    const setupTimers = () => {
        clearTimers();
        if(currentTimeSlot){
            setupUIUpdateTimer();
            setUpRefetchStatusTimer();
        }
        setupStatusCheckerTimeInterval();
    };

    useEffect( () => {
        const updateCurrentAvailabilityHandler = async (event, newAvailability) => {
            const newAvailabilityMutation = await updateCurrentAvailabilityMutation({variables: {newAvailability}});
            setCurrentTimeSlot(newAvailabilityMutation.data.overrideCurrentAvailability);
        };
        ipcRenderer.on('update-current-availability', updateCurrentAvailabilityHandler);

        return () => {
            ipcRenderer.removeListener('update-current-availability', updateCurrentAvailabilityHandler);
        }
    }, []);
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
        clearTimers();
        if(currentTimeSlot ){
            console.log('Current timeSlot', currentTimeSlot);
            updateUI();
            if(currentWindow.isVisible()){
                console.log('Calling setup timer here');
                setupTimers();
            }
            const windowDidShowCallback = async  () => {
                console.log('Current status window did show!');
                console.log('Current timeSlot', currentTimeSlot, 'progress', progress);
                updateUI();
                await refetchCurrentAvailabilityQuery();
                setupTimers();
            };
            const windowDidHideCallback = () => {
                console.log('Current status window did hide!');
                clearTimers();
            };
            currentWindow.removeListener('show', windowDidShowCallback);
            currentWindow.on('show', windowDidShowCallback);
            currentWindow.removeListener('hide', windowDidHideCallback);
            currentWindow.on('hide', windowDidHideCallback);
            ipcRenderer.send('force-hide-change-status-dropdown');
            ipcRenderer.send('current-availability-updated');
            return () => {
                currentWindow.removeListener('show', windowDidShowCallback);
                currentWindow.removeListener('hide', windowDidHideCallback);
            }
        }
    }, [currentTimeSlot]);
    useEffect( () => {
        if(dropDownDisplayed){
            const dropDown = document.getElementsByClassName("my-status-title-dropdown")[0];
            const style = dropDown.currentStyle || window.getComputedStyle(dropDown);
            const marginLeft = parseInt(style.marginLeft.replace( /[^\d\.]*/g, ''));
            const numberOfOptions = (currentTimeSlot.status !== 'focus' && currentTimeSlot.status!== 'available') ? 2 : 1;
            ipcRenderer.send('display-change-status-dropdown-window', marginLeft, numberOfOptions);
        }
        const dropdownClosedListener = () => {
            setDropDownDisplayed(false);
        };
        ipcRenderer.removeListener('change-status-drop-down-closed', dropdownClosedListener);
        ipcRenderer.on('change-status-drop-down-closed',  dropdownClosedListener);

        return () => {
            ipcRenderer.removeListener('change-status-drop-down-closed', dropdownClosedListener);
        }
    }, [dropDownDisplayed, setDropDownDisplayed]);

    const onDropDownClick = () => {
        setDropDownDisplayed(!dropDownDisplayed);
    };

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
            case 'lunch':
            {
                styles = classes.staticLunch;
                title = 'Meal';
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
            <div className="my-status-container">
                <div className='my-status-circular-progress'>
                    <CircularProgress className={classes.staticNeutral} size={150}  variant="static" value={100} />
                    <CircularProgress className={styles} size={150}  variant="static" value={progress} />
                    <div className="my-status-time-remaining">{remainingTime}</div>
                </div>
                <div className='my-status-title-dropdown' onClick={onDropDownClick}>
                    <p style={{backgroundColor: dropDownBackgroundColor}} className='my-status-title'>{title}</p>
                    <img className='my-status-title-chevron' src={Chevron} alt="chevron"/>
                </div>
            </div>
        )
    }

};

export default CurrentStatus;