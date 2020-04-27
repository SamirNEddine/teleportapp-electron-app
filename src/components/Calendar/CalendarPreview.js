import React from 'react';
import './calendar.css';

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    hoursList: {
        position: 'relative',
        padding: 0,
        margin: 0,
        textAlign: 'right',
        top: '48px',
        left: '14px',
        width: '28px',
        listStyle: 'none',
        userSelect: 'none'
    },
    hoursListLi: {
        fontFamily: 'Silka',
        fontSize: '9px',
        fontWeight: 300,
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: 'var(--blueberry)',
        paddingBottom: '22px'
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


    return (
        <div style={styles.container}>
            <ul style={styles.hoursList}>
                {renderCalendarRows()}
            </ul>
        </div>
    )
};

export default CalendarPreview;