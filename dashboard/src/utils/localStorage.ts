import { IUser } from '@/interfaces/user';

export function setLocalStorage<T>(key: string, data: T) {
    if (typeof data !== 'object') return;

    localStorage.setItem(key, JSON.stringify(data));

    return data;
}

export function getLocalStorage<T>(key: string) {
    const str = localStorage.getItem(key);

    if (!str?.length) return;

    return JSON.parse(str);
}

export function saveUser(data: IUser) {
    return setLocalStorage('user', data);
}

export function getSavedUser() {
    return getLocalStorage('user');
}
