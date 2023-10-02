import { ISharedState } from '@/interfaces/sharedState';

const states: ISharedState = {};

export function getSharedState() {
    return states;
}

export function setSharedState<T extends keyof ISharedState>(
    key: T,
    value: ISharedState[T],
) {
    states[key] = value;
}
