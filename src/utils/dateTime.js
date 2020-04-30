import React from "react";

const TIME_OPTIONS_UNIT_IN_MINUTES = 30;

export const is24hTimeFormat = function () {
    const date = new Date();
    const dateString = date.toLocaleTimeString();
    return !dateString.match(/am|pm/i);
};

export const timeOptions = function () {
    const result = [];
    const is24Format = is24hTimeFormat();
    for(let i=0; i<24; i++){
        for(let j=0; j<60; j+=TIME_OPTIONS_UNIT_IN_MINUTES){
            const hourValue = i < 10 ? `0${i}` : i;
            const localHour = is24Format ? i : (i< 13 ? i : i-12);
            const hour = localHour < 10 ? `0${localHour}` : localHour;
            const minutes = j < 10 ? `0${j}` : j ;
            const ampm = is24Format ? '' : (i< 12 ? ' AM' : ' PM');
            const value = `${hourValue}${minutes}`;
            const display = `${hour}:${minutes}${ampm}`;
            result.push
            (
                <option key={value} value={value}>
                    {display}
                </option>
            );
        }
    }
    return result;
};

export const getTimestampFromLocalTodayTime = function(timeStringRepresentation) {
    const hour = parseInt(timeStringRepresentation.slice(0,2));
    const minute = parseInt(timeStringRepresentation.slice(2));
    const now = new Date();
    now.setHours(hour, minute, 0, 0);
    return now.getTime();
};
