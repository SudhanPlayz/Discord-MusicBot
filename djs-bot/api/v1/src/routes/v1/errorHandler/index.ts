import { getBot } from '../../..';
import type { RouteErrorHandler } from '../../../interfaces/common';
import APIError from '../../../lib/APIError';
import axios from 'axios';

const routesErrorHandler: RouteErrorHandler = (err, request, reply) => {
  const bot = getBot(true);

  if (err instanceof APIError) {
    reply.status(err.status).send({
      success: false,
      code: err.code,
      message: err.message,
    });

    return;
  }

  if (err?.name === 'JsonWebTokenError') {
    reply.status(APIError.STATUS_CODES.UNAUTHORIZED).send({
      success: false,
      code: APIError.ERROR_CODES.UNAUTHORIZED,
      message: 'Go away you pesky hacker',
    });

    return;
  }

  if (err instanceof axios.AxiosError && err.response) {
    const { status, data } = err.response;

    reply.status(status).send({
      success: false,
      code: status,
      data,
      message: data?.error,
      description: data?.error_description,
    });
    return;
  }

  if (bot) {
    bot.error('Unhandled server error:');
    bot.error(err);
  }

  console.error(err);

  reply.status(500).send();
};

export default routesErrorHandler;
