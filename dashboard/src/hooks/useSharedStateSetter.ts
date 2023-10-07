import SharedState from '@/libs/sharedState';
import { useCallback, useEffect } from 'react';

interface IUseSharedStateSetterParam<T> {
    0: keyof T;
    1: T[keyof T];
}

export default function useSharedStateSetter<K>(
    stateManager: SharedState<K>,
    ...args: IUseSharedStateSetterParam<K>[]
) {
    const deps = args.map((v) => v[1]);

    const doUpdate = useCallback((unmount?: boolean) => {
        for (const v of args) {
            stateManager.set(v[0], unmount ? (undefined as K[keyof K]) : v[1]);
        }

        if (args.length) stateManager.updateListener();
    }, deps);

    useEffect(() => {
        doUpdate();
        return () => doUpdate(true);
    }, deps);
}
