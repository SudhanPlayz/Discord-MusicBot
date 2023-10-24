import { WebSocket } from 'uWebSockets.js';
import { LogSeverety } from '../interfaces/log';
import { IPlayerSocket } from '../interfaces/ws';

export function wsLog(sev: LogSeverety, ...args: any[]) {
  console[sev]('wsServer:', ...args);
}

export function playerLog(
  sev: LogSeverety,
  ws: WebSocket<IPlayerSocket>,
  ...args: any[]
) {
  const wsData = ws.getUserData();

  wsLog(sev, 'player/' + wsData.serverId + ':', ...args);
}
