import jwtDecode from 'jwt-decode';
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
export function isUserOnBoarded(){
    const user = getLocalUser();
    if(user){
        const key = `${user.id}_isOnBoarded`;
        if (store.has(key)) {
            return store.get(key);
        }else{
            return 'unknown';
        }
    }else{
        return false;
    }
}
export function updateIsOnBoarded(isOnBoarded) {
    const user = getLocalUser();
    store.set(`${user.id}_isOnBoarded`, isOnBoarded);
}