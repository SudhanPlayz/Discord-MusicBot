const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "lyrics",
    description: "Get the lyrics of the current song",
    usage: "",
    aliases: ["ly"],
  },

  run: async function (client, message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendError("There is nothing playing.",message.channel).catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = "Sorry, I didn't find any lyrics for "+`[${queue.songs[0].title}](${queue.songs[0].url})`+".";
    } catch (error) {
      lyrics = "No lyrics found for "+`[${queue.songs[0].title}](${queue.songs[0].url})`+".";
    }

    let lyricsEmbed = new MessageEmbed()
      .setAuthor("Lyrics for - ", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      .setTitle(queue.songs[0].title)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].img)
      .setColor('RANDOM')
      .setDescription(lyrics)
      .setTimestamp();
    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  },
};
