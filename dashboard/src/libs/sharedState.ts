import { ISharedState, IUpdateListener } from '@/interfaces/sharedState';

const states: ISharedState = {};
const updateHandlers: IUpdateListener[] = [];

export function getSharedState() {
    return states;
}

export function updateListener() {
    for (const handler of updateHandlers) {
        handler(states);
    }
}

export function setSharedState<T extends keyof ISharedState>(
    key: T,
    value: ISharedState[T],
) {
    states[key] = value;
}

export function registerListener(handler: IUpdateListener) {
    if (updateHandlers.includes(handler)) return -1;

    updateHandlers.push(handler);
}

export function removeListener(handler: IUpdateListener) {
    const idx = updateHandlers.findIndex((h) => h === handler);

    if (idx !== -1) {
        updateHandlers.splice(idx, 1);
    }

    return idx;
}

export function copySharedState(state: ISharedState) {
    return { ...state };
}
