import { WebSocket } from 'uWebSockets.js';
import { ESocketEventType } from '../../interfaces/wsShared';
import { getBot } from '../..';
import {
  createErrPayload,
  createEventPayload,
  getPlayerQueue,
  wsPlayerSubscribe,
  wsSendJson,
} from '../../utils/ws';
import { IPlayerSocket } from '../../interfaces/ws';

export default function handleOpen(ws: WebSocket<IPlayerSocket>) {
  const bot = getBot();
  const wsData = ws.getUserData();
  //            !TODO: WTF IS A `bot.manager`
  const player = bot.manager?.Engine.players.get(wsData.serverId);

  if (!player) {
    const d = createErrPayload('No active player');
    wsSendJson(ws, d);

    return;
  }

  const playing = player.queue.current;

  if (playing) {
    const d = createEventPayload(ESocketEventType.PLAYING, { ...playing });
    wsSendJson(ws, d);
  }

  const d = createEventPayload(
    ESocketEventType.GET_QUEUE,
    getPlayerQueue(player),
  );
  wsSendJson(ws, d);

  wsPlayerSubscribe(ws);
}
