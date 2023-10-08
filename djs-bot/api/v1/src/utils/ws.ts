import { HttpResponse } from 'uWebSockets.js';
import { WS_ROUTES_PREFIX } from '../lib/constants';

export function createWsRoute(route: string) {
  return WS_ROUTES_PREFIX + route;
}

export function bufferToString(buf: ArrayBuffer) {
  return Buffer.from(buf).toString();
}

export function resEndJson(res: HttpResponse, json: object) {
  res.writeHeader('Content-Type', 'application/json').end(JSON.stringify(json));
}
