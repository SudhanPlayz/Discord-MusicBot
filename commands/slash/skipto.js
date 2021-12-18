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
      const QueueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("❌ | There is no music playing in this guild!");
      return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "❌ | You must be in a voice channel to use this command!"
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
          "❌ | You must be in the same voice channel as the bot to use this command!"
        );
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    const position = Number(args);

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
  });

module.exports = command;
