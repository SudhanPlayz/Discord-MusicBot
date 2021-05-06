const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

  module.exports = {
    name: "remove",
    description: `Remove a song from the queue`,
    usage: "[number]",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["rm"],

    /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.players.get(message.guild.id);
    const song = player.queue.slice(args[0] - 1, 1); 
    if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to use this command!**");
    //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
        
    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("There is nothing in the queue to remove");
    let rm = new MessageEmbed()
      .setDescription(`✅ **|** Removed track **\`${Number(args[0])}\`** from the queue!`)
      .setColor("GREEN")
      if (isNaN(args[0]))rm.setDescription(`**Usage - **${client.config.prefix}\`remove [number]\``);
      if (args[0] > player.queue.length)
      rm.setDescription(`The queue has only ${player.queue.length} songs!`);
    await message.channel.send(rm);
    player.queue.remove(Number(args[0]) - 1);
  },

  SlashCommand: {
    options: [
      {
          name: "remove",
          value: "[number]",
          type: 4,
          required: true,
          description: "Remove a song from the queue",
      },
  ],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      const song = player.queue.slice(args[0] - 1, 1);
      if (!player) return client.sendTime("❌ | **Nothing is playing right now...**");
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **You must be in a voice channel to use this command.**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
  
      if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime("❌ | **Nothing is playing right now...**");
    let rm = new MessageEmbed()
      .setDescription(`✅ **|** Removed track **\`${Number(args[0])}\`** from the queue!`)
      .setColor("GREEN")
      if (isNaN(args[0]))rm.setDescription(`Usage: ${client.config.prefix}\`remove [number]\``);
      if (args[0] > player.queue.length)
      rm.setDescription(`The queue has only ${player.queue.length}!`);
    await interaction.send(rm);
      player.queue.remove(Number(args[0]) - 1);
    },
  }
};