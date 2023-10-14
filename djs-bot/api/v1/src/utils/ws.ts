import { HttpResponse, WebSocket } from 'uWebSockets.js';
import { WS_ROUTES_PREFIX } from '../lib/constants';
import { IPlayerSocket } from '../interfaces/ws';
import {
  ESocketErrorCode,
  ESocketEventType,
  ISocketData,
  ISocketEvent,
} from '../interfaces/wsShared';
import { getBot } from '..';
import { CosmiPlayer } from 'cosmicord.js';

export function createWsRoute(route: string) {
  return WS_ROUTES_PREFIX + route;
}

export function bufferToString(buf: ArrayBuffer) {
  return Buffer.from(buf).toString();
}

export function resEndJson(res: HttpResponse, json: object) {
  res.writeHeader('Content-Type', 'application/json').end(JSON.stringify(json));
}

export function wsSendJson<T = {}>(ws: WebSocket<T>, json: object) {
  ws.send(JSON.stringify(json));
}

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

export function wsPlayerSubscribe(ws: WebSocket<IPlayerSocket>) {
  const wsData = ws.getUserData();

  ws.subscribe('player/' + wsData.serverId);
}

export function wsPublish<K extends ESocketEventType>(
  topic: string,
  e: ISocketEvent<K>,
) {
  const bot = getBot(true);

  // silently fail if server isn't initialized
  if (!bot) return;

  bot.wsServer?.publish(topic, JSON.stringify(e));
}

export function getPlayerQueue(player: CosmiPlayer) {
  return player.queue.map((t) => ({
    ...t,
  }));
}
