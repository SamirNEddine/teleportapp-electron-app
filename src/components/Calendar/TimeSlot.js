import React from 'react';
import {concatStyleObjects} from '../../utils/css';

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '2px'
    },
};

const CalendarPreview = function ({timeSlot, positionStyles}) {
    
    const backgroundColorForStatus = function (status) {
        let result = '';
        switch (status) {
            case 'available':
            {
                result = 'var(--pink-purple)';
                break;
            }
            case 'focus':
            {
                result = 'var(--vivid-purple)';
                break;
            }
            case 'busy':
            {
                result = 'var(--neutral-7)';
                break;
            }
            case 'lunch':
            {
                result = 'var(--neutral-3)';
                break;
            }
        }
        return result;
    };
    return (
        <div style={concatStyleObjects(styles.container, {backgroundColor: backgroundColorForStatus(timeSlot.status)})}>
        </div>
    )
};

export default CalendarPreview;