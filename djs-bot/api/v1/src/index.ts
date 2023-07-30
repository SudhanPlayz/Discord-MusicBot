import fastify from 'fastify';
import type { Bot } from './interfaces/common';
import routes from './routes/v1';
import routesErrorHandler from './routes/v1/errorHandler';
import APIError from './lib/APIError';
import cors from '@fastify/cors';
import { API_ROUTES_PREFIX } from './lib/constants';

const pkg = require('../../../package.json');

const server = fastify({
  logger: false, // true,
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

const corsOpts = {
  origin: true,
  methods: 'GET',
  credentials: true,
};

const setupServer = async () => {
  server.setErrorHandler(routesErrorHandler);

  await server.register(cors);

  server.get('/', async (request, reply) => {
    return {
      message: 'Systems Operational!',
      version: pkg.version,
    };
  });

  await server.register(routes, {
    prefix: API_ROUTES_PREFIX,
  });
};

const app = (djsBot?: Bot) => {
  bot = djsBot;

  setupServer();

  return server;
};

export { app, getBot, pkg };
