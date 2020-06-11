const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const ytSearch = require("../utils/ytSearch");

exports.run = async (client, message, args) => {
  const { channel } = message.member.voice;
  if (!channel)
    return message.channel.send(
      "I'm sorry but you need to be in a voice channel to play music!"
    );
  const permissions = channel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT"))
    return message.channel.send(
      "I cannot connect to your voice channel, make sure I have the proper permissions!"
    );
  if (!permissions.has("SPEAK"))
    return message.channel.send(
      "I cannot speak in this voice channel, make sure I have the proper permissions!"
    );
  const searchString = args.join(" ");
  if (!searchString)
    return message.channel.send("You didn't provide anything to play");
  const serverQueue = message.client.queue.get(message.guild.id);

  const videos = await ytSearch(searchString, 1);
  if (!videos || !videos.length) {
    return message.channel.send("No videos found with that keyword!");
  }

  // old method, doesn't work most of the time
  // const song = {
  //   id: firstVideo.videoId,
  //   url: firstVideo.url,
  //   title: Util.escapeMarkdown(firstVideo.title),
  //   author: firstVideo.author,
  //   duration: firstVideo.duration,
  //   durationSeconds: firstVideo.durationSeconds,
  //   ago: firstVideo.ago,
  //   views: firstVideo.views,
  // };

  const firstVideo = videos[0].full ? videos[0] : videos[0].fetch();

  const song = {
    id: firstVideo.id,
    url: `https://youtube.com/watch?v=${firstVideo.id}`,
    title: Util.escapeMarkdown(firstVideo.title),
    author: firstVideo.channel.title,
    duration: firstVideo.duration,
    durationSeconds: firstVideo.durationSeconds,
  };

  if (serverQueue) {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(
      `✅ **${song.title}** has been added to the queue!`
    );
  }

  const queueConstruct = {
    textChannel: message.channel,
    voiceChannel: channel,
    connection: null,
    songs: [],
    volume: 2,
    playing: true,
  };
  message.client.queue.set(message.guild.id, queueConstruct);
  queueConstruct.songs.push(song);

  const play = async (song) => {
    const queue = message.client.queue.get(message.guild.id);
    if (!song) {
      queue.voiceChannel.leave();
      message.client.queue.delete(message.guild.id);
      return;
    }

    const dispatcher = queue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        queue.songs.shift();
        play(queue.songs[0]);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.volume / 5);
    queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
  };

  try {
    const connection = await channel.join();
    queueConstruct.connection = connection;
    play(queueConstruct.songs[0]);
  } catch (error) {
    console.error(`I could not join the voice channel: ${error}`);
    message.client.queue.delete(message.guild.id);
    await channel.leave();
    return message.channel.send(`I could not join the voice channel: ${error}`);
  }
};
