import React from "react";

const DEFAULT_TIME_OPTIONS_UNIT_IN_MINUTES = 30;

export const is24hTimeFormat = function () {
    const date = new Date();
    const dateString = date.toLocaleTimeString();
    return !dateString.match(/am|pm/i);
};

export const timeOptions = function (timeUnitInMinutes=DEFAULT_TIME_OPTIONS_UNIT_IN_MINUTES) {
    const result = [];
    const is24Format = is24hTimeFormat();
    for(let i=4; i<24; i++){
        for(let j=0; j<60; j+=timeUnitInMinutes){
            const hourValue = i < 10 ? `0${i}` : i;
            const localHour = is24Format ? i : (i< 13 ? i : i-12);
            const hour = localHour < 10 ? `0${localHour}` : localHour;
            const minutes = j < 10 ? `0${j}` : j ;
            const ampm = is24Format ? '' : (i< 12 ? ' AM' : ' PM');
            const value = `${hourValue}${minutes}`;
            const display = `${hour}:${minutes}${ampm}`;
            result.push
            (
                {
                    time: value,
                    optionDiv:
                        <option key={value} value={value}>
                            {display}
                        </option>
                }
            );
        }
    }
    return result;
};
export const lunchDurationOptions = function () {
    const result = [];

    for(let i =30; i <= 120; i+=30){
        const hours = Math.floor(i/60);
        const hoursDisplay = hours > 0 ? `${hours}h` : '';
        const minutes = i - 60*hours;
        const minutesDisplay = minutes > 0 ? (hours > 0 ? minutes : `${minutes} minutes` ) : '';
        const display = `${hoursDisplay}${minutesDisplay}`;
        result.push
        (
            {
                time: i,
                optionDiv:
                    <option key={i} value={i}>
                        {display}
                    </option>
            }
        );
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
export const getTimeElementsFromDuration = function (duration) {
    const hours = Math.floor(duration/(1000*60*60));
    const minutes = Math.floor((duration/(1000*60*60) - hours)*60);
    const seconds =  Math.floor(((duration/(1000*60*60)- hours)*60 - minutes)*60);
    return {hours, minutes, seconds};
};
