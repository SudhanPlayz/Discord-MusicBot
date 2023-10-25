import { WebSocket } from 'uWebSockets.js';
import { IPlayerSocket } from '../../interfaces/ws';
import {
  ESocketErrorCode,
  ESocketEventType,
  ISocketEvent,
} from '../../interfaces/wsShared';
import { getBot } from '../..';
import { wsSendJson } from '../../utils/ws';
import { createErrPayload } from '../../utils/wsShared';

// !TODOS
export async function handleSeekEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.SEEK>,
) {
  const bot = getBot(true);

  if (!bot) {
    return wsSendJson(
      ws,
      createErrPayload(ESocketErrorCode.INTERNAL_SERVER_ERROR, 'Bot offline'),
    );
  }

  const to = ev.d?.t;

  if (typeof to !== 'number') {
    return wsSendJson(
      ws,
      createErrPayload(ESocketErrorCode.BAD_REQUEST, 'Invalid argument'),
    );
  }

  const wsData = ws.getUserData();
  const player = bot.manager?.Engine.players.get(wsData.serverId);

  if (!player) {
    return wsSendJson(
      ws,
      createErrPayload(
        ESocketErrorCode.BAD_REQUEST,
        'No active player in this guild',
      ),
    );
  }

  player.seek(to);
}

export async function handleGetQueueEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.GET_QUEUE>,
) {}

export async function handleSearchEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.SEARCH>,
) {}

export async function handleAddTrackEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.ADD_TRACK>,
) {}

export async function handlePlayEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.PLAY>,
) {}

export async function handlePauseEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.PAUSE>,
) {}
