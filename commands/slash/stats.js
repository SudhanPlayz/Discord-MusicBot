const SlashCommand = require("../../lib/SlashCommand");
const erelastats = require("erela.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os');
const prettyMs = require("pretty-ms");


const duration = moment
.duration(process.uptime())
.format(" D[d], H[h], m[m]");


const uptime = moment.duration(os.uptime() * 1000).format(" D [days], H [hrs], m [mins], s [secs]");

const command = new SlashCommand()
  .setName("stats")
  .setDescription("Get stats for lavalink")
  .setRun(async (client, interaction, options) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;
    // create new embed
    const embed = new MessageEmbed()
        .setTitle(`Stats from` + ` \`${client.user.username}\``)
        .setFields([
            { name: ":ping_pong: Ping", value: `┕\`${client.ws.ping}ms\``, inline: true },
            { name: ":clock2: Uptime", value: `┕\`${uptime}\``, inline: true },
            { name: ":file_cabinet: Memory", value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\``, inline: true },
            { name: ":homes: Servers", value: `┕\`${client.guilds.cache.size}\``, inline: true },
            { name: ":green_book: Node", value: `┕\`${process.version}\``, inline: true },
            { name: ":blue_book: Discord.Js", value: `┕\`v${require("discord.js").version}\``, inline: true }
        ])
        // display node stats
        // TODO: add erela stats and fix total players
        // display cpu usage in persentage
        // display uptime of lavalink
        .setDescription(`\`\`\`fix
Players :: ${client.manager.nodes.values().next().value.stats.playingPlayers} of ${client.manager.nodes.values().next().value.stats.players} Players Playing
CPU Usage :: ${client.manager.nodes.values().next().value.stats.cpu.lavalinkLoad.toFixed(2) * 100}%
\`\`\`
`)
    // Credits to https://dorndev.net/
    // Send the embed using interaction reply
    // TODO: @SudhanPlaz Fix this ok? just make color works thx!
    return interaction.reply({ embeds: [embed] });
    })

module.exports = command;