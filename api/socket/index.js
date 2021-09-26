const { Server } = require("socket.io");
const prettyMilliseconds = require("pretty-ms");

/**
 * @param {Server} io
 */
module.exports = (io) => {
  io.on("connection", (socket) => {
    //Bot's Main Page
    socket.on("dashboard", () => {
      if (socket.Dashboard) clearInterval(socket.Dashboard);
      socket.Dashboard = setInterval(() => {
        const Client = require("../../index");
        if (!Client.Ready) return;
        socket.emit("dashboard", {
          commands: Client.CommandsRan,
          users: Client.users.cache.size,
          guilds: Client.guilds.cache.size,
          songs: Client.SongsPlayed,
        });
      }, 1000);
    });

    socket.on("server", (ServerID) => {
      if (socket.Server) clearInterval(socket.Server);
      socket.Server = setInterval(async () => {
        const Client = require("../../index");
        if (!Client.Ready) return;
        let Guild = Client.guilds.cache.get(ServerID);
        if (!Guild) return socket.emit("error", "Unable to find that server");
        let GuildDB = await Client.GetGuild(Guild.id);
        let player = Client.Manager.get(Guild.id);
        if (!player) {
          socket.emit("server", {
            queue: 0,
            songsLoop: "Disabled",
            queueLoop: "Disabled",
            prefix: GuildDB ? GuildDB.prefix : Client.botconfig.DefaultPrefix,
          });
        } else {
          socket.emit("server", {
            queue: player.queue ? player.queue.length : 0,
            songsLoop: player.trackRepeat ? "Enabled" : "Disabled",
            queueLoop: player.queueRepeat ? "Enabled" : "Disabled",
            prefix: GuildDB ? GuildDB.prefix : Client.botconfig.DefaultPrefix,
            bar: player.queue.current
              ? Client.ProgressBar(
                  player.position,
                  player.queue.current.duration,
                  20
                ).Bar
              : false,
            maxDuration: player.queue.current
              ? prettyMilliseconds(player.queue.current.duration, {
                  colonNotation: true,
                })
              : false,
            position: player.queue.current
              ? prettyMilliseconds(player.position, { colonNotation: true })
              : false,
            nowPlaying: player.queue.current ? player.queue.current : false,
          });
        }
      }, 1000);
    });
  });
};
