import SharedState from '@/libs/sharedState';
import { useCallback, useEffect, useState } from 'react';

export default function useSharedStateGetter<K>(stateManager: SharedState<K>) {
    const [state, setState] = useState(stateManager.get());

    const handler = useCallback((newState: K) => {
        setState(stateManager.copy(newState));
    }, []);

    useEffect(() => {
        stateManager.registerListener(handler);

        return () => {
            stateManager.removeListener(handler);
        };
    }, []);

    return state;
}
