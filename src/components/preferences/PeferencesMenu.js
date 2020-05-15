import React, {useState, useEffect} from 'react';
import {isUserLoggedIn} from '../../helpers/localStorage'
import PreferencesMenuItem from './PreferencesMenuItem';
import {iconForMenuItem} from './assets/PreferencesMenuIcons';

const app = window.require('electron').remote.app;

const menuItemsLoggedIn =
{
    'account': {title: 'Account'},
    'context': {title: 'Context'},
    'integrations': {title: 'Integrations'},
    'generalSettings': {title: 'Settings'}
};
const menuItemsLoggedOut =
{
    'generalSettings': {title: 'Settings'}
};
const PreferencesMenu = function () {
    const [menuItems, setMenuItems] = useState([]);
    const [highlightedItemId, setHighlightedItemId] = useState(isUserLoggedIn() ? 'account' : 'generalSettings')

    const reloadMenuItems = () => {
        const items = [];
        const itemList = isUserLoggedIn() ? menuItemsLoggedIn : menuItemsLoggedOut;
        for(let itemId in itemList){
            if(itemList.hasOwnProperty(itemId)){
                const item = itemList[itemId];
                items.push({id: itemId, icon: iconForMenuItem(itemId, itemId === highlightedItemId), title: item.title, highlighted: itemId === highlightedItemId})
            }
        }
        setMenuItems(items);
    };
    const onMenuItemClick =  (itemId) => {
        setHighlightedItemId(itemId);
    };
    const renderItems = function () {
        return menuItems.map( item => {
            return <li key={item.id}><PreferencesMenuItem icon={item.icon} title={item.title} id={item.id} highlighted={item.highlighted} onClickHandler={onMenuItemClick} /></li>
        });
    };

    useEffect( () => {
        reloadMenuItems();
    }, [highlightedItemId]);

    return (
        <div className='preferences-menu-container'>
            <ul className='preferences-menu-item-list'>
                {renderItems()}
            </ul>
            <div className='preferences-menu-app-version'>Version {app.getVersion()}</div>
        </div>
    )
};

export default PreferencesMenu;