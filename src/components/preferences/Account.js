import React, {useState, useEffect} from 'react';
import {GET_SKILLS, GET_USER_PROFILE, UPDATE_USER_PROFILE} from '../../graphql/queries';
import {useQuery, useMutation} from "@apollo/react-hooks";
import {TeleportTextField} from '../../utils/css';

import './preferences.css'

const Account = function () {
    const skillsQuery = useQuery(GET_SKILLS);
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

    useEffect( () => {
        if(userProfileQueryData && userProfileQueryData.user){
            const {user} = userProfileQueryData;
            setFullName(`${user.firstName} ${user.lastName}`);
            setPreviousFullName(`${user.firstName} ${user.lastName}`);
            setEmailAddress(user.emailAddress);
            setJobTitle(user.jobTitle);
            setPreviousJobTitle(user.jobTitle);
            setSkill(user.skills[0].id);
            setPreviousSkill(user.skills[0].id);
            setProfilePictureURL(user.profilePictureURL);
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
                const test = await updateUserProfile({variables: updates});
                console.log(test.data);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn)
    }, [fullName, previousFullName, jobTitle, previousJobTitle, skill, previousSkill]);

    if(userProfileQueryData && userProfileQueryData.user){
        return (
            <div className='preferences-account-container'>
                <ul className='preferences-account-profile-fields-list'>
                    <li>
                        <TeleportTextField
                            className='preferences-text-field'
                            label="Full name"
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
                            label="Email Address"
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
                            label="Job Title"
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
                            label="Expertise"
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
                                                {s.name}
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
                <img className="preferences-account-profile-picture" src={profilePictureURL} alt="profile-picture" />
            </div>
        );
    }else{
        return <div className='preferences-account-container' />
    }

};

export default Account;