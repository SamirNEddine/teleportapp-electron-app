import React, {useState, useEffect, useCallback} from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_USER_PROFILE} from '../../graphql/queries';
import UserProfile from "./UserProfile";
import AvailabilityProfile from './AvailabilityProfile';
import CalendarIntegration from "./CalendarIntegration";
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import './onboarding.css'
import '../../assets/animate.css';

const TRANSITION_SPEED = 800;
const Onboarding = function () {
    const [currentScreen, setCurrentScreen] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const getUserProfileQuery = useQuery(GET_USER_PROFILE);

    const onConfirmButtonClick =  useCallback(
        (screen) => {
            switch (screen) {
                case 'UserProfile':
                {
                    setCurrentScreen(
                        <CSSTransition key='AvailabilityProfile' timeout={TRANSITION_SPEED} classNames="slide">
                            <AvailabilityProfile userProfile={userProfile} onConfirmButtonClick={ () => {onConfirmButtonClick('AvailabilityProfile')}}/>
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
        [currentScreen, userProfile]
    );

    useEffect( () => {
        if(getUserProfileQuery.data && getUserProfileQuery.data.user && !userProfile){
            setUserProfile(getUserProfileQuery.data.user);
        }
    }, [userProfile, getUserProfileQuery.data]);
    useEffect( () => {
        if(userProfile && !currentScreen){
            setCurrentScreen(
                <CSSTransition key='UserProfile' timeout={TRANSITION_SPEED}  classNames={{exit: 'slide-exit', exitActive: 'slide-exit-active'}}>
                    <UserProfile userProfile={userProfile} onConfirmButtonClick={ () => {onConfirmButtonClick('UserProfile')}}/>
                </CSSTransition>
            );
        }
    }, [userProfile, currentScreen]);

    return (
        <TransitionGroup className='onboarding-container'>
            {currentScreen}
        </TransitionGroup>
    );
};

export default Onboarding;