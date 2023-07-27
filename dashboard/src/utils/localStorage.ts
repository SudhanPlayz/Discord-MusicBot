import { IUserAuth } from '@/interfaces/user';

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

export function saveAuth(data: IUserAuth) {
    return setLocalStorage('userAuth', data);
}

export function clearAuth() {
    return localStorage.removeItem('userAuth');
}

export function getSavedAuth() {
    return getLocalStorage('userAuth') as IUserAuth | undefined;
}
