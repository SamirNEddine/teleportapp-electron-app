import jwtDecode from 'jwt-decode';
import {getUserIsOnBoarded, getUserHasSetupDay} from './api';
const isRenderer = (process && process.type === 'renderer');
const Store = isRenderer ? window.require('electron-store') : require('electron-store');
const store = new Store();

export async function updateLocalUser(accessToken, refreshToken){
    const payload =  await jwtDecode(accessToken);
    store.set('user', JSON.stringify(payload.user));
    store.set('accessToken', accessToken);
    store.set('refreshToken', refreshToken);
    return getLocalUser();
}
export function clearLocalStorage(){
    store.delete('accessToken');
    store.delete('refreshToken');
    store.delete('user');
}
export function getLocalUser(){
    if (!store.get('accessToken') || !store.get('refreshToken') || !store.get('user')) {
        clearLocalStorage();
        return null;
    }else {
        return JSON.parse(store.get('user'));
    }
}
export function isUserLoggedIn(){
    return (getLocalUser() !== null);
}
export function getAccessToken(){
    return store.get('accessToken');
}
export function getRefreshToken(){
    return store.get('refreshToken');
}
export function updateIsOnBoarded(isOnBoarded) {
    const user = getLocalUser();
    store.set(`${user.id}_isOnBoarded`, isOnBoarded);
}
export async function isUserOnBoarded(){
    const user = getLocalUser();
    let result = false;
    if(user){
        const key = `${user.id}_isOnBoarded`;
        if (store.has(key)) {
            result = store.get(key);
        }
    }
    return result;
}
export function getLastSetupDate() {
    const user = getLocalUser();
    let result = null;
    if(user){
        const key = `${user.id}_lastSetupDayTimeStamp`;
        if(store.has(key)) {
            result = new Date(parseInt(store.get(key)));
        }
    }
    return result;
}
export function updateHasSetupDayForToday(hasSetupDay) {
    const user = getLocalUser();
    const key = `${user.id}_lastSetupDayTimeStamp`;
    if(hasSetupDay){
        const now = new Date().getTime();
        store.set(key, now);
    }else if(store.has(key)){
        store.delete(key);
    }
}
export async function hasSetupDayForToday() {
    const user = getLocalUser();
    let result = false;
    if(user){
        let getFromServer = false;
        const lastSetupDate = getLastSetupDate();
        if(!lastSetupDate) {
            getFromServer = true
        }else{
            const now = new Date();
            if (now.getFullYear() === lastSetupDate.getFullYear() &&
                now.getMonth() === lastSetupDate.getMonth() &&
                now.getDate() === lastSetupDate.getDate()) {
                result = true;
            }else{
                getFromServer = true
            }
        }
        if(getFromServer && await getUserHasSetupDay()){
            updateHasSetupDayForToday(true);
            result = true;
        }
    }
    return result;
}
export function getLastDailySetupDate() {
    const user = getLocalUser();
    let result = null;
    if(user){
        const key = `${user.id}_lastDailySetupTimeStamp`;
        if(store.has(key)) {
            result = new Date(parseInt(store.get(key)));
        }
    }
    return result;
}
export function updateHasDisplayedDailySetupForToday(value){
    const user = getLocalUser();
    const key = `${user.id}_lastDailySetupTimeStamp`;
    if(value){
        const now = new Date().getTime();
        store.set(key, now);
    }else if(store.has(key)){
        store.delete(key);
    }
}
export function hasDisplayedDailySetupForToday(){
    const user = getLocalUser();
    let result = false;
    if(user){
        const lastDailySetupDisplayDate = getLastDailySetupDate();
        if(lastDailySetupDisplayDate){
            const now = new Date();
            if (now.getFullYear() === lastDailySetupDisplayDate.getFullYear() &&
                now.getMonth() === lastDailySetupDisplayDate.getMonth() &&
                now.getDate() === lastDailySetupDisplayDate.getDate()) {
                result = true;
            }
        }else{
            result = false;
        }
    }
    return result;
}
export function updateShouldLaunchAtLogin(value) {
    store.set('launchAtLogin', value);
}
export function shouldLaunchAtLogin() {
    if(!store.has('launchAtLogin')){
        updateShouldLaunchAtLogin(true);
        return true;
    }else{
        return store.get('launchAtLogin');
    }
}
export async function updateLocalStorageFromServerIfNeeded() {
    const user = getLocalUser();
    let result = false;
    if(user){
        //OnBoarded value
        let key = `${user.id}_isOnBoarded`;
        if (!store.has(key)) {
            result = await getUserIsOnBoarded();
            if(result){
                updateIsOnBoarded(true);
            }
        }
    }
}