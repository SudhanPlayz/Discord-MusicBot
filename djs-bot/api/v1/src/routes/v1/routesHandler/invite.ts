import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';
import { createReply } from '../../../utils/reply';

const handler: RouteHandler = async (request, reply) => {
  const bot = getBot();

  return createReply(bot.getInviteLink());
};

export default handler;
