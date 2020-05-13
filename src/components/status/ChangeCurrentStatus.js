import React, {useEffect, useState} from 'react'
import {useQuery} from "@apollo/react-hooks";
import {GET_USER_NEXT_AVAILABILITY} from "../../graphql/queries";
import ChangeStatusDropdownItem from './ChangeStatusDropdownItem'

const currentWindow = window.require('electron').remote.getCurrentWindow();
let refetchTimeout = null;

const ChangeCurrentStatus = function () {
    const [currentAvailability, setCurrentAvailability] = useState(null);
    const [nextAvailability, setNextAvailability] = useState(null);
    const {data: availabilityQueryData, refetch: refetchAvailabilityQuery,  error: availabilityQueryError} = useQuery(GET_USER_NEXT_AVAILABILITY);

    const renderSetStatusOptions = () => {
        const statusOptions = ['available', 'focus'].filter( status => {return status !== currentAvailability.status});
        const options = [];
        for(let i=0; i<statusOptions.length; i++){
            const status = statusOptions[i];
            const timeSlot = {
                start: currentAvailability.start,
                end: currentAvailability.end,
                status
            };
            if(nextAvailability.status === status) {
                timeSlot.end = nextAvailability.end;
            }
            options.push(<li key={status}><ChangeStatusDropdownItem timeSlot={timeSlot} isLast={i === statusOptions.length-1}/></li>);
        }
        return options;
    };

    useEffect( () => {
        if(!availabilityQueryError && availabilityQueryData && availabilityQueryData.user) {
            setCurrentAvailability({
                start: parseInt(availabilityQueryData.user.currentAvailability.start),
                end: parseInt(availabilityQueryData.user.currentAvailability.end),
                status: availabilityQueryData.user.currentAvailability.status
            });
            setNextAvailability({
                start: parseInt(availabilityQueryData.user.nextAvailability.start),
                end: parseInt(availabilityQueryData.user.nextAvailability.end),
                status: availabilityQueryData.user.nextAvailability.status
            });
        }
    }, [availabilityQueryData]);
    useEffect( () => {
        if(currentAvailability){
            const cleanTimer = () => {
                if(refetchTimeout){
                    clearTimeout(refetchTimeout);
                    refetchTimeout = null;
                }
            };
            const setupTimer = () => {
                const timeoutDuration = currentAvailability.end - new Date().getTime();
                refetchTimeout = setTimeout( async () => {
                    await refetchAvailabilityQuery();
                }, timeoutDuration);
            };
            cleanTimer();
            setupTimer();
            const windowDidShowCallback = async  () => {
                console.log('Change status dropdown window did show!');
                await refetchAvailabilityQuery();
            };
            currentWindow.removeListener('show', windowDidShowCallback);
            currentWindow.on('show', windowDidShowCallback);
            return () => {
                currentWindow.removeListener('show', windowDidShowCallback);
            }

        }
    }, [currentAvailability]);

    return (
        <div className='change-current-status-container'>
            <ul className='change-current-status-options-list'>
                {currentAvailability && nextAvailability ? renderSetStatusOptions() : ''}
            </ul>
        </div>
    )
};

export default ChangeCurrentStatus;