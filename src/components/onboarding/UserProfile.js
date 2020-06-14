import React, {useState, useEffect} from 'react';
import {GET_SKILLS, UPDATE_USER_PROFILE} from '../../graphql/queries';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {useTranslation} from 'react-i18next';
import {getRandomInt} from '../../utils/number';
import {TeleportTextField} from '../../utils/css';
import './onboarding.css'
import {AnalyticsEvents} from '../../helpers/AnalyticsEvents';

const {ipcRenderer} = window.require('electron');

const UserProfile = function ({onConfirmButtonClick, userProfile}) {
    const skillsQuery = useQuery(GET_SKILLS);
    const { t, ready: translationsReady } = useTranslation('Onboarding', { useSuspense: false });
    const [updateUserProfile, {error}] = useMutation(UPDATE_USER_PROFILE);
    const [fullName, setFullName] = useState(`${userProfile.firstName} ${userProfile.lastName}`);
    const [jobTitle, setJobTitle] = useState(userProfile.jobTitle);
    const [skill, setSkill] = useState((userProfile.skills.length > 0 ? userProfile.skills[0].id : ''));
    const [validatable, setValidatable] = useState(false);

    useEffect( () => {
        ipcRenderer.send('track-analytics-event', AnalyticsEvents.ONBOARDING_PROFILE_DISPLAYED);
    }, []);
    useEffect( () => {
        if (skill.length === 0 && skillsQuery.data && skillsQuery.data.skills) {
            const randomSkill = skillsQuery.data.skills[getRandomInt(0, skillsQuery.data.skills.length-1)].id;
            setSkill(randomSkill)
        }
    }, [skillsQuery.data]);
    useEffect( () => {
        if(!fullName || fullName.length === 0 || !jobTitle || jobTitle.length === 0) {
            setValidatable(false);
        }else {
            setValidatable(true);
        }
    }, [fullName, jobTitle]);

    const onConfirm = async function () {
        if(validatable && !updateUserProfile.loading && onConfirmButtonClick){
            const firstName = fullName.split(' ').slice(0, 1).join(' ');
            const lastName = fullName.split(' ').slice(1).join(' ');
            const skills = [skill];
            await updateUserProfile({variables: {firstName, lastName, jobTitle, skills}});
            onConfirmButtonClick();
        }
    };

    if(!translationsReady){
        return <div className='user-profile-container' />;
    }else {
        return (
            <div className='user-profile-container'>
                <div className="main-title">{t('PROFILE-TITLE')}</div>
                <div className="secondary-title">{t('PROFILE-SUBTITLE')}</div>
                <ul className='user-profile-fields'>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label={t('PROFILE-FULLNAME')}
                            value={fullName}
                            onChange={(e) => {setFullName(e.target.value);}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label={t('PROFILE-EMAIL')}
                            defaultValue={userProfile.emailAddress}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label={t('PROFILE-JOB_TITLE')}
                            value={jobTitle}
                            onChange={(e) => {setJobTitle(e.target.value);}}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label={t('PROFILE-EXPERTISE')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            SelectProps={{
                                native: true,
                                value: skill,
                                onChange: (e) => {setSkill(e.target.value);}
                            }}
                            select
                        >
                            {skillsQuery.data && skillsQuery.data.skills ?
                                (
                                    skillsQuery.data.skills.map( s => {
                                        return (
                                            <option key={s.key} value={s.id}>
                                                {t(`PROFILE-EXPERTISE-${s.key}`)}
                                            </option>
                                        )
                                    })
                                ) : (
                                    <option key='loading' value='loading'>
                                        {t(`PROFILE-EXPERTISE-LOADING`)}
                                    </option>
                                )}
                        </TeleportTextField>
                    </li>
                </ul>
                <img className="user-profile-picture" src={userProfile.profilePictureURL} alt="profile-picture" />
                <div
                    className={`confirm-button-position ${validatable && !updateUserProfile.loading ? 'confirm-button' : 'confirm-button-disabled'}`}
                    onClick={onConfirm}
                >
                    {t(`PROFILE-CONFIRM`)}
                </div>
            </div>
        );
    }
};

export default UserProfile;