import { IUser, IUserAuth } from '@/interfaces/user';

export function setLocalStorage<T>(key: string, data: T) {
    if (typeof data !== 'object') return;

    localStorage.setItem(key, JSON.stringify(data));

    return data;
}

export function getLocalStorage<T>(key: string) {
    const str = localStorage.getItem(key);

    if (!str?.length) return;

    return JSON.parse(str) as T;
}

export function removeLocalStorage(key: string) {
    return localStorage.removeItem(key);
}

export function saveAuth(data: IUserAuth) {
    return setLocalStorage('userAuth', data);
}

export function clearAuth() {
    return removeLocalStorage('userAuth');
}

export function getSavedAuth() {
    return getLocalStorage('userAuth') as IUserAuth | undefined;
}

export function saveUser(data: IUser) {
    return setLocalStorage('user', data);
}

export function clearUser() {
    return removeLocalStorage('user');
}

export function getSavedUser() {
    return getLocalStorage('user') as IUser | undefined;
}
