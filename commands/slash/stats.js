const SlashCommand = require("../../lib/SlashCommand");
const moment = require("moment");
require("moment-duration-format");
const os = require('os');
const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");


const duration = moment
.duration(process.uptime())
.format(" D[d], H[h], m[m]");





const command = new SlashCommand()
  .setName("stats")
  .setDescription("Get stats for lavalink")
  .setRun(async (client, interaction) => {
    // show lavalink uptime in a nice format
    const lavauptime = moment.duration(client.manager.nodes.values().next().value.stats.uptime).format(" D[d], H[h], m[m]");
    // show lavalink memory usage in a nice format
    const lavaram = (client.manager.nodes.values().next().value.stats.memory.used / 1024 / 1024).toFixed(2);
    // sow lavalink memory alocated in a nice format
    const lavamemalocated = (client.manager.nodes.values().next().value.stats.memory.allocated / 1024 / 1024).toFixed(2);

    const embed = new MessageEmbed()
        .setTitle(`Stats from` + ` \`${client.user.username}\``)
        .setFields([
            { name: ":ping_pong: Ping", value: `┕\`${client.ws.ping}ms\``, inline: true },
            { name: ":clock2: Uptime", value: `┕\`${duration}\``, inline: true },
            { name: ":file_cabinet: Memory", value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\``, inline: true },
            { name: ":homes: Servers", value: `┕\`${client.guilds.cache.size}\``, inline: true },
            { name: ":green_book: Node", value: `┕\`${process.version}\``, inline: true },
            { name: ":blue_book: Discord.Js", value: `┕\`v${require("discord.js").version}\``, inline: true }
        ])
        .setDescription(`
**Lavalink stats**

Uptime → \`${lavauptime}\`
CPU Usage → \`${client.manager.nodes.values().next().value.stats.cpu.lavalinkLoad.toFixed(2) * 100}%\`
RAM Usage → \`${lavaram}MB / ${lavamemalocated}MB\`
Players → \`${client.manager.nodes.values().next().value.stats.playingPlayers} of ${client.manager.nodes.values().next().value.stats.players} Players Playing\`

**Bot Stats**
`)
    // Send the embed using interaction reply
    // TODO: @SudhanPlaz Fix this ok? just make color works thx!
    return interaction.reply({ embeds: [embed] });
    })

module.exports = command;