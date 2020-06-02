module.exports = {
  name: "stop",
  description: "Stop command.",
  cooldown: 5,
  execute(message) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send(
        "I'm sorry but you need to be in a voice channel to play music!"
      );
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)
      return message.channel.send(
        "There is nothing playing that I could stop for you."
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end("Stop command has been used!");
  },
};
