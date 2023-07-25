import { getBot, pkg } from '../..';
import type { RegisterRouteHandler } from '../../interfaces/common';
import APIError from '../../lib/APIError';

const routes: RegisterRouteHandler = (app, opts, done) => {
  // !TODO: probably move this to each own folder

  app.get('/', async (request, reply) => {
    reply.send({
      message: 'Systems Operational!',
      version: pkg.version,
    });
  });

  app.get('/commands', async (request, reply) => {
    const bot = getBot();

    return {
      commands: bot.slash.map((command) => ({
        name: command.name,
        description: command.description,
      })),
    };
  });

  app.get('/dashboard', async (request, reply) => {
    const bot = getBot();

    return {
      commandsRan: bot.commandsRan || 0,
      users: bot.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0,
      ),
      servers: bot.guilds.cache.size,
      songsPlayed: bot.songsPlayed || 0,
    };
  });

  app.get('/servers', async (request, reply) => {
    const bot = getBot();

    const id = (request.query as { id: string | undefined }).id;
    if (id) {
      const guild = bot.guilds.cache.get(id);
      if (!guild)
        throw new APIError(
          'Server not found',
          APIError.STATUS_CODES.NOT_FOUND,
          APIError.ERROR_CODES.NOT_FOUND,
        );

      return {
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
          queue: bot.manager.Engine.players
            .get(guild.id)
            ?.queue.map((track: any) => ({
              title: track.title,
              author: track.author,
              duration: track.duration,
            })),
          playing: {
            title: bot.manager.Engine.players.get(guild.id)?.queue.current
              ?.title,
            author: bot.manager.Engine.players.get(guild.id)?.queue.current
              ?.author,
            duration: bot.manager.Engine.players.get(guild.id)?.queue.current
              ?.duration,
          },
        },
      };
    }

    return {
      servers: bot.guilds.cache.map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
      })),
    };
  });

  done();
};

export default routes;
