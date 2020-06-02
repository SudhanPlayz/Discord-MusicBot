module.exports = {
  name: "resume",
  description: "Resume command.",
  cooldown: 5,
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return message.channel.send("▶ Resumed the music for you!");
    }
    return message.channel.send("There is nothing playing.");
  },
};
