const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const sendTime = require("../util/timestamp");

module.exports = {
  info: {
    name: "skipto",
    description: "Skip to a specific song in the queue",
    usage: "[number]",
    aliases: ["st"],
  },

  run: async function (client, message, args) {
    if (!args.length || isNaN(args[0]))
      return message.channel.send({
                        embed: {
                            color: "GREEN",
                            description: `**Usage**: \`${client.config.prefix}skipto <number>\``
                        }
   
                   }).catch(console.error);
        

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendTime("There is no queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendTime(`The queue is only ${queue.songs.length} songs long!`,message.channel).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
    queue.connection.dispatcher.end();
      }catch (error) {
        queue.voiceChannel.leave()
        message.client.queue.delete(message.guild.id);
       return sendTime(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel);
      }
    
    queue.textChannel.send({
                        embed: {
                            color: "GREEN",
                            description: `${message.author} ⏭ skipped \`${args[0] - 1}\` songs`
                        }
   
                   }).catch(console.error);
                   message.react("✅")

  },
};
