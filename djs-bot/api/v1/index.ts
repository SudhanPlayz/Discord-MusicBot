import fastify from 'fastify';
import type Bot from '../../lib/Bot';

const server = fastify();

// !TODO: move this to routes/
server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

let bot: Bot | undefined;

const getBot = () => bot;

const app = (djsBot?: Bot) => {
  bot = djsBot;
  return server;
};

export default app;
export { getBot };

module.exports = app;
