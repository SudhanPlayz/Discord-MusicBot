import { WebSocket } from 'uWebSockets.js';
import { playerLog } from '../../utils/log';
import { IPlayerSocket } from '../../interfaces/ws';
import { ESocketEventType, ISocketEvent } from '../../interfaces/wsShared';
import { createErrPayload, wsSendJson } from '../../utils/ws';

// !TODOS
async function handleSeekEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.SEEK>,
) {}

async function handleGetQueueEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.GET_QUEUE>,
) {}

async function handleSearchEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.SEARCH>,
) {}

async function handleAddTrackEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.ADD_TRACK>,
) {}

async function handlePlayEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.PLAY>,
) {}

async function handlePauseEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.PAUSE>,
) {}

const handlers = {
  // whether these should been fastify endpoints are up for debate
  [ESocketEventType.SEEK]: handleSeekEvent,
  [ESocketEventType.GET_QUEUE]: handleGetQueueEvent,
  [ESocketEventType.SEARCH]: handleSearchEvent,
  [ESocketEventType.ADD_TRACK]: handleAddTrackEvent,
  [ESocketEventType.PLAY]: handlePlayEvent,
  [ESocketEventType.PAUSE]: handlePauseEvent,

  // only here to silence typescript error
  [ESocketEventType.PLAYING]: undefined,
};

export default function handleMessage(
  ws: WebSocket<IPlayerSocket>,
  message: string,
) {
  // handle ping, keeping the connection alive is client responsibility
  if (message === '1') {
    return ws.send('0');
  }

  try {
    const data = JSON.parse(message);

    const handler = handlers[data?.e as ESocketEventType];

    if (!handler) {
      // !TODO: limit number of invalid event? probably by remote address whatever uws provides
      // if (invalidEventLimitHit(ws)) {
      // ws.close();
      // return;
      // }

      const d = createErrPayload('Invalid event: ' + data?.e);

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
