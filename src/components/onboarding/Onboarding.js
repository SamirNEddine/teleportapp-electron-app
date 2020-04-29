import React, {useState, useEffect, useCallback} from 'react';
import UserProfile from "./UserProfile";
import AvailabilityProfile from './AvailabilityProfile';
import CalendarIntegration from "./CalendarIntegration";
import Reveal from 'react-reveal/Reveal'
import './onboarding.css'
import '../../assets/animate.css';

const Onboarding = function () {
    const [currentScreen, setCurrentScreen] = useState(null);

    const onConfirmButtonClick =  useCallback(
        (screen) => {
            switch (screen) {
                case 'UserProfile':
                {
                    setCurrentScreen(<AvailabilityProfile onConfirmButtonClick={ () => {onConfirmButtonClick('AvailabilityProfile')}}/>);
                    break;
                }
                case 'AvailabilityProfile':
                {
                    setCurrentScreen(<CalendarIntegration onConfirmButtonClick={ () => {onConfirmButtonClick('CalendarIntegration')}}/>);
                    break;
                }
                case 'CalendarIntegration':
                {
                    console.log('DONE!!!!!');
                    break;
                }
            }
        },
        [currentScreen, setCurrentScreen]
    );

    useEffect( () => {
        setCurrentScreen(<UserProfile onConfirmButtonClick={ () => {onConfirmButtonClick('UserProfile')}}/>);
    }, []);

    return (
        <div className='onboarding-container'>
            {currentScreen}
        </div>
    );
};

export default Onboarding;