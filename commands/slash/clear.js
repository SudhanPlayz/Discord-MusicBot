const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require('discord.js');

const command = new SlashCommand()
  .setName("clear")
  .setDescription("Clear all tracks from queue")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const QueueEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription("There's nothing playing in the queue")
      return interaction.reply({ embeds: [QueueEmbed], ephemeral:true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription("You have to join voice channel first before you can use this command")
      return interaction.reply({ embeds: [JoinEmbed], ephemeral: true })
    }

    if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
      const SameEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription("You must be in the same voice channel as me first before you can use this command")
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true })
    }

    if (!player.queue || !player.queue.length || player.queue.length === 0) {
        let cembed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("There's not enough track to remove")

        return interaction.reply({ embeds: [cembed], ephemeral: true })
    }

    player.queue.clear();

    let clearembed = new MessageEmbed()
    .setColor(client.config.embedColor)
    .setDescription(`Clear all tracks from queue`)

    return interaction.reply({ embeds: [clearembed] })

});
  

module.exports = command;