import { app } from './index';

const server = app();

server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
