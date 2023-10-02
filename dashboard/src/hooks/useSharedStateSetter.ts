import { ISharedState } from '@/interfaces/sharedState';
import { setSharedState, updateListener } from '@/libs/sharedState';
import { useCallback, useEffect } from 'react';

interface IUseSharedStateSetterParam {
    0: keyof ISharedState;
    1: ISharedState[keyof ISharedState];
}

export default function useSharedStateSetter(
    ...args: IUseSharedStateSetterParam[]
) {
    const deps = args.map((v) => v[1]);

    const doUpdate = useCallback((unmount?: boolean) => {
        for (const v of args) {
            setSharedState(v[0], unmount ? undefined : v[1]);
        }

        if (args.length) updateListener();
    }, deps);

    useEffect(() => {
        doUpdate();
        return () => doUpdate(true);
    }, deps);
}
