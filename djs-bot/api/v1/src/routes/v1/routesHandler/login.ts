import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';
import { createReply } from '../../../utils/reply';

const handler: RouteHandler = async (request, reply) => {
  const bot = getBot();

  return createReply(bot.config.oauth2);
};

export default handler;
