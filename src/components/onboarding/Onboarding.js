import React from 'react';
import UserProfile from "./UserProfile";
import AvailabilityProfile from './AvailabilityProfile';
import './onboarding.css'

const Onboarding = function () {
    return (
        <div className='onboarding-container'>
            <UserProfile/>
        </div>
    );
};

export default Onboarding;