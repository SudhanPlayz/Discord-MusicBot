import { useRef } from 'react';

export default function useAbortDelay() {
    const ref = useRef<true | undefined>();

    const start = () => {
        ref.current = true;
    };

    const end = () => {
        ref.current = undefined;
    };

    const run = (cb: () => void, delay: number) => {
        start();

        setTimeout(() => {
            if (!ref.current) return;

            cb();

            end();
        }, delay);
    };

    const reset = () => {
        if (ref.current) ref.current = undefined;
    };

    return { reset, ref, run };
}
