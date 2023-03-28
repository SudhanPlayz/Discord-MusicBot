const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
let d;

module.exports = {
  name: "grab",
  description: "Saves the current song to your Direct Messages",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
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
    if (!player.playing)
      return client.sendTime(
        message.channel,
        "❌ | **Nothing is playing right now...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **You must be in a voice channel to play something!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        "❌ | **You must be in the same voice channel as me to use this command!**"
      );
    let GrabEmbed = new MessageEmbed()
      .setAuthor(
        `Song saved`,
        client.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setThumbnail(
        `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
      )
      .setURL(player.queue.current.uri)
      .setColor(client.botconfig.EmbedColor)
      .setTitle(`**${player.queue.current.title}**`);

    // Check if duration matches duration of livestream

    if (player.queue.current.duration == 9223372036854776000) {
      d = "Live";
    } else {
      d = prettyMilliseconds(player.queue.current.duration, {
        colonNotation: true,
      });
    }
    GrabEmbed.addField(`⌛ Duration: `, `\`${d}\``, true)
      .addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
      .addField(
        `▶ Play it:`,
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}play ${
          player.queue.current.uri
        }\``
      )
      .addField(`🔎 Saved in:`, `<#${message.channel.id}>`)
      .setFooter(
        `Requested by: ${player.queue.current.requester.tag}`,
        player.queue.current.requester.displayAvatarURL({
          dynamic: true,
        })
      );
    message.author.send(GrabEmbed).catch((e) => {
      return message.channel.send("**❌ Your DMs are disabled**");
    });

    client.sendTime(message.channel, "✅ | **Check your DMs!**");
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
      const user = client.users.cache.get(interaction.member.user.id);
      const member = guild.members.cache.get(interaction.member.user.id);
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Nothing is playing right now...**"
        );
      if (!player.playing)
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
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          "❌ | **You must be in the same voice channel as me to use this command!**"
        );
      try {
        let embed = new MessageEmbed()
          .setAuthor(`Song saved: `, client.user.displayAvatarURL())
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTimestamp()
          .setTitle(`**${player.queue.current.title}**`);
        if (player.queue.current.duration == 9223372036854776000) {
          d = "Live";
        } else {
          d = prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          });
        }
        embed
          .addField(`⌛ Duration: `, `\`${d}\``, true)
          .addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Play it:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Saved in:`, `<#${interaction.channel_id}>`)
          .setFooter(
            `Requested by: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          );
        user.send(embed);
      } catch (e) {
        return client.sendTime(interaction, "**❌ Your DMs are disabled**");
      }

      client.sendTime(interaction, "✅ | **Check your DMs!**");
    },
  },
};
