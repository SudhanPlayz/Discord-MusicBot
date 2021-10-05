const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "loopqueue",
  description: "Loop the whole queue",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["lq", "repeatqueue", "rq"],
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
        "❌ | **Nothing is playing right now...**"
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
        ":x: | **You must be in the same voice channel as me to use this command!**"
      );

    if (player.queueRepeat) {
      player.setQueueRepeat(false);
      client.sendTime(message.channel, `:repeat: Queue Loop \`disabled\``);
    } else {
      player.setQueueRepeat(true);
      client.sendTime(message.channel, `:repeat: Queue Loop \`enabled\``);
    }
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
      let player = await client.Manager.get(interaction.guild_id);
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Nothing is playing right now...**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **You must be in a voice channel to use this command.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(voiceChannel)
      )
        return client.sendTime(
          interaction,
          ":x: | **You must be in the same voice channel as me to use this command!**"
        );

      if (player.queueRepeat) {
        player.setQueueRepeat(false);
        client.sendTime(interaction, `:repeat: **Queue Loop** \`disabled\``);
      } else {
        player.setQueueRepeat(true);
        client.sendTime(interaction, `:repeat: **Queue Loop** \`enabled\``);
      }
      console.log(interaction.data);
    },
  },
};
