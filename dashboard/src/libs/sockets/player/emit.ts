import { createEventPayload } from '@/utils/wsShared';
import { sendJson } from './states';
import { ESocketEventType } from '@/interfaces/wsShared';

export function emitSeek(position: number) {
    sendJson(createEventPayload(ESocketEventType.SEEK, position));
}

export function emitPause(state: boolean) {
    sendJson(createEventPayload(ESocketEventType.PAUSE, state));
}

export function emitPrevious() {
    sendJson(createEventPayload(ESocketEventType.PREVIOUS));
}

export function emitNext() {
    sendJson(createEventPayload(ESocketEventType.NEXT));
}

export function emitQueueUpdate(queue: number[]) {
    sendJson(createEventPayload(ESocketEventType.UPDATE_QUEUE, queue));
}

export function emitTrackRemove(id: number) {
    sendJson(createEventPayload(ESocketEventType.REMOVE_TRACK, id));
}
