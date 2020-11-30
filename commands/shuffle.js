const { MessageEmbed } = require('discord.js');
const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
    info: {
      name: "shuffle",
      description: "shuffle queue",
      usage: "",
      aliases: ["sf"],
    },
   
    run: async function (client, message, args)
    {
      const queue = message.client.queue.get(message.guild.id);
      if (!queue) return message.channel.send("There is no queue.").catch(console.error);
      if (!canModifyQueue(message.member)) return;
  
      let songs = queue.songs;
      for (let i = songs.length - 1; i > 1; i--) {
        let j = 1 + Math.floor(Math.random() * i);
        [songs[i], songs[j]] = [songs[j], songs[i]];
      }
      queue.songs = songs;
      message.client.queue.set(message.guild.id, queue);
      queue.textChannel.send(`${message.author} 🔀 shuffled the queue`).catch(console.error);
      message.react("✅")
    }
  };