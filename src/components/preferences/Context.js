import React, {useEffect, useState} from 'react';
import {timeOptions, getTimestampFromLocalTodayTime} from '../../utils/dateTime';
import {
    GET_AVAILABILITY_PROFILES,
    GET_USER_AVAILABILITY_PROFILE,
    GET_USER_PREFERENCES,
    UPDATE_USER_PREFERENCES,
    UPDATE_USER_AVAILABILITY_PROFILE,
} from '../../graphql/queries';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {TeleportTextField} from "../../utils/css"

import './preferences.css';


const Context = function () {
    const [timePickerOptions] = useState(timeOptions());
    const {data: availabilityProfilesQueryData, error: availabilityProfilesQueryError}  = useQuery(GET_AVAILABILITY_PROFILES);
    const {data: userAvailabilityProfileQueryData, error: userAvailabilityProfileQueryError}  = useQuery(GET_USER_AVAILABILITY_PROFILE);
    const [updateUserPreferences, {error: preferencesMutationError}] = useMutation(UPDATE_USER_PREFERENCES);
    const [updateUserAvailabilityProfile, {error: availabilityProfileMutationError}] = useMutation(UPDATE_USER_AVAILABILITY_PROFILE);
    const [startWorkTime, setStartWorkTime] = useState('');
    const [previousStartWorkTime, setPreviousStartWorkTime] = useState('');
    const [lunchTime, setLunchTime] = useState('');
    const [previousLunchTime, setPreviousLunchTime] = useState('');
    const [endWorkTime, setEndWorkTime] = useState('');
    const [previousEndWorkTime, setPreviousEndWorkTime] = useState('');
    const [availabilityProfileId, setAvailabilityProfileId] = useState('');
    const [previousAvailabilityProfileId, setPreviousAvailabilityProfileId] = useState('');

    return (
        <div className='preferences-context-container'/>
    )
};

export default Context;