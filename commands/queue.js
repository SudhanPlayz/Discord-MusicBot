const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const util = require("../util/pagination");

module.exports = {
    info: {
        name: "queue",
        description: "To show the server songs queue",
        usage: "",
        aliases: ["q", "list", "songlist", "song-list"],
    },
    run: async function (client, message, args) {
        const permissions = message.channel.permissionsFor(message.client.user);
        if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"])) return sendError("Missing permission to manage messages or add reactions", message.channel);

        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return sendError("There is nothing playing in this server.", message.channel);

        const que = queue.songs.map((t, i) => `\`${++i}.\` | [\`${t.title}\`](${t.url}) - [<@${t.req.id}>]`);

        const chunked = util.chunk(que, 10).map((x) => x.join("\n"));

        const embed = new MessageEmbed()
            .setAuthor("Server Songs Queue", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
            .setThumbnail(message.guild.iconURL())
            .setColor("BLUE")
            .setDescription(chunked[0])
            .addField("Now Playing", `[${queue.songs[0].title}](${queue.songs[0].url})`, true)
            .addField("Text Channel", queue.textChannel, true)
            .addField("Voice Channel", queue.voiceChannel, true)
            .setFooter(`Currently Server Volume is ${queue.volume} Page 1 of ${chunked.length}.`);
        if (queue.songs.length === 1) embed.setDescription(`No songs to play next add songs by \`\`${message.client.config.prefix}play <song_name>\`\``);

        try {
            const queueMsg = await message.channel.send(embed);
            if (chunked.length > 1) await util.pagination(queueMsg, message.author, chunked);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    },
};
