const SlashCommand = require("../../lib/SlashCommand");
const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const os = require("os");

const command = new SlashCommand()
  .setName("stats")
  .setDescription("Get information about the bot")
  .setRun(async (client, interaction) => {
    // get OS info
    const osver = os.platform() + " " + os.release();

    // Get nodejs version
    const nodeVersion = process.version;

    // get the uptime in a human readable format
    const runtime = moment
      .duration(client.uptime)
      .format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
    // show lavalink uptime in a nice format
    const lavauptime = moment
      .duration(client.manager.nodes.values().next().value.stats.uptime)
      .format(" D[d], H[h], m[m]");
    // show lavalink memory usage in a nice format
    const lavaram = (
      client.manager.nodes.values().next().value.stats.memory.used /
      1024 /
      1024
    ).toFixed(2);
    // sow lavalink memory alocated in a nice format
    const lavamemalocated = (
      client.manager.nodes.values().next().value.stats.memory.allocated /
      1024 /
      1024
    ).toFixed(2);
    // show system uptime
    var sysuptime = moment
      .duration(os.uptime() * 1000)
      .format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");

    const embed = new MessageEmbed()
      .setTitle(`${client.user.username} Information`)
      .setColor(client.config.embedColor)
      .setDescription(
        `\`\`\`yml\nName: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI Latency: ${client.ws.ping}ms\nRuntime: ${runtime}\`\`\``
      )
      .setFields([
        {
          name: "Lavalink stats",
          value: `\`\`\`yml\nUptime: ${lavauptime}\nRAM: ${lavaram} / ${lavamemalocated} MB\nPlaying: ${
            client.manager.nodes.values().next().value.stats.playingPlayers
          } out of ${
            client.manager.nodes.values().next().value.stats.players
          }\`\`\``,
          inline: true,
        },
        {
          name: "Bot stats",
          value: `\`\`\`yml\nGuilds: ${
            client.guilds.cache.size
          } MB\nNodeJS: ${nodeVersion}\nDiscordMusicBot: v${
            require("../../package.json").version
          }\`\`\``,
          inline: true,
        },
        {
          name: "System stats",
          value: `\`\`\`yml\nOS: ${osver}\nUptime: ${sysuptime}\n\`\`\``,
          inline: false,
        },
      ]);

    // .setFields([
    //   {
    //     name: "**Bot Statistic**",
    //     value: `📶 Ping • \`${
    //       client.ws.ping
    //     }ms\n\`:file_cabinet: Memory • \`${(
    //       process.memoryUsage().heapUsed /
    //       1024 /
    //       1024
    //     ).toFixed(2)}MB\`\n\n🕒 Uptime • \`${botuptime}\`\n👨‍💻 Guilds • \`${
    //       client.guilds.cache.size
    //     }\``,
    //     inline: true,
    //   },
    //   {
    //     name: "**Lavalink Statistic**",
    //     value: `🖥 CPU • \`${
    //       client.manager.nodes
    //         .values()
    //         .next()
    //         .value.stats.cpu.lavalinkLoad.toFixed(2) * 100
    // }%\`\n:file_cabinet: Memory • \`${lavaram}MB / ${lavamemalocated}MB\`\n\n🕒 Uptime • \`${lavauptime}\`\n🎵 Players • \`${
    //   client.manager.nodes.values().next().value.stats.playingPlayers
    // } / ${
    //   client.manager.nodes.values().next().value.stats.players
    // } playing\``,
    //     inline: true,
    //   },
    // ])
    return interaction.reply({ embeds: [embed] });
  });

module.exports = command;
