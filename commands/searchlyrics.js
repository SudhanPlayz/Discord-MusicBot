const { MessageEmbed} = require('discord.js')
const lyricsFinder = require("lyrics-finder");

module.exports = {
    info: {
        name: "searchlyrics",
        description: "Get lyrics for the song you put",
        usage: "[searchlyrics]",
        aliases: ["sly"],
    },

    run: async function (client, message, args) {

    if (!args[0]) {
      let embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(':x: Song title not provided!')
      return message.channel.send(embed)
    }
    let lyrics = await lyricsFinder(args.join(' ')) || "Not Found!";
for(let i = 0; i < lyrics.length; i += 2000) {
    const toSend = lyrics.substring(i, Math.min(lyrics.length, i + 2000));
          let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Lyrics`)
            .setDescription(toSend)
          message.channel.send(embed)
};
    }};
