import React, {useState} from 'react';
import {GET_SKILLS} from '../../graphql/queries';
import {useQuery} from "@apollo/react-hooks";
import {TeleportTextField} from '../../utils/css';
import './onboarding.css'

const UserProfile = function ({onConfirmButtonClick, userProfile}) {
    const skillsQuery = useQuery(GET_SKILLS);

    return (
        <div className='user-profile-container'>
            <div className="main-title">Welcome! 👋</div>
            <div className="secondary-title">Is it correct? Check your info:</div>
            <ul className='user-profile-fields'>
                <li>
                    <TeleportTextField
                        className='onboarding-text-field'
                        label="Full name"
                        defaultValue={`${userProfile.firstName} ${userProfile.lastName}`}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </li>
                <li>
                    <TeleportTextField
                        className='onboarding-text-field'
                        label="Email Address"
                        defaultValue={userProfile.emailAddress}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </li>
                <li>
                    <TeleportTextField
                        className='onboarding-text-field'
                        label="Job Title"
                        defaultValue={userProfile.jobTitle}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </li>
                <li>
                    <TeleportTextField
                        className='onboarding-text-field'
                        label="Expertise"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        SelectProps={{
                            native: true,
                        }}
                        select
                    >
                        {skillsQuery.data && skillsQuery.data.skills ?
                            (
                                skillsQuery.data.skills.map( skill => {
                                    return (
                                        <option key={skill.key} value={skill.id}>
                                            {skill.name}
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
    );
};

export default UserProfile;