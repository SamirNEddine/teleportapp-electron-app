import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {timeOptions} from '../../utils/dateTime';
import {TeleportPrimarySwitch, TeleportFormControl, TeleportTextField} from '../../utils/css';
import {useMutation, useQuery} from "@apollo/react-hooks";
import {GET_USER_PREFERENCES, UPDATE_USER_PREFERENCES} from "../../graphql/queries";
import {isUserLoggedIn, shouldLaunchAtLogin, updateShouldLaunchAtLogin} from '../../helpers/localStorage'

const {ipcRenderer} = window.require('electron');

const GeneralSettings = function () {
    const [timePickerOptions] = useState(timeOptions(15));
    const { t, ready: translationsReady } = useTranslation('Preferences', { useSuspense: false });
    const {data: userPreferencesQueryData, error: userPreferencesQueryError}  = useQuery(GET_USER_PREFERENCES, { fetchPolicy: "network-only", skip:!isUserLoggedIn() });
    const [updateUserPreferences, {error: preferencesMutationError}] = useMutation(UPDATE_USER_PREFERENCES);
    const [startWorkTime, setStartWorkTime] = useState('');
    const [dailySetupTime, setDailySetupTime] = useState('');
    const [previousDailySetupTime, setPreviousDailySetupTime] = useState(null);
    const [shouldStartAtLogin, setShouldStartAtLogin] = useState(shouldLaunchAtLogin());

    const updatePreferencesState = (preferences) => {
        setStartWorkTime(preferences.startWorkTime);
        setDailySetupTime(preferences.dailySetupTime);
        setPreviousDailySetupTime(preferences.dailySetupTime);
    };

    useEffect( () => {
        if(userPreferencesQueryData && userPreferencesQueryData.user.preferences){
            updatePreferencesState(userPreferencesQueryData.user.preferences);
        }
    }, [userPreferencesQueryData]);
    useEffect( () => {
        const delayDebounceFn = setTimeout(async () => {
            const updates = {};
            if(previousDailySetupTime && dailySetupTime.length > '' && dailySetupTime !== previousDailySetupTime){
                updates['dailySetupTime'] = dailySetupTime;
            }
            if(Object.keys(updates).length > 0){
                const {data} = await updateUserPreferences({variables: updates});
                if(data && data.updateUserPreferences){
                    updatePreferencesState(data.updateUserPreferences);
                    if(updates['dailySetupTime']) {
                        ipcRenderer.send('daily-setup-time-changed');
                    }
                }
            }
        }, 100);

        return () => clearTimeout(delayDebounceFn)
    }, [dailySetupTime]);
    useEffect( () => {
        updateShouldLaunchAtLogin(shouldStartAtLogin);
        ipcRenderer.send('login-item-changed');
    }, [shouldStartAtLogin]);

    if(!translationsReady) {
        return <div className='preferences-general-settings-container' />;
    }else {
        return (
            <div className='preferences-general-settings-container'>
                <ul className='preferences-general-settings-item-list'>
                    {userPreferencesQueryData && userPreferencesQueryData.user ?
                        (
                            <li>
                                <div className='preferences-general-settings-daily-setup-time'>
                                    <TeleportFormControl
                                        control={<TeleportPrimarySwitch checked={dailySetupTime !== 'none'} onChange={(e) => {e.target.checked ? setDailySetupTime(startWorkTime) : setDailySetupTime('none')}} name="dailySetupNotification" />}
                                        label={t('PREFERENCES-GENERAL-ENABLE_DAILY_SETUP')}
                                    />
                                    {dailySetupTime !== 'none' ?
                                        (
                                            <TeleportTextField
                                                className='preferences-text-field preferences-general-settings-daily-setup-time-text-field'
                                                label={t('PREFERENCES-GENERAL-DAILY_SETUP_TIME')}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                InputProps={{
                                                    startAdornment: `${t('PREFERENCES-GENERAL-DAILY_SETUP_TIME-EMOJI')} `
                                                }}
                                                SelectProps={{
                                                    native: true,
                                                    value: dailySetupTime,
                                                    onChange: (e) => {setDailySetupTime(e.target.value);}
                                                }}
                                                select
                                            >
                                                {timePickerOptions.filter( t => {  return (parseInt(t.time) >= (parseInt(startWorkTime)-100) && parseInt(t.time) <= (parseInt(startWorkTime)+100))}).map( to => {return to.optionDiv})}
                                            </TeleportTextField>
                                        ) : (
                                            ''
                                        )
                                    }
                                </div>
                            </li>
                        ) : (
                            ''
                        )
                    }
                    <li>
                        <TeleportFormControl
                            control={<TeleportPrimarySwitch checked={shouldStartAtLogin} onChange={(e) => {setShouldStartAtLogin(e.target.checked)}}  name="startAtLogin" />}
                            label={t('PREFERENCES-GENERAL-START_TELEPORT_AT_LOGIN')}
                        />
                    </li>
                </ul>
            </div>
        )
    }
};

export default GeneralSettings;