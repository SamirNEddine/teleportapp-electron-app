import React, {useEffect, useState} from 'react';
import PreferencesMenu from './PeferencesMenu';
import {isUserLoggedIn} from '../../helpers/localStorage'
import Account from "./Account";
import Context from "./Context";
import Integrations from "./Integrations";
import GeneralSettings from "./GeneralSettings";

import './preferences.css';

const menuItemsLoggedIn =
    {
        'account': {title: 'Account', component: Account},
        'context': {title: 'Context', component: Context},
        'integrations': {title: 'Integrations', component: Integrations},
        'generalSettings': {title: 'Settings', component: GeneralSettings}
    };
const menuItemsLoggedOut =
    {
        'generalSettings': {title: 'Settings', component: GeneralSettings}
    };

const Preferences = function () {
    const [selectedMenuItemId, setSelectedMenuItemId] = useState(isUserLoggedIn() ? 'account' : 'generalSettings');
    const [displayedComponent, setCurrentDisplayedComponent] = useState(null);

    useEffect( () => {
        const list = isUserLoggedIn() ? menuItemsLoggedIn : menuItemsLoggedOut;
        const Component = list[selectedMenuItemId].component;
        setCurrentDisplayedComponent(<Component />);
    }, [selectedMenuItemId]);

    const onMenuItemSelection = (itemId) => {
        setSelectedMenuItemId(itemId);
    };
    return (
        <div className='preferences-container'>
            <div className='preferences-left'> <PreferencesMenu itemList={isUserLoggedIn() ? menuItemsLoggedIn : menuItemsLoggedOut} onSelection={onMenuItemSelection}/> </div>
            <div className='preferences-right'>
                {displayedComponent}
            </div>
        </div>
    )
};

export default Preferences;