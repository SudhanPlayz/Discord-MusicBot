import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';
import { createReply } from '../../../utils/reply';

// !TODO: what this endpoint made for?
const handler: RouteHandler = async (request, reply) => {
  const bot = getBot();

  return createReply({
    commands: bot.slash.map((command) => ({
      name: command.name,
      description: command.description,
    })),
  });
};

export const options = { requiresAuth: true };

export default handler;
