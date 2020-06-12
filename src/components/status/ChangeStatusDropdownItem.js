import React, {Suspense} from 'react'
import {useTranslation} from 'react-i18next';

import './status.css';

const ChangeStatusDropdownItem = function ({timeSlot, isLast=false}) {
    const { t, ready: translationsReady } = useTranslation('Current Status', { useSuspense: false });

    const indicatorTitle = function (status) {
        let result = '';
        switch (status) {
            case 'available':
            {
                result = t('CHANGE_STATUS_DROPDOWN_ITEM.AVAILABLE.TITLE');
                break;
            }
            case 'focus':
            {
                result = t('CHANGE_STATUS_DROPDOWN_ITEM.FOCUS.TITLE');
                break;
            }
        }
        return result;
    };
    const indicatorColor = function (status) {
        let result = '';
        switch (status) {
          case 'available':
          {
              result = '#e127eb';
              break;
          }
          case 'focus':
          {
              result = '#8800f0';
              break;
          }
        }
        return result;
    };
    const mainMessage = function (status) {
        let result = '';
        switch (status) {
            case 'available':
            {
                result = t('CHANGE_STATUS_DROPDOWN_ITEM.AVAILABLE.MAIN_MESSAGE');
                break;
            }
            case 'focus':
            {
                result = t('CHANGE_STATUS_DROPDOWN_ITEM.FOCUS.MAIN_MESSAGE');
                break;
            }
        }
        return result;
    };
    const secondaryMessage = function (status) {
        let result = '';
        switch (status) {
            case 'available':
            {
                result = t('CHANGE_STATUS_DROPDOWN_ITEM.AVAILABLE.SECONDARY_MESSAGE');
                break;
            }
            case 'focus':
            {
                result = t('CHANGE_STATUS_DROPDOWN_ITEM.FOCUS.SECONDARY_MESSAGE');
                break;
            }
        }
        return result;
    };
    const until = timeSlot.start !== timeSlot.end ?  new Date(timeSlot.end).toLocaleTimeString({}, {timeStyle: 'short'}) : null;
    if(!translationsReady){
        return  <div className='change-status-dropdown-item-container' />;
    }else {
        return (
            <div style={ !isLast ? {borderBottom:'solid 1px #b4b3da'} : {}} className='change-status-dropdown-item-container'>
                <div className='change-status-dropdown-item-left'>
                    <div style={{backgroundColor: indicatorColor(timeSlot.status), top: until ? '20px' : '31px'}} className='change-status-dropdown-item-status-indicator'>{indicatorTitle(timeSlot.status)}</div>
                    {until ? <div className='change-status-dropdown-item-status-until'>Until {until}</div> : ''}
                </div>
                <div className='change-status-dropdown-item-right'>
                    <div className='change-status-dropdown-item-status-main-message'>{mainMessage(timeSlot.status)}</div>
                    <div className='change-status-dropdown-item-status-secondary-message'>{secondaryMessage(timeSlot.status)}</div>
                </div>
            </div>
        )
    }
};

export default ChangeStatusDropdownItem;