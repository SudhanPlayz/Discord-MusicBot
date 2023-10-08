import { WebSocket } from 'uWebSockets.js';
import { IPlayerSocket } from '../../interfaces/ws';

export default function handleOpen(ws: WebSocket<IPlayerSocket>) {
  // !TODO: immediately send bot state, playing track, queue etc.
  //
  // get guild data
  // const socketData = ws.getUserData();
  // bot.getdata(socketData.serverId)
}
