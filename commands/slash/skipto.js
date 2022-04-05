const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("skipto")
  .setDescription("skip to a specific song in the queue")
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("The number of tracks to skipto")
      .setRequired(true)
  )

  .setRun(async (client, interaction, options) => {
    const args = interaction.options.getNumber("number");
    //const duration = player.queue.current.duration

    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | There is no music playing in this guild!");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | You must be in a voice channel to use this command!"
        );
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
        .setDescription(
          "❌ | You must be in the same voice channel as the bot to use this command!"
        );
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    const position = Number(args);

    try {
      if (!position || position < 0 || position > player.queue.size) {
        let thing = new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription("❌ | Invalid position!");
        return interaction.editReply({ embeds: [thing] });
      }

      player.queue.remove(0, position - 1);
      player.stop();

      let thing = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("✅ | Skipped to position " + position);

      return interaction.editReply({ embeds: [thing] });
    } catch {
      if (position === 1) {
        player.stop();
      }
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription("✅ | Skipped to position " + position),
        ],
      });
    }
  });

module.exports = command;
