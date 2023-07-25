import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';

const handler: RouteHandler = async (request, reply) => {
  const bot = getBot();

  return {
    commandsRan: bot.commandsRan || 0,
    users: bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    servers: bot.guilds.cache.size,
    songsPlayed: bot.songsPlayed || 0,
  };
};

export default handler;
