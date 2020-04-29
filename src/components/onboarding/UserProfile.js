import React from 'react';
import './onboarding.css'

const UserProfile = function ({onConfirmButtonClick, userProfile}) {
    return (
        <div className='user-profile-container'>
            <div className="main-title">Welcome! 👋</div>
            <div className="secondary-title">Is it correct? Check your info:</div>
            {userProfile.firstName}
            <div className="confirm-button-position confirm-button" onClick={onConfirmButtonClick ? onConfirmButtonClick : null}>Continue</div>
        </div>
    );
};

export default UserProfile;