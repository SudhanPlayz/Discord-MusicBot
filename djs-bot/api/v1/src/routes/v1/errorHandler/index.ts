import { getBot } from '../../..';
import type { RouteErrorHandler } from '../../../interfaces/common';
import APIError from '../../../lib/APIError';

const routesErrorHandler: RouteErrorHandler = (err, request, reply) => {
  const bot = getBot(true);

  if (err instanceof APIError) {
    reply.status(err.status).send({
      error: true,
      code: err.code,
      message: err.message,
    });

    return;
  }

  if (bot) {
    bot.error('Unhandled server error:');
    bot.error(err);
  } else {
    console.error('Unhandled server error:');
    console.error(err);
  }

  reply.status(500).send();
};

export default routesErrorHandler;
