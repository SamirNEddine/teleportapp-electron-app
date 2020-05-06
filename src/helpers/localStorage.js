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
    if(user){
        const key = `${user.id}_isOnBoarded`;
        if (!store.has(key)) {
            if(await getUserIsOnBoarded()){
                updateIsOnBoarded(true);
            }else{
                return false;
            }
        }
        return store.get(key);
    }else{
        return false;
    }
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
    if(user){
        const key = `${user.id}_lastSetupDayTimeStamp`;
        if(!store.has(key)) {
            if(await getUserHasSetupDay()) {
                updateHasSetupDayForToday(true);
            }else {
                return false;
            }
        }
        const lastSetupDate = new Date(parseInt(store.get(key)));
        const now = new Date();
        return (now.getFullYear() === lastSetupDate.getFullYear() &&
            now.getMonth() === lastSetupDate.getMonth() &&
            now.getDate() === lastSetupDate.getDate());
    }else{
        return false;
    }
}