const { Util, MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const fs = require('fs');

module.exports = {
  info: {
    name: "resume",
    description: "Resume the music",
    usage: "",
    aliases: [],
  },

  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      //.setDescription("▶ Resuming!")
      .setColor("GREEN")
      .setAuthor("Resuming!", "https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif")
      return message.channel.send(xd);
    };
    return sendError("There is nothing playing in this server.", message.channel);
  },
};