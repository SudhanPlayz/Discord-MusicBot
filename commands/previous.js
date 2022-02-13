const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "previous",
  description: "Go back to the previous song",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Redio isn't playing anything now.**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **You must be in a voice channel to use this command!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Redio is in use. Join the same voice channel to use this command!**"
      );
    
    if (!player.queue.previous)
      return client.sendTime(
        message.channel,
        "❌ | **There is no previous song in the queue.**"
        );

    const currentSong = player.queue.previous;
    player.play(player.queue.previous);
    return client.sendTime(
        message.channel,
            `⏮ | Previous song: **${currentSong.title}** by **${currentSong.requester.username}**`
        );
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | You must be in a voice channel to use this command."
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Redio is in use. Join the same voice channel to use this command!**"
        );
      let player = await client.Manager.get(interaction.guild_id);

      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Redio isn't playing anything now.**"
        );

    if (!player.queue.previous)
          return client.sendTime(
          interaction,
          "❌ | **There is no previous song in the queue.**"
        );

    const currentSong = player.queue.previous;
    player.play(player.queue.previous);
          return client.sendTime(
          interaction,
            `⏮ | Previous song: **${currentSong.title}** by **${currentSong.requester.username}**`
          );
    },
  },
};
