const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");

module.exports = {
  name: "skipto",
  description: `Skip to a song in the queue`,
  usage: "<number>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
   run: async (client, message, args, { GuildDB }) => {

    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });
    
    if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **You must be in a voice channel to use this command!**");
    //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
     
    try {
      if (!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor("GREEN")
          .setDescription(`**Usage**: \`${GuildDB.prefix}skipto [number]\``)
        );
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size)
        return message.channel.send(new MessageEmbed()
          .setColor("GREEN")
          .setDescription(`❌ | That song is not in the queue! Please try again!`)
        );
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop()
      //Send Success Message
      return message.channel.send(new MessageEmbed()
        .setDescription(`⏭ Skipped \`${Number(args[0] - 1)}\` songs`)
        .setColor("GREEN")
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      client.sendError(
        message.channel,
        "Something went wrong."
      );
    }
  },
  SlashCommand: {
    options: [
      {
          name: "number",
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

    const player = client.Manager.create({
      guild: interaction.guild_id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: false,
    });

    try {
      if (!args[0])
        return interaction.send(new MessageEmbed()
          .setColor("GREEN")
          .setDescription(`**Usage**: \`${GuildDB.prefix}skipto <number>\``)
        );
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size)
        return interaction.send(new MessageEmbed()
          .setColor("GREEN")
          .setTitle(`❌ | That song is not in the queue! Please try again!`)
        );
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop()
      //Send Success Message
      return interaction.send(new MessageEmbed()
        .setDescription(`⏭ Skipped \`${Number(args[0])}\` songs`)
        .setColor("GREEN")
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      client.sendError(
        interaction,
        "Something went wrong."
      );
    }
  },
  }
};
