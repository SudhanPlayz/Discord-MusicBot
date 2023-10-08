import { WS_ROUTES_PREFIX } from '../lib/constants';

export function createWsRoute(route: string) {
  return WS_ROUTES_PREFIX + route;
}
