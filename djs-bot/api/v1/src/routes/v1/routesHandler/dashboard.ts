import { getBot } from '../../..';
import { RouteHandler } from '../../../interfaces/common';
import { createReply } from '../../../utils/reply';
import APIError from '../../../lib/APIError';
import moment from 'moment';


const handler: RouteHandler = async (request, reply) => {
  const bot = getBot();

  if (!bot)
    throw new APIError(
      'Bot not found',
      APIError.STATUS_CODES.NOT_FOUND,
      APIError.ERROR_CODES.NOT_FOUND,
    );

  const lavaNodes = bot.manager?.Engine.nodes.entries();

  if (!lavaNodes)
    throw new APIError(
      'Lava nodes not found',
      APIError.STATUS_CODES.NOT_FOUND,
      APIError.ERROR_CODES.NOT_FOUND,
    );

  let lavaNodesAggregates = {};
  for (const [nodeId, node] of lavaNodes) {
    lavaNodesAggregates = {
      ...lavaNodesAggregates,
      [nodeId]: {
        id: nodeId,
        connected: node.connected,
        nodeStats: node.stats,
        stats: {
          cores: node.stats.cpu.cores,
          // @ts-ignore
          uptime: moment.duration(node.stats.uptime).format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]"),
          ramUsage: (node.stats.memory.used / 1024 / 1024).toFixed(2),
          ramTotal: (node.stats.memory.allocated / 1024 / 1024).toFixed(2),
        }
      },
    };
  }

  return createReply({
    commandsRan: bot.commandsRan || 0,
    users: bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    servers: bot.guilds.cache.size,
    songsPlayed: bot.songsPlayed || 0,
    nodes: lavaNodesAggregates,
  });
};

export const options = { requiresAuth: true };

export default handler;
