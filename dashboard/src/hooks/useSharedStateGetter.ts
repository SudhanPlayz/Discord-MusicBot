import { ISharedState } from '@/interfaces/sharedState';
import {
    copySharedState,
    getSharedState,
    registerListener,
    removeListener,
} from '@/libs/sharedState';
import { useCallback, useEffect, useState } from 'react';

export default function useSharedStateGetter() {
    const [state, setState] = useState(getSharedState());

    const handler = useCallback((newState: ISharedState) => {
        setState(copySharedState(newState));
    }, []);

    useEffect(() => {
        registerListener(handler);

        return () => {
            removeListener(handler);
        };
    }, []);

    return state;
}
