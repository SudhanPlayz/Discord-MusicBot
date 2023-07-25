import fastify from 'fastify';
import type { Bot } from './interfaces/common';
import routes from './routes/v1';
import routesErrorHandler from './routes/v1/errorHandler';
import APIError from './lib/APIError';

const pkg = require('../../../package.json');

const server = fastify({
  logger: true,
});

let bot: Bot | undefined;

/**
 * Careful with noThrow = true, the return value might be
 * undefined. Type was forced for convenience
 */
const getBot = (noThrow: boolean = false) => {
  if (!noThrow && !bot)
    throw new APIError(
      'Bot not running',
      APIError.STATUS_CODES.NO_BOT,
      APIError.ERROR_CODES.NO_BOT,
    );

  return bot as Bot;
};

const app = (djsBot?: Bot) => {
  bot = djsBot;

  server.register(routes, {
    prefix: '/api/v1',
  });

  server.setErrorHandler(routesErrorHandler);

  return server;
};

export default app;
export { getBot, pkg };

module.exports = app;
