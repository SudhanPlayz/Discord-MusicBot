const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("replay")
  .setDescription("Replay current playing track")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const QueueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("There's nothing playing in the queue");
      return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "You have to join voice channel first before you can use this command"
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
          "You must be in the same voice channel as me first before you can use this command"
        );
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    player.seek(0);

    let song = player.queue.current;
    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(`Replay [${song.title}](${song.uri})`),
      ],
    });
  });

module.exports = command;
