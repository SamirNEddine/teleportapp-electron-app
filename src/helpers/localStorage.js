import jwtDecode from 'jwt-decode';


const Store = window.require('electron-store');
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