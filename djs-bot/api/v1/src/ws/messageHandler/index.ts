import { WebSocket } from 'uWebSockets.js';
import { playerLog } from '../../utils/log';
import { IPlayerSocket } from '../../interfaces/ws';
import { ESocketErrorCode, ESocketEventType } from '../../interfaces/wsShared';
import { wsSendJson } from '../../utils/ws';
import {
  handleSeekEvent,
  handleGetQueueEvent,
  handleSearchEvent,
  handleAddTrackEvent,
  handlePlayEvent,
  handlePauseEvent,
  handlePreviousEvent,
  handleNextEvent,
  handleUpdateQueueEvent,
  handleRemoveTrackEvent,
} from './handlers';
import { createErrPayload } from '../../utils/wsShared';

const handlers = {
  // whether these should been fastify endpoints are up for debate
  [ESocketEventType.SEEK]: handleSeekEvent,
  [ESocketEventType.GET_QUEUE]: handleGetQueueEvent,
  [ESocketEventType.SEARCH]: handleSearchEvent,
  [ESocketEventType.ADD_TRACK]: handleAddTrackEvent,
  [ESocketEventType.PLAY]: handlePlayEvent,
  [ESocketEventType.PAUSE]: handlePauseEvent,
  [ESocketEventType.PREVIOUS]: handlePreviousEvent,
  [ESocketEventType.NEXT]: handleNextEvent,
  [ESocketEventType.UPDATE_QUEUE]: handleUpdateQueueEvent,
  [ESocketEventType.REMOVE_TRACK]: handleRemoveTrackEvent,

  // only here to silence typescript error
  [ESocketEventType.PLAYING]: undefined,
  [ESocketEventType.ERROR]: undefined,
  [ESocketEventType.PROGRESS]: undefined,
};

export default function handleMessage(
  ws: WebSocket<IPlayerSocket>,
  message: string,
) {
  // handle ping, keeping the connection alive is client responsibility
  if (message === '1') {
    return ws.send('0');
  }

  console.log(message);

  try {
    const data = JSON.parse(message);

    const handler = handlers[data?.e as ESocketEventType];

    if (!handler) {
      // !TODO: limit number of invalid event? probably by remote address whatever uws provides
      // if (invalidEventLimitHit(ws)) {
      // ws.close();
      // return;
      // }

      const d = createErrPayload(
        ESocketErrorCode.INVALID_EVENT,
        'Invalid event: ' + data?.e,
      );

      // !TODO: debug log, remove when done
      playerLog('error', ws, { invalidEvent: d, ws });

      wsSendJson(ws, d);

      return;
    }

    return handler(ws, data);
  } catch (e) {
    playerLog('error', ws, 'Message:', e);

    // you're not supposed to send me garbage
    ws.close();
  }
}
