import React, {useEffect, useState} from 'react';
import {timeOptions, lunchDurationOptions} from '../../utils/dateTime';
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

const {ipcRenderer} = window.require('electron');

const Context = function () {
    const [timePickerOptions] = useState(timeOptions());
    const [lunchDurationPickerOptions] = useState(lunchDurationOptions());
    const {data: availabilityProfilesQueryData, error: availabilityProfilesQueryError}  = useQuery(GET_AVAILABILITY_PROFILES);
    const {data: userPreferencesQueryData, error: userPreferencesQueryError}  = useQuery(GET_USER_PREFERENCES, { fetchPolicy: "network-only"});
    const {data: userAvailabilityProfileQueryData, error: userAvailabilityProfileQueryError}  = useQuery(GET_USER_AVAILABILITY_PROFILE, { fetchPolicy: "network-only" });
    const [updateUserPreferences, {error: preferencesMutationError}] = useMutation(UPDATE_USER_PREFERENCES);
    const [updateUserAvailabilityProfile, {error: availabilityProfileMutationError}] = useMutation(UPDATE_USER_AVAILABILITY_PROFILE);
    const [startWorkTime, setStartWorkTime] = useState('');
    const [previousStartWorkTime, setPreviousStartWorkTime] = useState(null);
    const [lunchTime, setLunchTime] = useState('');
    const [previousLunchTime, setPreviousLunchTime] = useState(null);
    const [lunchDuration, setLunchDuration] = useState(0);
    const [previousLunchDuration, setPreviousLunchDuration] = useState(null);
    const [endWorkTime, setEndWorkTime] = useState('');
    const [previousEndWorkTime, setPreviousEndWorkTime] = useState(null);
    const [availabilityProfileId, setAvailabilityProfileId] = useState('');
    const [previousAvailabilityProfileId, setPreviousAvailabilityProfileId] = useState(null);

    const updatePreferencesFields = (preferences) => {
        setStartWorkTime(preferences.startWorkTime);
        setPreviousStartWorkTime(preferences.startWorkTime);
        setLunchTime(preferences.lunchTime);
        setPreviousLunchTime(preferences.lunchTime);
        setLunchDuration(preferences.lunchDurationInMinutes);
        setPreviousLunchDuration(preferences.lunchDurationInMinutes);
        setEndWorkTime(preferences.endWorkTime);
        setPreviousEndWorkTime(preferences.endWorkTime);
    };
    const updateUserProfileField = (profileId) => {
        setAvailabilityProfileId(profileId);
        setPreviousAvailabilityProfileId(profileId);
    };

    useEffect( () => {
        if(userPreferencesQueryData){
            updatePreferencesFields(userPreferencesQueryData.user.preferences);
        }
    }, [userPreferencesQueryData]);
    useEffect( () => {
        if(userAvailabilityProfileQueryData){
            updateUserProfileField(userAvailabilityProfileQueryData.user.availabilityProfile.id);
        }
    }, [userAvailabilityProfileQueryData]);
    useEffect( () => {
        const delayDebounceFn = setTimeout(async () => {
            const updates = {};
            if(previousStartWorkTime && startWorkTime.length > '' && startWorkTime !== previousStartWorkTime){
                updates['startWorkTime'] = startWorkTime;
            }
            if(previousLunchTime && lunchTime.length > '' && lunchTime !== previousLunchTime){
                updates['lunchTime'] = lunchTime;
            }
            if(previousLunchDuration && lunchDuration > 0 && lunchDuration !== previousLunchDuration){
                console.log('here');
                updates['lunchDurationInMinutes'] = lunchDuration;
                console.log(updates);
            }
            if(previousEndWorkTime && endWorkTime.length > '' && endWorkTime !== previousEndWorkTime){
                updates['endWorkTime'] = endWorkTime;
            }
            if(Object.keys(updates).length > 0){
                const {data} = await updateUserPreferences({variables: updates});
                if(data && data.updateUserPreferences){
                    updatePreferencesFields(data.updateUserPreferences);
                    ipcRenderer.send('context-params-changed');
                }
            }
        }, 100);

        return () => clearTimeout(delayDebounceFn)
    }, [startWorkTime, previousStartWorkTime, lunchTime, previousLunchTime, lunchDuration, previousLunchDuration, endWorkTime, previousEndWorkTime]);
    useEffect( () => {
        const delayDebounceFn = setTimeout(async () => {
            if(previousAvailabilityProfileId && availabilityProfileId.length > '' && availabilityProfileId !== previousAvailabilityProfileId){
                const {data} = await updateUserAvailabilityProfile({variables: {availabilityProfileId}});
                if(data && data.updateAvailabilityProfile){
                    updateUserProfileField(data.updateAvailabilityProfile.id);
                    ipcRenderer.send('context-params-changed');
                }
            }
        }, 100);

        return () => clearTimeout(delayDebounceFn)
    }, [availabilityProfileId, previousAvailabilityProfileId]);

    if(userPreferencesQueryData && userPreferencesQueryData.user.preferences){
        return (
            <div className='preferences-context-container'>
                <ul className='preferences-context-fields'>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label="You start work at"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: '☕️ '
                            }}
                            SelectProps={{
                                native: true,
                                value: startWorkTime,
                                onChange: (e) => {setStartWorkTime(e.target.value);}
                            }}
                            select
                        >
                            {timePickerOptions.filter( t => {  return parseInt(t.time) < parseInt('1430')}).map( to => {return to.optionDiv})}
                        </TeleportTextField>
                    </li>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label="You have your meal break at"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: '🍽️ '
                            }}
                            SelectProps={{
                                native: true,
                                value: lunchTime,
                                onChange: (e) => {setLunchTime(e.target.value);}
                            }}
                            select
                        >
                            {timePickerOptions.filter( t => {  return (parseInt(t.time) > (parseInt(startWorkTime)+100) && parseInt(t.time) < (parseInt(startWorkTime)+700))}).map( to => {return to.optionDiv})}
                        </TeleportTextField>
                    </li>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label="Your meal break duration is"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: '🍽️ '
                            }}
                            SelectProps={{
                                native: true,
                                value: lunchDuration,
                                onChange: (e) => {setLunchDuration(parseInt(e.target.value));}
                            }}
                            select
                        >
                            {lunchDurationPickerOptions.map( (option) => {return option.optionDiv})}
                        </TeleportTextField>
                    </li>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label="You stop working at"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: '🛌️ '
                            }}
                            SelectProps={{
                                native: true,
                                value: endWorkTime,
                                onChange: (e) => {setEndWorkTime(e.target.value);}
                            }}
                            select
                        >
                            {timePickerOptions.filter( t => {  return parseInt(t.time) > (parseInt(lunchTime)+200)}).map( to => {return to.optionDiv})}
                        </TeleportTextField>
                    </li>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label="You usually are"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: '📅 '
                            }}
                            SelectProps={{
                                native: true,
                                value: availabilityProfileId,
                                onChange: (e) => {setAvailabilityProfileId(e.target.value);}
                            }}
                            select
                        >
                            {availabilityProfilesQueryData && availabilityProfilesQueryData.availabilityProfiles ?
                                (
                                    availabilityProfilesQueryData.availabilityProfiles.map( ap => {
                                        return (
                                            <option key={ap.key} value={ap.id}>
                                                {ap.name}
                                            </option>
                                        )
                                    })
                                ) : (
                                    <option key='loading' value='loading'>
                                        Loading...
                                    </option>
                                )}
                        </TeleportTextField>
                    </li>
                </ul>
            </div>
        )
    }else{
        return <div/>
    }

};

export default Context;