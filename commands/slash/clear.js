const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("clear")
  .setDescription("Clear all tracks from queue")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(client.config.QueueEmbed3);
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(client.config.JoinEmbed);
      return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
    }

    if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    ) {
      const sameEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(client.config.sameEmbed);
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }

    if (!player.queue || !player.queue.length || player.queue.length === 0) {
      let cembed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **Invalid arguments, the queue does not any tracks to clear.**");

      return interaction.reply({ embeds: [cembed], ephemeral: true });
    }

    player.queue.clear();

    let clearembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`✅ | **Cleared the queue!**`);

    return interaction.reply({ embeds: [clearembed] });
  });

module.exports = command;
