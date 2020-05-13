import React, {useEffect, useState} from 'react'
import {useQuery} from "@apollo/react-hooks";
import {GET_USER_NEXT_AVAILABILITY} from "../../graphql/queries";
import ChangeStatusDropdownItem from './ChangeStatusDropdownItem'

const {ipcRenderer} = window.require('electron');

const ChangeCurrentStatus = function () {
    const [currentAvailability, setCurrentAvailability] = useState(null);
    const [nextAvailability, setNextAvailability] = useState(null);
    const [refetchTimeout, setRefetchTimeout] = useState(null);
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
        ipcRenderer.on('window-did-show', async () => {
            console.log('Change status dropdown window did show!');
        });
        ipcRenderer.on('window-did-hide', () => {
            console.log('Change status dropdown window did hide!');
        });
    }, []);
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
            if(refetchTimeout)  clearTimeout(refetchTimeout);
            const timeoutDuration = currentAvailability.end - new Date().getTime();
            setRefetchTimeout( setTimeout( async () => {
                await refetchAvailabilityQuery();
            }), timeoutDuration);
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