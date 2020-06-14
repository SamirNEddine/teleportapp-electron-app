import React, {useEffect, useState} from 'react';
import {
    GET_AVAILABILITY_PROFILES,
    UPDATE_USER_PREFERENCES,
    UPDATE_USER_AVAILABILITY_PROFILE,
} from '../../graphql/queries';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {useTranslation} from 'react-i18next';
import {timeOptions, getTimestampFromLocalTodayTime} from '../../utils/dateTime';
import {sampleScheduleForAvailabilityProfile} from '../../utils/availability';
import {TeleportTextField} from "../../utils/css"
import './onboarding.css';
import CalendarPreview from "../Calendar/CalendarPreview";
import {AnalyticsEvents} from "../../helpers/AnalyticsEvents";

const {ipcRenderer} = window.require('electron');

const DEFAULT_LUNCH_DURATION_IN_MINUTES = 60;

const AvailabilityProfile = function ({onConfirmButtonClick, userProfile}) {
    const [timePickerOptions] = useState(timeOptions());
    const { t, ready: translationsReady } = useTranslation('Onboarding', { useSuspense: false });
    const availabilityProfileQuery = useQuery(GET_AVAILABILITY_PROFILES);
    const [updateUserPreferences, {error: preferencesMutationError}] = useMutation(UPDATE_USER_PREFERENCES);
    const [updateUserAvailabilityProfile, {error: availabilityProfileMutationError}] = useMutation(UPDATE_USER_AVAILABILITY_PROFILE);
    const [sampleSchedule, setSampleSchedule] = useState(null);
    const [startWorkTime, setStartWorkTime] = useState(userProfile.preferences.startWorkTime);
    const [lunchTime, setLunchTime] = useState(userProfile.preferences.lunchTime);
    const [endWorkTime, setEndWorkTime] = useState(userProfile.preferences.endWorkTime);
    const [availabilityProfileId, setAvailabilityProfileId] = useState(userProfile.availabilityProfile.id);

    useEffect( () => {
        ipcRenderer.send('track-analytics-event', AnalyticsEvents.ONBOARDING_CONTEXT_DISPLAYED);
    }, []);
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

    const onConfirm = async function() {
        if(onConfirmButtonClick){
            await updateUserPreferences({variables: {startWorkTime, lunchTime, endWorkTime}});
            await updateUserAvailabilityProfile({variables: {availabilityProfileId}});
            onConfirmButtonClick();
        }
    };

    if(!translationsReady){
        return <div className='availability-profile-container' />;
    }else{
        return (
            <div className='availability-profile-container'>
                <div className="main-title">{t('ONBOARDING.CONTEXT.TITLE')}</div>
                <div className="secondary-title">{t('ONBOARDING.CONTEXT.SUBTITLE')}</div>
                <div className='availability-profile-left'>
                    <ul className='user-availability-profile-fields'>
                        <li>
                            <TeleportTextField
                                className='onboarding-text-field'
                                label={t('CONTEXT-START_WORK')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: `${t('CONTEXT-START_WORK_EMOJI')} `
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
                                label={t('CONTEXT-LUNCH')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: `${t('CONTEXT-LUNCH_EMOJI')} `
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
                                label={t('CONTEXT-END_WORK')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: `${t('CONTEXT-END_WORK_EMOJI')} `
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
                                label={t('CONTEXT-AVAILABILITY_PROFILE')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: `${t('CONTEXT-AVAILABILITY_PROFILE_EMOJI')} `
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
                                                    {t(`CONTEXT-AVAILABILITY_PROFILE-${ap.key}`)}
                                                </option>
                                            )
                                        })
                                    ) : (
                                        <option key='loading' value='loading'>
                                            {t('CONTEXT-AVAILABILITY_PROFILE-LOADING')}
                                        </option>
                                    )}
                            </TeleportTextField>
                        </li>
                    </ul>
                    <div
                        className={`confirm-button-position ${updateUserPreferences.loading || updateUserAvailabilityProfile.loading ? 'confirm-button-disabled' : 'confirm-button'}`}
                        onClick={onConfirm}
                    >
                        {t('CONTEXT-CONFIRM')}
                    </div>
                </div>

                <div className='availability-profile-right'>
                    <div className='availability-profile-right-title'>{t('CONTEXT-CALENDAR_PREVIEW-TITLE')}</div>
                    {sampleSchedule ?
                        (
                            <CalendarPreview startDayTime={getTimestampFromLocalTodayTime(startWorkTime)} endDayTime={getTimestampFromLocalTodayTime(endWorkTime)} schedule={sampleSchedule}/>
                        ) : (
                            ''
                        )}
                </div>
            </div>
        );
    }
};

export default AvailabilityProfile;