import { app, wsApp } from './index';

const API_PORT = 3000;
const WS_PORT = 8080;

const server = app();

server.listen({ host: '0.0.0.0', port: API_PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`API Server listening at ${address}`);
});

const wsServer = wsApp();

wsServer.listen(WS_PORT, (listenSocket) => {
  if (listenSocket) {
    console.log(`WS Server listening to port ${WS_PORT}`);
    return;
  }

  throw new Error('Unable to start WS Server');
});
