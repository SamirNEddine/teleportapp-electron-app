import React from 'react';
import './calendar.css';

const CalendarPreview = function ({startTime, endTime}) {

    const renderCalendarRows = function () {
        const hoursRows = [];
        for(let i = startTime; i<=endTime; i+=60*60*1000) {
            const time = new Date(i).toLocaleTimeString();
            const split1 = time.split(':');
            const split2 = time.split(' ');
            console.log(split2);
            const hour = split1[0] + (split2[1] ? ` ${split2[1]}` : `:${split1[2]}`);
            hoursRows.push(<li key={hour}>{hour}</li>)
        }
        return hoursRows;
    };


    return (
        <div className='calendar-preview-container'>
            <ul className='hours-list'>
                {renderCalendarRows()}
            </ul>
        </div>
    )
};

export default CalendarPreview;