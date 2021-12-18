const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("resume")
  .setDescription("Resume current playing track")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const QueueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | Nothing is playing right now...");
      return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **You must be in the same voice channel as me to use this command!**"
        );
      return interaction.reply({ embeds: [JoinEmbed], ephemeral: true });
    }

    if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    ) {
      const SameEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **You must be in the same voice channel as me to use this command!**"
        );
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
    }

    if (!player.paused) {
      let ResumedEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Current track is already resumed**");
      return interaction.reply({ embeds: [ResumedEmbed], ephemeral: true });
    }
    player.pause(false);
    let ResEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`⏯ **Resumed!**`);
    return interaction.reply({ embeds: [ResEmbed] });
  });

module.exports = command;
