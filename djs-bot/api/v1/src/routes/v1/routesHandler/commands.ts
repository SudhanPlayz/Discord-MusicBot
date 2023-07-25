import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';

const handler: RouteHandler = async (request, reply) => {
  const bot = getBot();

  return {
    commands: bot.slash.map((command) => ({
      name: command.name,
      description: command.description,
    })),
  };
};

export default handler;
