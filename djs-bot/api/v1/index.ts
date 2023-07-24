import fastify from 'fastify';
const Bot = require('../../../lib/Bot');

const server = fastify();

// !TODO: move this to routes/
server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

// !TODO: add type declaration to Bot.js
let bot: typeof Bot | undefined;

const getBot = () => bot;

const app = (djsBot?: typeof Bot) => {
  bot = djsBot;
  return server;
};

export default app;
export { getBot };

module.exports = app;
