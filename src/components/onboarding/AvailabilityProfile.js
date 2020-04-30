import React from 'react';
import './onboarding.css'
import {TeleportTextField} from "../../utils/css";

const AvailabilityProfile = function ({onConfirmButtonClick, userProfile}) {
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
                            defaultValue={userProfile.preferences.startWorkTime}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label="You have lunch at"
                            defaultValue={userProfile.emailAddress}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label="You stop working at"
                            defaultValue={userProfile.jobTitle}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </li>
                    <li>
                        <TeleportTextField
                            className='onboarding-text-field'
                            label="You usually have"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            SelectProps={{
                                native: true
                            }}
                            select
                        >
                            <option key='default' value='default'>
                                Very few meetings
                            </option>
                            <option key='1' value='1'>
                                Some meetings
                            </option>
                            <option key='2' value='2'>
                                A lot of meeting
                            </option>
                        </TeleportTextField>
                    </li>
                </ul>
                <div className="confirm-button-position confirm-button" onClick={onConfirmButtonClick ? onConfirmButtonClick : null}>Continue</div>
            </div>

            <div className='availability-profile-right'>
            </div>
        </div>
    );
};

export default AvailabilityProfile;