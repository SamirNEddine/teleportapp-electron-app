import React from 'react';
import {concatStyleObjects} from '../../utils/css';

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        border: '1px solid white',
        borderRadius: '3px',
    },
};

const CalendarPreview = function ({timeSlot}) {
    
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
                result = '#C2C3D2';
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