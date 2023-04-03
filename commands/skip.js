const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const { voteskip } = require("./togglevote");

module.exports = {
  name: "skip",
  description: "Skip the current song",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["s", "next"],
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
        "❌ | **You must be in the same voice channel as me to use this command!**"
      );
    player.stop();
    await message.react("✅");
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
          "❌ | **You must be in a voice channel to use this command.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          "❌ | **You must be in the same voice channel as me to use this command!**"
        );

      const skipTo = interaction.data.options
        ? interaction.data.options[0].value
        : null;

      let player = await client.Manager.get(interaction.guild_id);

      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Nothing is playing right now...**"
        );
      console.log(interaction.data);
      if (
        skipTo !== null &&
        (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)
      )
        return client.sendTime(interaction, "❌ | **Invalid number to skip!**");
      if (!voteskip) {
        player.stop();
        return client.sendTime(interaction, "✅ | **Skipped!**");
      } else {
        if (message.member.voice.channel.members.size >= 3) {
          if (!player.get("vote")) player.set("vote", 0);
          if (!player.get("voters")) player.set("voters", []);
          if (player.get("voters").includes(message.member.id))
            return client.sendTime(
              message.channel,
              "❌ | **You have already voted!**"
            );
          player.set("vote", player.get("vote") + 1);
          player.set("voters", [...player.get("voters"), message.member.id]);
          if (
            player.get("vote") >=
            Math.ceil(message.member.voice.channel.members.size / 2)
          ) {
            player.stop();
            player.set("vote", 0);
            player.set("voters", []);
            return client.sendTime(message.channel, "✅ | **Skipped!**");
          } else {
            return client.sendTime(
              message.channel,
              `✅ | **Your vote has been counted!**\n**Voted:** \`${player.get(
                "vote"
              )}\`/\`${Math.ceil(
                message.member.voice.channel.members.size / 2
              )}\``
            );
          }
        }
        player.stop();
        client.sendTime(message.channel, "✅ | **Skipped!**");
      }
    },
  },
};
