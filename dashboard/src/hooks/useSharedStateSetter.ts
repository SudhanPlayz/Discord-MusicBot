import { ISharedState } from '@/interfaces/sharedState';
import { setSharedState } from '@/libs/sharedState';
import { useEffect } from 'react';

interface IUseSharedStateSetterParam {
    0: keyof ISharedState;
    1: ISharedState[keyof ISharedState];
}

export default function useSharedStateSetter(
    ...args: IUseSharedStateSetterParam[]
) {
    useEffect(
        () => {
            for (const v of args) {
                setSharedState(v[0], v[1]);
            }

            return () => {
                for (const v of args) {
                    setSharedState(v[0], undefined);
                }
            };
        },
        args.map((v) => v[1]),
    );
}
