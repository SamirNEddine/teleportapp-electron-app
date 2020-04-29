import React from 'react';
import {TeleportTextField} from '../../utils/css';
import MenuItem from '@material-ui/core/MenuItem';
import './onboarding.css'

const UserProfile = function ({onConfirmButtonClick, userProfile}) {
    console.log(userProfile);
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
                            native: true
                        }}
                        select
                    >
                        <option key='default' value='default'>
                            Select a skill
                        </option>
                        <option key='1' value='1'>
                            1
                        </option>
                        <option key='2' value='2'>
                           2
                        </option>
                    </TeleportTextField>
                </li>
            </ul>

            <div className="confirm-button-position confirm-button" onClick={onConfirmButtonClick ? onConfirmButtonClick : null}>Continue</div>
        </div>
    );
};

export default UserProfile;