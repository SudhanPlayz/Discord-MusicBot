import { getBot } from '../../..';
import APIError from '../../../lib/APIError';
import { RouteHandler } from '../../../interfaces/common';
import { createReply } from '../../../utils/reply';
import { getUserGuilds } from '../../../services/discord';
import { Guild } from 'discord.js';
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

  const id = (request.query as { id: string | undefined }).id;
  if (id) {
    const guild = bot.guilds.cache.get(id);
    if (!guild)
      throw new APIError(
        'Server not found',
        APIError.STATUS_CODES.NOT_FOUND,
        APIError.ERROR_CODES.NOT_FOUND,
      );

    return createReply({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
      owner: guild.ownerId,
      roles: guild.roles.cache.map((role) => ({
        id: role.id,
        name: role.name,
        color: role.hexColor,
      })),
      channels: guild.channels.cache.map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        parent: channel.parentId,
      })),
      members: guild.members.cache.map((member) => ({
        id: member.id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: member.user.avatarURL(),
        roles: member.roles.cache.map((role) => role.id),
      })),
      // !TODO: typing is missing here, add typing for MusicManager
      player: {
        queue: bot.manager?.Engine.players
          .get(guild.id)
          ?.queue.map((track: any) => ({
            title: track.title,
            author: track.author,
            duration: track.duration,
          })),
        playing: {
          title: bot.manager?.Engine.players.get(guild.id)?.queue.current
            ?.title,
          author: bot.manager?.Engine.players.get(guild.id)?.queue.current
            ?.author,
          duration: bot.manager?.Engine.players.get(guild.id)?.queue.current
            ?.duration,
        },
      },
      nodes: lavaNodesAggregates,
    });
  }

  const guilds = await getUserGuilds(request.headers.user_id as string);

  return createReply({
    servers: guilds
      .map((userGuild) => {
        // @ts-ignore
        const guild: Guild = new Guild(bot, userGuild);

        const cachedGuild = bot.guilds.cache.get(guild.id);

        return {
          ...userGuild,
          icon: guild.iconURL(),
          mutual: !!cachedGuild,
        };
      })
      .sort((a, b) => ((b.mutual && 1) || 0) - ((a.mutual && 1) || 0)),
  });
};

export const options = { requiresAuth: true };

export default handler;
