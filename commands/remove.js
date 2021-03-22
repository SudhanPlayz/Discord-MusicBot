const { MessageEmbed } = require("discord.js");
const sendError = require("../util/error");
const sendTime = require("../util/timestamp");

module.exports = {
  info: {
    name: "remove",
    description: "Remove a song from the queue",
    usage: "[number]",
    aliases: ["rm"],
  },

  run: async function (client, message, args) {
   const queue = message.client.queue.get(message.guild.id);
    if (!queue) return sendTime("There is no queue.",message.channel).catch(console.error);
    if (!args.length) return sendTime(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (isNaN(args[0])) return sendTime(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
    if (queue.songs.length == 1) return sendTime("There is no queue.",message.channel).catch(console.error);
    if (args[0] > queue.songs.length)
      return sendTime(`The queue is only ${queue.songs.length} songs long!`,message.channel).catch(console.error);
try{
    const song = queue.songs.splice(args[0] - 1, 1); 
    sendTime(`❌ **|** Removed: **\`${song[0].title}\`** from the queue.`,queue.textChannel).catch(console.error);
                   message.react("✅")
} catch (error) {
        return sendError(`:notes: An unexpected error occurred.\nPossible type: ${error}`, message.channel);
      }
  },
};
