exports.run = (client, message, args) => {
  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send(
      "I'm sorry but you need to be in a voice channel to play music!"
    );
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!serverQueue) return message.channel.send("There is nothing playing.");
  if (!args[0])
    return message.channel.send(
      `The current volume is: **${serverQueue.volume}**`
    );
  serverQueue.volume = args[0]; 
  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
  return message.channel.send(`I set the volume to: **${args[0]}**`);
};
