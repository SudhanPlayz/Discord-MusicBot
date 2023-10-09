import { HttpResponse, WebSocket } from 'uWebSockets.js';
import { WS_ROUTES_PREFIX } from '../lib/constants';
import { ESocketEventType, IPlayerSocket, ISocketData } from '../interfaces/ws';

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

export function createErrPayload<T = {}>(message?: string, d: T | null = null) {
  return {
    err: true,
    message,
    d,
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
