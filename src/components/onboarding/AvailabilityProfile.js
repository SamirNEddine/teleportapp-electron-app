import React from 'react';
import './onboarding.css'

const AvailabilityProfile = function ({onConfirmButtonClick}) {
    return (
        <div className='availability-profile-container'>
            <div className="main-title">Let's get started! 👋</div>
            <div className="secondary-title">Tell us about your typical day 🗓</div>
            <div className="confirm-button-position confirm-button" onClick={onConfirmButtonClick ? onConfirmButtonClick : null}>Continue</div>
        </div>
    );
};

export default AvailabilityProfile;