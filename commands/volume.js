const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");

module.exports = {
  info: {
    name: "volume",
    description: "Change the volume of the song playing",
    usage: "[0-150]",
    aliases: ["v", "vol"],
  },

  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("I'm sorry but you need to be in a voice channel to play music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);
    if (!serverQueue.connection) return sendError("There is nothing playing in this server.", message.channel);
    if (!args[0])return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
     if(isNaN(args[0])) return message.channel.send(':notes: Numbers only!').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('You can\'t set the volume more than 150. or lower than 0',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 150);
    let xd = new MessageEmbed()
    .setDescription(`Volume is now: **${args[0]/1}/150**`)
    .setAuthor("Server volume", "https://c.tenor.com/HJvqN2i4Zs4AAAAj/milk-and-mocha-cute.gif")//https://raw.githubusercontent.com/SudhanPlayz/Discord-MusicBot/master/assets/Music.gif
    .setColor("BLUE")
    return message.channel.send(xd);
  },
};
