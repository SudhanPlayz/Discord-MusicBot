const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const sendTime = require("../util/timestamp");

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
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      //.setDescription("▶ Resumed the music for you!")
      .setColor("GREEN")
      .setAuthor("Resumed!", "http://www.simpleimageresizer.com/_uploads/photos/92c36e50/0a8671a21422eecab8189a2941bfb132_1_1_128x128.gif")//https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif
      return message.channel.send(xd);
    }
    return sendTime("There is nothing playing in this server.", message.channel);
  },
};
