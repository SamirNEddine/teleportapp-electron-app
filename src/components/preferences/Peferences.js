import React from 'react';
import PreferencesMenu from './PeferencesMenu';

import './preferences.css';

const Preferences = function () {

    return (
        <div className='preferences-container'>
            <div className='preferences-left'> <PreferencesMenu/> </div>
            <div className='preferences-right'/>
        </div>
    )
};

export default Preferences;