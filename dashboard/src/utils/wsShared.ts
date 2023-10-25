////////////////////////////////////////////////////////////////////////////////////////////////////
// "Shared Utils"
// Must be in sync with api utils
////////////////////////////////////////////////////////////////////////////////////////////////////

import {
    ESocketErrorCode,
    ESocketEventType,
    ISocketData,
    ISocketEvent,
} from '../interfaces/wsShared';

export function createErrPayload<K extends ESocketErrorCode>(
    code: K,
    message?: string,
): ISocketEvent<ESocketEventType.ERROR> {
    return {
        e: ESocketEventType.ERROR,
        d: { code, message },
    };
}

export function createEventPayload<K extends ESocketEventType>(
    e: K,
    d: ISocketData[K] | null = null,
) {
    return {
        e,
        d,
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
