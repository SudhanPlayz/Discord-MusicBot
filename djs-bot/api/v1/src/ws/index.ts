import { WSApp } from '../interfaces/common';
import { playerLog, wsLog } from '../utils/log';
import { bufferToString, createWsRoute, resEndJson } from '../utils/ws';
import { getBot, getPkg } from '../';
import handleOpen from './openHandler';
import handleMessage from './messageHandler';
import { IPlayerSocket } from '../interfaces/ws';

export function setupWsServer(wsServer: WSApp) {
  /* upgrade, open, message, ping, pong, close */

  wsServer
    .ws(createWsRoute('/echo'), {
      idleTimeout: 32,
      // upgrade: (res, req, ctx) => {},
      // ping: (ws, message) => {},
      // pong: (ws, message) => {},

      open: (ws) => {
        wsLog(
          'log',
          'echo: Connected:',
          bufferToString(ws.getRemoteAddressAsText()),
        );
      },
      message: (ws, message, isBinary) => {
        wsLog(
          'log',
          'echo: From:',
          bufferToString(ws.getRemoteAddressAsText()),
        );

        wsLog('log', 'echo: Message:', bufferToString(message));

        let ok = ws.send(message, isBinary);

        wsLog('log', 'echo: Status:', ok);
      },
      close: (ws, code, message) => {
        wsLog('log', 'echo: Message:', bufferToString(message));
        wsLog('log', 'echo: Code:', code);
      },
    })
    .ws<IPlayerSocket>(createWsRoute('/player/:serverId'), {
      // client should ping at least every 10 seconds
      idleTimeout: 15,
      upgrade: (res, req, ctx) => {
        const serverId = req.getParameter(0);

        const bot = getBot(true);

        const resErr = (message: string) => {
          resEndJson(res, {
            success: false,
            message,
            data: null,
          });
        };

        if (!bot) {
          // how? this should never happen!
          res.writeStatus('500 Internal Server Error');

          resErr('Bot offline');

          return;
        }

        // !TODO: validate serverId, send 404 if not found
        if (!bot.serverExist(serverId)) {
          res.writeStatus('404 Not Found');

          resErr('Invalid server');

          return;
        }

        res.upgrade(
          // populate socket data
          {
            serverId,
          },
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          ctx,
        );
      },
      open: (ws) => {
        handleOpen(ws);
      },
      message: (ws, message, isBinary) => {
        if (isBinary) {
          // what nasty stuff are you sending me?
          ws.close();

          playerLog(
            'error',
            ws,
            new Error('Message: Invalid format: binary\nConnection closed'),
          );

          return;
        }

        handleMessage(ws, bufferToString(message));
      },
      // close: (ws, code, message) => {
      // !TODO: if needed
      // },
    })
    .get(createWsRoute('/'), (res, req) => {
      res.writeStatus('200 OK');

      resEndJson(res, {
        message: 'WebSocket server is up and running!',
        version: getPkg().version,
      });
    });
}
