import React, {useEffect, useState} from 'react';
import {GET_AVAILABILITY_PROFILES} from '../../graphql/queries';
import {useQuery} from "@apollo/react-hooks";
import {timeOptions, getTimestampFromLocalTodayTime} from '../../utils/dateTime';
import {sampleScheduleForAvailabilityProfile} from '../../utils/availability';
import {TeleportTextField} from "../../utils/css"
import './onboarding.css';
import CalendarPreview from "../Calendar/CalendarPreview";

const DEFAULT_LUNCH_DURATION_IN_MINUTES = 60;

const AvailabilityProfile = function ({onConfirmButtonClick, userProfile}) {
    const [timePickerOptions] = useState(timeOptions());
    const availabilityProfileQuery = useQuery(GET_AVAILABILITY_PROFILES);
    const [sampleSchedule, setSampleSchedule] = useState(null);
    const [startWorkTime, setStartWorkTime] = useState(userProfile.preferences.startWorkTime);
    const [lunchTime, setLunchTime] = useState(userProfile.preferences.lunchTime);
    const [endWorkTime, setEndWorkTime] = useState(userProfile.preferences.endWorkTime);
    const [availabilityProfileId, setAvailabilityProfileId] = useState(userProfile.availabilityProfile.id);

    useEffect( () => {
        if(availabilityProfileQuery.data && availabilityProfileQuery.data.availabilityProfiles){
            const selectedAvailability = availabilityProfileQuery.data.availabilityProfiles.find( ap => { return ap.id === availabilityProfileId});
            setSampleSchedule(sampleScheduleForAvailabilityProfile(
                getTimestampFromLocalTodayTime(startWorkTime),
                getTimestampFromLocalTodayTime(lunchTime),
                getTimestampFromLocalTodayTime(endWorkTime),
                DEFAULT_LUNCH_DURATION_IN_MINUTES,
                selectedAvailability
            ));
        }

    }, [availabilityProfileQuery.data, startWorkTime, lunchTime, endWorkTime, availabilityProfileId]);
    useEffect( () => {
    }, [sampleSchedule]);

    return (
        <div className='availability-profile-container'>
            <div className="main-title">Let's get started! 👋</div>
            <div className="secondary-title">Tell us about your typical day 🗓</div>
            <div className='availability-profile-left'>
                <ul className='user-availability-profile-fields'>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label="You start work at"
                            InputLabelProps={{
                                shrink: true,
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
                            className='onboarding-text-field'
                            label="You have lunch at"
                            InputLabelProps={{
                                shrink: true,
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
                            className='onboarding-text-field'
                            label="You stop working at"
                            InputLabelProps={{
                                shrink: true,
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
                            className='onboarding-text-field'
                            label="You usually are"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            SelectProps={{
                                native: true,
                                value: availabilityProfileId,
                                onChange: (e) => {setAvailabilityProfileId(e.target.value);}
                            }}
                            select
                        >
                            {availabilityProfileQuery.data && availabilityProfileQuery.data.availabilityProfiles ?
                                (
                                    availabilityProfileQuery.data.availabilityProfiles.map( ap => {
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
                <div className="confirm-button-position confirm-button" onClick={onConfirmButtonClick ? onConfirmButtonClick : null}>Continue</div>
            </div>

            <div className='availability-profile-right'>
                {sampleSchedule ?
                    (
                        <CalendarPreview startDayTime={getTimestampFromLocalTodayTime(startWorkTime)} endDayTime={getTimestampFromLocalTodayTime(endWorkTime)} schedule={sampleSchedule}/>
                    ) : (
                        ''
                    )}
            </div>
        </div>
    );
};

export default AvailabilityProfile;