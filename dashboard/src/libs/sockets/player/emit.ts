import { createEventPayload } from '@/utils/wsShared';
import { sendJson } from './states';
import { ESocketEventType } from '@/interfaces/wsShared';

export function emitSeek(position: number) {
    sendJson(createEventPayload(ESocketEventType.SEEK, { t: position }));
}
