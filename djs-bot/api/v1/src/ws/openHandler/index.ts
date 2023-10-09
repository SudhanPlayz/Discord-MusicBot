import { WebSocket } from 'uWebSockets.js';
import { IPlayerSocket } from '../../interfaces/ws';
import { getBot } from '../..';
import { createErrPayload, wsSendJson } from '../../utils/ws';

export default function handleOpen(ws: WebSocket<IPlayerSocket>) {
  // !TODO: immediately send bot state, playing track, queue etc.
  //
  // get guild data
  const bot = getBot();
  const wsData = ws.getUserData();
  //            !TODO: WTF IS A `bot.manager`
  const player = bot.manager?.Engine.players.get(wsData.serverId);

  if (!player) {
    wsSendJson(ws, createErrPayload('No active player'));

    return;
  }
}
