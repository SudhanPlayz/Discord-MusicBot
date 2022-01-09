const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("shuffle")
  .setDescription("Shuffle the current queue.")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const QueueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **There's nothing playing in the queue**");
      return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | **You must be in a voice channel to use this command.**"
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

    if (!player.queue || !player.queue.length || player.queue.length === 0) {
      const AddEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | **There are no songs in the queue.**");
      return interaction.reply({ embeds: [AddEmbed], ephemeral: true });
    }

    //  if the queue is not empty, shuffle the entire queue
    player.queue.shuffle();
    const ShuffleEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription("🔀 | **Successfully shuffled the queue.**");
    return interaction.reply({ embeds: [ShuffleEmbed] });
  });

module.exports = command;
