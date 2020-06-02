exports.run = (client, message, args) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (serverQueue && serverQueue.playing) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    return message.channel.send("⏸ Paused the music for you!");
  }
  return message.channel.send("There is nothing playing.");
};
