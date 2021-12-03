const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("pause")
  .setDescription("Pause current playing track")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const QueueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Nothing is playing right now...**");
      return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **You must be in a voice channel to use this command!**"
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

    if (player.paused) {
      let pembed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Current playing track is already paused!**");
      return interaction.reply({ embeds: [pembed], ephemeral: true });
    }

    player.pause(true);

    let pauseembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`⏸ **Paused!**`);
    return interaction.reply({ embeds: [pauseembed] });
  });

module.exports = command;
