import React, {useState, useEffect, useCallback} from 'react';
import UserProfile from "./UserProfile";
import AvailabilityProfile from './AvailabilityProfile';
import CalendarIntegration from "./CalendarIntegration";
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import './onboarding.css'
import '../../assets/animate.css';

const TRANSITION_SPEED = 800;
const Onboarding = function () {
    const [currentScreen, setCurrentScreen] = useState(null);

    const onConfirmButtonClick =  useCallback(
        (screen) => {
            switch (screen) {
                case 'UserProfile':
                {
                    setCurrentScreen(
                        <CSSTransition key='AvailabilityProfile' timeout={TRANSITION_SPEED} classNames="slide">
                            <AvailabilityProfile onConfirmButtonClick={ () => {onConfirmButtonClick('AvailabilityProfile')}}/>
                        </CSSTransition>
                    );
                    break;
                }
                case 'AvailabilityProfile':
                {
                    setCurrentScreen(
                        <CSSTransition key='CalendarIntegration' timeout={TRANSITION_SPEED} classNames="slide">
                            <CalendarIntegration onConfirmButtonClick={ () => {onConfirmButtonClick('CalendarIntegration')}}/>
                        </CSSTransition>
                    );
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
        setCurrentScreen(
            <CSSTransition key='UserProfile' timeout={TRANSITION_SPEED}  classNames={{exit: 'slide-exit', exitActive: 'slide-exit-active'}}>
                <UserProfile onConfirmButtonClick={ () => {onConfirmButtonClick('UserProfile')}}/>
            </CSSTransition>
        );
    }, []);

    return (
        <TransitionGroup className='onboarding-container'>
            {currentScreen}
        </TransitionGroup>
    );
};

export default Onboarding;