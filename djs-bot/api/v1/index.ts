import fastify from 'fastify';
import type Bot from '../../lib/Bot';
import routes from './routes/v1';

const server = fastify();

let bot: Bot | undefined;

const getBot = () => bot;

const app = (djsBot?: Bot) => {
  bot = djsBot;

  server.register(routes, {
    prefix: '/v1',
  });

  return server;
};

export default app;
export { getBot };

module.exports = app;
