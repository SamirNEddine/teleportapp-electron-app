import {getRandomInt} from './number';

const _meetingDurationsForNumberOfHours = function (numberOfHours) {
      if(numberOfHours > 2) {
          return [30, 60, 60, 90, 90, 120];
      }else if(numberOfHours === 1) {
          return [30, 60, 60];
      }else {
          return [30];
      }
};

const _randomMeetingDuration = function(numberOfHours) {
    const options = _meetingDurationsForNumberOfHours(numberOfHours);
    return options[getRandomInt(0, options.length-1)];
};

export const sampleScheduleForAvailabilityProfile = function (startTime, lunchTime, endTime, lunchDurationInMinutes, availabilityProfile) {
    const schedule = [];
    const totalHours = Math.floor((endTime - startTime)/(60*60*1000)) - Math.ceil(lunchDurationInMinutes/60);
    const numberOfMeetings = Math.round(totalHours * availabilityProfile.busyRatio);
    const numberOfHoursBeforeLunch = Math.floor( (lunchTime - startTime)/(60*60*1000));
    let currentTotalHours = _randomMeetingDuration(numberOfHoursBeforeLunch)/60;//random gap
    let currentTime = startTime + currentTotalHours*60*60*1000;
    for(let i=0; i< numberOfMeetings && currentTotalHours < totalHours && currentTime < endTime; i++) {
        if(currentTime >= lunchTime && currentTime < lunchTime+lunchDurationInMinutes*60*1000) {
            currentTime = lunchTime+lunchDurationInMinutes*60*1000;
        }
        let maxNumberOfHours = 0;
        if(currentTime < lunchTime){
            maxNumberOfHours = Math.floor( (lunchTime - currentTime)/(60*60*1000));
        }else {
            maxNumberOfHours = Math.floor((endTime - currentTime)/(60*60*1000))
        }
        const randomDuration = _randomMeetingDuration(maxNumberOfHours)*60*1000;
        schedule.push({start: currentTime, end: currentTime+randomDuration, status: 'busy'})
        currentTime = currentTime+randomDuration;

        //Random gap
        if(currentTime >= lunchTime && currentTime < lunchTime+lunchDurationInMinutes*60*1000) {
            currentTime = lunchTime+lunchDurationInMinutes*60*1000;
        }
        maxNumberOfHours = 0;
        if(currentTime < lunchTime){
            maxNumberOfHours = Math.floor( (lunchTime - currentTime)/(60*60*1000));
        }else {
            maxNumberOfHours = Math.floor((endTime - currentTime)/(60*60*1000))
        }
        const randomGap = _randomMeetingDuration(maxNumberOfHours)*60*1000;
        currentTime = currentTime+randomGap;
    }
    return schedule;
};