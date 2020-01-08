import jwtDecode from 'jwt-decode';


const Store = window.require('electron-store');
const store = new Store();

export async function updateLocalUser(userToken){
    const payload =  await jwtDecode(userToken);
    store.set('user', JSON.stringify(payload.user));
    store.set('accessToken', userToken);
    return getLocalUser();
}

export function clearLocalStorage(){
    store.delete('accessToken');
    store.delete('user');
}

export function getLocalUser(){
    if (!store.get('accessToken') || !store.get('user')) {
        clearLocalStorage();
        return null;
    }else {
        return JSON.parse(store.get('user'));
    }
}

export function getAuthenticationToken(){
    return store.get('accessToken');
}