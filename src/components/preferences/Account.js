import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {GET_SKILLS, GET_USER_PROFILE, UPDATE_USER_PROFILE} from '../../graphql/queries';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {TeleportTextField} from '../../utils/css';

import './preferences.css'

const Account = function () {
    const skillsQuery = useQuery(GET_SKILLS);
    const { t, ready: translationsReady } = useTranslation('Preferences', { useSuspense: false });
    const {data: userProfileQueryData, error: userProfileQueryError} = useQuery(GET_USER_PROFILE, { fetchPolicy: "network-only" });
    const [updateUserProfile, {error: updateUserProfileError}] = useMutation(UPDATE_USER_PROFILE);
    const [fullName, setFullName] = useState('');
    const [previousFullName, setPreviousFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [previousJobTitle, setPreviousJobTitle] = useState('');
    const [skill, setSkill] = useState('');
    const [previousSkill, setPreviousSkill] = useState('');
    const [profilePictureURL, setProfilePictureURL] = useState(null);

    const updateFieldsValue = (user) => {
        setFullName(`${user.firstName} ${user.lastName}`);
        setPreviousFullName(`${user.firstName} ${user.lastName}`);
        setEmailAddress(user.emailAddress);
        setJobTitle(user.jobTitle);
        setPreviousJobTitle(user.jobTitle);
        setSkill(user.skills[0].id);
        setPreviousSkill(user.skills[0].id);
        setProfilePictureURL(user.profilePictureURL);
    };
    useEffect( () => {
        if(userProfileQueryData && userProfileQueryData.user){
            const {user} = userProfileQueryData;
            updateFieldsValue(user);
        }
    }, [userProfileQueryData]);
    useEffect( () => {
        const delayDebounceFn = setTimeout(async () => {
            const updates = {};
            if(fullName !== previousFullName && fullName.length >= 2){
                const firstName = fullName.split(' ').slice(0, 1).join(' ');
                const lastName = fullName.split(' ').slice(1).join(' ');
                updates['firstName'] = firstName;
                updates['lastName'] = lastName;
            }
            if(jobTitle !== previousJobTitle && jobTitle.length >= 3){
                updates['jobTitle'] = jobTitle;
            }
            if(skill !== previousSkill && skill.length > 0){
                updates['skills'] = [skill];
            }
            if(Object.keys(updates).length > 0){
                const {data} = await updateUserProfile({variables: updates});
                if(data && data.updateUserProfile){
                    updateFieldsValue(data.updateUserProfile);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn)
    }, [fullName, previousFullName, jobTitle, previousJobTitle, skill, previousSkill]);

    if(translationsReady && userProfileQueryData && userProfileQueryData.user){
        return (
            <div className='preferences-account-container'>
                <ul className='preferences-account-profile-fields-list'>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label={t('PREFERENCES-ACCOUNT-FULLNAME')}
                            value={fullName}
                            onChange={(e) => {setFullName(e.target.value);}}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error = {fullName.length === 0}
                            helperText = {fullName.length === 0 ? 'Required' : ''}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label={t('PREFERENCES-ACCOUNT-EMAIL')}
                            value={emailAddress}
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
                            className='preferences-text-field'
                            label={t('PREFERENCES-ACCOUNT-JOB_TITLE')}
                            value={jobTitle}
                            onChange={(e) => {setJobTitle(e.target.value);}}
                            InputLabelProps={{
                                shrink: true
                            }}
                            error = {jobTitle.length === 0}
                            helperText = {jobTitle.length === 0 ? 'Required' : ''}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label={t('PREFERENCES-ACCOUNT-EXPERTISE')}
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
                                                {t(`PREFERENCES-ACCOUNT-EXPERTISE-${s.key}`)}
                                            </option>
                                        )
                                    })
                                ) : (
                                    <option key='loading' value='loading'>
                                        {t(`PREFERENCES-ACCOUNT-EXPERTISE-LOADING`)}
                                    </option>
                                )}
                        </TeleportTextField>
                    </li>
                </ul>
                <img className="preferences-account-profile-picture" src={profilePictureURL} alt="profile-picture" />
            </div>
        );
    }else{
        return <div className='preferences-account-container' />
    }

};

export default Account;