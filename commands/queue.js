const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const sendTime = require("../util/timestamp");
const util = require("../util/pagination");

module.exports = {
    info: {
      name: "queue",
      description: "See what songs are in the queue",
      usage: "",
      aliases: ["q", "list", "songlist", "song-list"],
    },
    run: async function (client, message, args) {
        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) return sendError("Missing permission to manage messages or add reactions", message.channel);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return sendTime("There is nothing playing in this server.", message.channel);

        const que = queue.songs.map((t, i) => `\`${++i}.\` | [\`${t.title}\`](${t.url}) - <@${t.req.id}>`);

        const chunked = util.chunk(que, 10).map((x) => x.join("\n"));

        const embed = new MessageEmbed()
            //.setAuthor("Queue") //https://c.tenor.com/HJvqN2i4Zs4AAAAj/milk-and-mocha-cute.gif //https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif
            .setTitle("Queue", message.author.iconURL())
            .setThumbnail(message.guild.iconURL())
            .setColor('RANDOM')
            .setDescription(chunked[0])
            .addField("Now Playing", `[${queue.songs[0].title}](${queue.songs[0].url}) - \`${queue.songs[0].duration}\``, true)
            //.addField("Text Channel", queue.textChannel, true)
            .addField("Voice Channel", queue.voiceChannel, true)
            .setFooter(`Page 1/${chunked.length} • Loop: ${queue.loop ? "✅" : "❌"}`)
        if(queue.songs.length > 10)embed.addField("Total songs",`\`\`${queue.songs.length}\`\``)
        if(queue.songs.length === 1)embed.setDescription(`Add songs to the queue with \`\`${message.client.config.prefix}play\`\` or \`\`${message.client.config.prefix}search\`\`!`)

        try {
            const queueMsg = await message.channel.send(embed);
            if (chunked.length > 1) await util.pagination(queueMsg, message.author, chunked);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    },
};
