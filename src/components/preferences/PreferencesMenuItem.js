import React from 'react';
import {regularColor, highlightedColor} from './assets/PreferencesMenuIcons';

const PreferencesMenuItem = function ({icon, title, id, highlighted, onClickHandler}) {

    return (
        <div className='preferences-menu-item-container' onClick={ () => {onClickHandler(id)}}>
            <div className='preferences-menu-item-icon'>{icon}</div>
            <div style={ highlighted ? {color: highlightedColor} : {color: regularColor}} className='preferences-menu-item-title'>{title}</div>
        </div>
    )
};

export default PreferencesMenuItem;