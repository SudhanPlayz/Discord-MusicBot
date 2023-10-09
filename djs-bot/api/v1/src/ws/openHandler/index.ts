import { WebSocket } from 'uWebSockets.js';
import { ESocketEventType, IPlayerSocket } from '../../interfaces/ws';
import { getBot } from '../..';
import {
  createErrPayload,
  createEventPayload,
  wsPlayerSubscribe,
  wsSendJson,
} from '../../utils/ws';
import { CosmiPlayer } from 'cosmicord.js';

function getPlayerQueue(player: CosmiPlayer) {
  return player.queue.map((t) => ({
    ...t,
  }));
}

export default function handleOpen(ws: WebSocket<IPlayerSocket>) {
  const bot = getBot();
  const wsData = ws.getUserData();
  //            !TODO: WTF IS A `bot.manager`
  const player = bot.manager?.Engine.players.get(wsData.serverId);

  if (!player) {
    wsSendJson(ws, createErrPayload('No active player'));

    return;
  }

  const playing = player.queue.current;

  if (playing)
    wsSendJson(
      ws,
      createEventPayload(ESocketEventType.PLAYING, { ...playing }),
    );

  wsSendJson(
    ws,
    createEventPayload(ESocketEventType.GET_QUEUE, getPlayerQueue(player)),
  );

  wsPlayerSubscribe(ws);
}
