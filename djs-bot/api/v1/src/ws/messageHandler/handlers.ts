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
import { MusicClient } from '../../../../../lib/clients/MusicClient';

function getTypeOfValidator<T extends ESocketEventType>(
  type: string,
  err: string,
) {
  return (e: ISocketEvent<T>) => (typeof e.d !== type ? err : undefined);
}

function wsUseGuildPlayerRoutine<T extends ESocketEventType>(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<T>,
  isArgumentValid: (ev: ISocketEvent<T>) => string | undefined,
): ReturnType<MusicClient['players']['get']> {
  const bot = getBot(true);

  if (!bot) {
    wsSendJson(
      ws,
      createErrPayload(ESocketErrorCode.INTERNAL_SERVER_ERROR, 'Bot offline'),
    );
    return;
  }

  const err = isArgumentValid(ev);
  if (err?.length) {
    wsSendJson(ws, createErrPayload(ESocketErrorCode.BAD_REQUEST, err));
    return;
  }

  const wsData = ws.getUserData();
  const player = bot.manager?.Engine.players.get(wsData.serverId);

  if (!player) {
    wsSendJson(
      ws,
      createErrPayload(
        ESocketErrorCode.BAD_REQUEST,
        'No active player in this guild',
      ),
    );
    return;
  }

  return player;
}

// !TODOS
export async function handleSeekEvent(
  ws: WebSocket<IPlayerSocket>,
  ev: ISocketEvent<ESocketEventType.SEEK>,
) {
  const player = wsUseGuildPlayerRoutine(
    ws,
    ev,
    getTypeOfValidator('number', 'Invalid argument'),
  );

  if (!player || ev.d === null) return;

  player.seek(ev.d);
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
) {
  const player = wsUseGuildPlayerRoutine(
    ws,
    ev,
    getTypeOfValidator('boolean', 'Invalid argument'),
  );

  if (!player || ev.d === null) return;

  player.pause(ev.d);
}
