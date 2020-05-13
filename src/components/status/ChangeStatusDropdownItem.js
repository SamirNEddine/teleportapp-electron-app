import React, {useEffect, useState} from 'react'

import './status.css';

const ChangeStatusDropdownItem = function ({timeSlot, isLast=false}) {

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
                result = 'Free to help 🙌🏻';
                break;
            }
            case 'focus':
            {
                result = 'I\'m in my zone  🧠';
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
                result = 'Your team will be encouraged to stay in touch synchronously.';
                break;
            }
            case 'focus':
            {
                result = 'Teleport will let your peers know that you might not answer right away.';
                break;
            }
        }
        return result;
    };
    const endDate = new Date(timeSlot.end);
    const until = endDate.toLocaleTimeString({}, {timeStyle: 'short'});
    return (
        <div style={ !isLast ? {borderBottom:'solid 1px #b4b3da'} : {}} className='change-status-dropdown-item-container'>
            <div className='change-status-dropdown-item-left'>
                <div style={{backgroundColor: indicatorColor(timeSlot.status)}} className='change-status-dropdown-item-status-indicator'>{timeSlot.status}</div>
                <div className='change-status-dropdown-item-status-until'>Until {until}</div>
            </div>
            <div className='change-status-dropdown-item-right'>
                <div className='change-status-dropdown-item-status-main-message'>{mainMessage(timeSlot.status)}</div>
                <div className='change-status-dropdown-item-status-secondary-message'>{secondaryMessage(timeSlot.status)}</div>
            </div>
        </div>
    )
};

export default ChangeStatusDropdownItem;