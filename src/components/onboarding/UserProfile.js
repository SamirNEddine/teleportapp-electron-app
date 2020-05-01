import React, {useState, useEffect} from 'react';
import {GET_SKILLS} from '../../graphql/queries';
import {useQuery} from "@apollo/react-hooks";
import {getRandomInt} from '../../utils/number';
import {TeleportTextField} from '../../utils/css';
import './onboarding.css'

const UserProfile = function ({onConfirmButtonClick, userProfile}) {
    const skillsQuery = useQuery(GET_SKILLS);
    const [fullName, setFullName] = useState(`${userProfile.firstName} ${userProfile.lastName}`);
    const [jobTitle, setJobTitle] = useState(userProfile.jobTitle);
    const [skill, setSkill] = useState('');
    const [validatable, setValidatable] = useState(false);

    useEffect( () => {
        if (skillsQuery.data && skillsQuery.data.skills) {
            const randomSkill = skillsQuery.data.skills[getRandomInt(0, skillsQuery.data.skills.length-1)].id;
            setSkill(randomSkill)
        }
    }, [skillsQuery.data]);
    useEffect( () => {
        if(!fullName || fullName.length === 0 || !jobTitle || jobTitle.length === 0) {
            setValidatable(false);
        }else {
            setValidatable(true);
        }
    }, [fullName, jobTitle]);

    const onConfirm = function () {
        if(validatable && onConfirmButtonClick){
            onConfirmButtonClick();
        }
    };

    return (
        <div className='user-profile-container'>
            <div className="main-title">Welcome! 👋</div>
            <div className="secondary-title">Is it correct? Check your info:</div>
            <ul className='user-profile-fields'>
                <li>
                    <TeleportTextField
                        className='onboarding-text-field'
                        label="Full name"
                        value={fullName}
                        onChange={(e) => {setFullName(e.target.value);}}
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
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </li>
                <li>
                    <TeleportTextField
                        className='onboarding-text-field'
                        label="Job Title"
                        value={jobTitle}
                        onChange={(e) => {setJobTitle(e.target.value);}}
                        InputLabelProps={{
                            shrink: true
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
            <img className="user-profile-picture" src={userProfile.profilePictureURL} alt="profile-picture" />
            <div
                className={`confirm-button-position ${validatable? 'confirm-button' : 'confirm-button-disabled'}`}
                onClick={onConfirm}
            >
                Continue
            </div>
        </div>
    );
};

export default UserProfile;