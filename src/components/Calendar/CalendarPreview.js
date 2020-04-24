import React from 'react';
import fakeCal from './fake-cal.png';
import './calendar.css';

const CalendarPreview = function () {
    return (
        <div className='calendar-preview-container'>
            <img className='fake-cal' src={fakeCal} alt='fake-cal'/>
        </div>
    )
};

export default CalendarPreview;