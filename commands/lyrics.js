const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");
const sendTime = require("../util/timestamp");
const splitlyrics = require("../util/pagination");

module.exports = {
    info: {
      name: "lyrics",
      description: "Get the lyrics of the current song",
      usage: "",
      aliases: ["ly"],
    },

    run: async function (client, message, args) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return sendTime("There is nothing playing.", message.channel).catch(console.error);

        let lyrics = null;

        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) lyrics = `No lyrics found for [${queue.songs[0].title}](${queue.songs[0].url}).`;
        } catch (error) {
            lyrics = `No lyrics found for [${queue.songs[0].title}](${queue.songs[0].url}).`;
        }
        const splittedLyrics = splitlyrics.chunk(lyrics, 1024);

        let lyricsEmbed = new MessageEmbed()
            .setAuthor(`${queue.songs[0].title} — Lyrics`, message.author.displayAvatarURL(), `${queue.songs[0].url}`)//https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif
            .setThumbnail(queue.songs[0].img)
            .setColor('RANDOM')
            .setDescription(splittedLyrics[0])
            .setFooter(`Page 1/${splittedLyrics.length} • Loop: ${queue.loop ? "✅" : "❌"}`)
            //.setTimestamp();

        const lyricsMsg = await message.channel.send(lyricsEmbed);
        if (splittedLyrics.length > 1) await splitlyrics.pagination(lyricsMsg, message.author, splittedLyrics);
    },
};