import React from 'react';
import TimeSlot from './TimeSlot';
import {concatStyleObjects} from '../../utils/css';

const HOUR_LIST_BOTTOM_PADDING = 40;
const TOP_MARGIN = 50;
const HOURS_TOP_MARGIN = 39;
const BOTTOM_MARGIN = 31;
const HOURS_FONT_SIZE = 9;
const TIME_SLOT_WIDTH = 134;
const TIME_SLOT_LEFT_MARGIN = 62;
const ONE_HOUR_PLACEHOLDER_HEIGHT = 44 + HOURS_FONT_SIZE;
const INTER_TIME_SLOTS = 0;

const styles = {
    container: {
        position: 'relative',
        width: '100%'
    },
    hoursList: {
        position: 'relative',
        padding: 0,
        margin: 0,
        textAlign: 'right',
        top: `${HOURS_TOP_MARGIN}px`,
        left: '12px',
        width: '40px',
        listStyle: 'none',
        userSelect: 'none'
    },
    hoursListLi: {
        fontFamily: 'Nunito',
        fontSize: `${HOURS_FONT_SIZE}px`,
        fontWeight: 300,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'var(--blueberry)',
        paddingBottom: `${HOUR_LIST_BOTTOM_PADDING}px`,
    },
    hoursListLiLast: {
        fontFamily: 'Nunito',
        fontSize: `${HOURS_FONT_SIZE}px`,
        fontWeight: 300,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'var(--blueberry)',
    }
};

const CalendarPreview = function ({startDayTime, endDayTime, schedule}) {
    const renderCalendarRows = function () {
        const startDate = new Date(startDayTime);
        startDate.setMinutes(0, 0, 0);
        const endDate = new Date(endDayTime);
        if(endDate.getMinutes() > 0) endDate.setHours(endDate.getHours()+1, 0, 0, 0);
        const hoursRows = [];
        for(let i = startDate.getTime(); i<=endDate.getTime(); i+=60*60*1000) {
            const time = new Date(i).toLocaleTimeString();
            const split1 = time.split(':');
            const split2 = time.split(' ');
            const hour = split1[0] + (split2[1] ? ` ${split2[1]}` : `:${split1[2]}`);
            hoursRows.push(<li style={i < endDayTime ? styles.hoursListLi : styles.hoursListLiLast} key={hour}>{hour}</li>)
        }
        return hoursRows;
    };
    const renderTimeSlotsRows = function () {
        const timeSlotsRows = [];
        for(let i=0; i<schedule.length; i++){
            const timeSlot = schedule[i];
            const duration = (parseInt(timeSlot.end) - parseInt(timeSlot.start))/(60*60*1000);
            const top = `${TOP_MARGIN + (ONE_HOUR_PLACEHOLDER_HEIGHT)*Number( ((parseInt(timeSlot.start) - startDayTime)/(60*60*1000)).toFixed(2) ) + INTER_TIME_SLOTS}px`;
            const height = `${ONE_HOUR_PLACEHOLDER_HEIGHT*duration - INTER_TIME_SLOTS}px`;
            const width = `${TIME_SLOT_WIDTH}px`;
            const left = `${TIME_SLOT_LEFT_MARGIN}px`;

            const time = new Date(parseInt(timeSlot.start)).toLocaleTimeString();
            const aduration = Number( ((parseInt(timeSlot.end) - parseInt(timeSlot.start))/(60*1000)).toFixed(2) );
            console.log(time, aduration, timeSlot.status, top, height);
            timeSlotsRows.push(<div key={timeSlot.start} style={{position:'absolute', top, left, height, width}}><TimeSlot timeSlot={timeSlot}/></div>)
        }
        return timeSlotsRows;
    };

    const hoursRows = renderCalendarRows();
    const timeSlots = renderTimeSlotsRows();
    const height = `${TOP_MARGIN + (hoursRows.length-1)*(ONE_HOUR_PLACEHOLDER_HEIGHT) + BOTTOM_MARGIN}px`;
    return (
        <div style={concatStyleObjects(styles.container, {height})}>
            <ul style={styles.hoursList}>
                {hoursRows}
            </ul>
            {timeSlots}
        </div>
    )
};

export default CalendarPreview;