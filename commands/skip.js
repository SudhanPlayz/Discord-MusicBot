exports.run = (client, message, args) => {
  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send(
      "I'm sorry but you need to be in a voice channel to play music!"
    );
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!serverQueue)
    return message.channel.send(
      "There is nothing playing that I could skip for you."
    );
  serverQueue.connection.dispatcher.end("Skip command has been used!");
};
