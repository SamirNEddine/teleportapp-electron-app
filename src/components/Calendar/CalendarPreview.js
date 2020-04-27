import React from 'react';
import {concatStyleObjects} from '../../utils/css';

const HOUR_SLOT_HEIGHT = 22;
const TOP_MARGIN = 48;
const BOTTOM_MARGIN = 31;
const HOURS_FONT_SIZE = 9;

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        backgroundColor: "red"
    },
    hoursList: {
        position: 'relative',
        padding: 0,
        margin: 0,
        textAlign: 'right',
        top: `${TOP_MARGIN}px`,
        left: '14px',
        width: '28px',
        listStyle: 'none',
        userSelect: 'none'
    },
    hoursListLi: {
        fontFamily: 'Silka',
        fontSize: `${HOURS_FONT_SIZE}px`,
        fontWeight: 300,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'var(--blueberry)',
        paddingBottom: `${HOUR_SLOT_HEIGHT}px`
    }
};

const CalendarPreview = function ({startTime, endTime}) {

    const renderCalendarRows = function () {
        const hoursRows = [];
        for(let i = startTime; i<=endTime; i+=60*60*1000) {
            const time = new Date(i).toLocaleTimeString();
            const split1 = time.split(':');
            const split2 = time.split(' ');
            console.log(split2);
            const hour = split1[0] + (split2[1] ? ` ${split2[1]}` : `:${split1[2]}`);
            hoursRows.push(<li style={styles.hoursListLi} key={hour}>{hour}</li>)
        }
        return hoursRows;
    };

    const hoursRows = renderCalendarRows();
    const height = `${TOP_MARGIN + hoursRows.length*(HOUR_SLOT_HEIGHT + HOURS_FONT_SIZE) + BOTTOM_MARGIN}px`;
    return (
        <div style={concatStyleObjects(styles.container, {height})}>
            <ul style={styles.hoursList}>
                {hoursRows}
            </ul>
        </div>
    )
};

export default CalendarPreview;