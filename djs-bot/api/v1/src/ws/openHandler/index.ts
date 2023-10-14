import { WebSocket } from 'uWebSockets.js';
import { ESocketErrorCode, ESocketEventType } from '../../interfaces/wsShared';
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

  const sendDEmpty = () => {
    const dEmpty = createEventPayload(ESocketEventType.PLAYING);
    wsSendJson(ws, dEmpty);
  };

  if (!player) {
    sendDEmpty();

    const d2 = createErrPayload(ESocketErrorCode.NOTHING, 'No active player');
    wsSendJson(ws, d2);

    return;
  }

  const playing = player.queue.current;

  if (playing) {
    const d = createEventPayload(ESocketEventType.PLAYING, { ...playing });
    wsSendJson(ws, d);
  } else sendDEmpty();

  const d = createEventPayload(
    ESocketEventType.GET_QUEUE,
    getPlayerQueue(player),
  );
  wsSendJson(ws, d);

  wsPlayerSubscribe(ws);
}
