import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import PreferencesMenu from './PeferencesMenu';
import {isUserLoggedIn} from '../../helpers/localStorage'
import Account from "./Account";
import Context from "./Context";
import Integrations from "./Integrations";
import GeneralSettings from "./GeneralSettings";

import './preferences.css';

const Preferences = function () {
    const { t, ready: translationsReady } = useTranslation('Preferences', { useSuspense: false });
    const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
    const [displayedComponent, setCurrentDisplayedComponent] = useState(null);
    const [menuItemsLoggedIn, setMenuItemsLoggedIn] = useState([]);
    const [menuItemsLoggedOut, setMenuItemsLoggedOut] = useState([]);

    useEffect( () => {
        if(selectedMenuItemId){
            const list = isUserLoggedIn() ? menuItemsLoggedIn : menuItemsLoggedOut;
            const Component = list[selectedMenuItemId].component;
            setCurrentDisplayedComponent(<Component />);
        }
    }, [selectedMenuItemId]);
    useEffect( () => {
        if(translationsReady){
            console.log('HEREEEE');
            setMenuItemsLoggedIn(
                {
                    'account': {title: t('PREFERENCES_MENU-ACCOUNT'), component: Account},
                    'context': {title: t('PREFERENCES_MENU-CONTEXT'), component: Context},
                    'integrations': {title: t('PREFERENCES_MENU-INTEGRATIONS'), component: Integrations},
                    'generalSettings': {title: t('PREFERENCES_MENU-SETTINGS'), component: GeneralSettings}
                }
            );
            setMenuItemsLoggedOut(
                {
                    'generalSettings': {title: t('PREFERENCES_MENU-SETTINGS'), component: GeneralSettings}
                }
            );
            setSelectedMenuItemId(isUserLoggedIn() ? 'account' : 'generalSettings');
        }
    }, [translationsReady]);

    const onMenuItemSelection = (itemId) => {
        setSelectedMenuItemId(itemId);
    };
    if(!translationsReady || menuItemsLoggedIn.length === 0) {
        return <div className='preferences-container' />;
    }else {
        return (
            <div className='preferences-container'>
                <div className='preferences-left'> <PreferencesMenu itemList={isUserLoggedIn() ? menuItemsLoggedIn : menuItemsLoggedOut} onSelection={onMenuItemSelection}/> </div>
                <div className='preferences-right'>
                    {displayedComponent}
                </div>
            </div>
        )
    }
};

export default Preferences;