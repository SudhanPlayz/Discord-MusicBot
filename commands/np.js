module.exports = {
  name: "np",
  description: "Now playing command.",
  cooldown: 5,
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("There is nothing playing.");
    return message.channel.send(
      `🎶 Now playing: **${serverQueue.songs[0].title}**`
    );
  },
};
