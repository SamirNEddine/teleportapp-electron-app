import React from 'react';
import TimeSlot from './TimeSlot';
import {concatStyleObjects} from '../../utils/css';

const QUARTER_HOUR_HEIGHT = 14;
const HOURS_TOP_MARGIN = 44;
const HOUR_LIST_BOTTOM_PADDING = QUARTER_HOUR_HEIGHT*4 - 13;
const LAST_HOUR_BOTTOM_PADDING = 13;
const SLOTS_LIST_TOP_MARGIN = HOUR_LIST_BOTTOM_PADDING + 3 + 6.5;
const SLOTS_LIST_LEFT_MARGIN = 62;
const BOTTOM_MARGIN = 31;
const HOURS_FONT_SIZE = 9;
const HOURS_TEXT_PADDING = 4;
const TIME_SLOT_WIDTH = 134;
const ONE_HOUR_PLACEHOLDER_HEIGHT = HOUR_LIST_BOTTOM_PADDING + HOURS_FONT_SIZE + HOURS_TEXT_PADDING;
const INTER_TIME_SLOTS = 0;

const styles = {
    container: {
        position: 'absolute',
        width: '100%'
    },
    hoursList: {
        position: 'absolute',
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
        paddingBottom: `${HOUR_LIST_BOTTOM_PADDING}px`
    },
    hoursListLiLast: {
        fontFamily: 'Nunito',
        fontSize: `${HOURS_FONT_SIZE}px`,
        fontWeight: 300,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'var(--blueberry)'
    },
    slotsList: {
        position: 'absolute',
        width: `${TIME_SLOT_WIDTH}px`,
        top: `${SLOTS_LIST_TOP_MARGIN}px`,
        left: `${SLOTS_LIST_LEFT_MARGIN}px`
    }
};

const CalendarPreview = function ({startDayTime, endDayTime, schedule}) {
    const renderCalendarRows = function () {
        const startDate = new Date(startDayTime);
        startDate.setMinutes(0, 0, 0);
        startDayTime = startDate.getTime();
        const endDate = new Date(endDayTime);
        if(endDate.getMinutes() > 0) endDate.setHours(endDate.getHours()+1, 0, 0, 0);
        endDayTime = endDate.getTime();
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
            const topMargin = ONE_HOUR_PLACEHOLDER_HEIGHT*(parseInt(timeSlot.start) - startDayTime)/(60*60*1000);
            const top = `${topMargin}px`;
            const height = `${ONE_HOUR_PLACEHOLDER_HEIGHT*duration - INTER_TIME_SLOTS}px`;
            const width = `${TIME_SLOT_WIDTH}px`;
            timeSlotsRows.push(<div key={timeSlot.start} style={{position:'absolute', top, height, width}}><TimeSlot timeSlot={timeSlot}/></div>)
        }
        return timeSlotsRows;
    };

    const hoursRows = renderCalendarRows();
    const timeSlots = renderTimeSlotsRows();
    const slotsHeight = (hoursRows.length-1)*(ONE_HOUR_PLACEHOLDER_HEIGHT);
    const containerHeight = SLOTS_LIST_TOP_MARGIN + slotsHeight + LAST_HOUR_BOTTOM_PADDING + BOTTOM_MARGIN;
    return (
        <div style={concatStyleObjects(styles.container, {height: `${containerHeight}px`})}>
            <ul style={styles.hoursList}>
                {hoursRows}
            </ul>
            <div style={concatStyleObjects(styles.slotsList, {height: `${slotsHeight}px`})}>
                {timeSlots}
            </div>

        </div>
    )
};

export default CalendarPreview;