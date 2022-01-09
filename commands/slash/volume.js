const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("volume")
  .setDescription("Change the volume of the current song.")
  .addNumberOption((option) =>
    option
      .setName("amount")
      .setDescription("Amount of volume you want to change. Ex: 10")
      .setRequired(false)
  )
  .setRun(async (client, interaction) => {
    const category = interaction.options.getNumber("options");

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

    let vol = interaction.options.getNumber("amount");
    if (!vol || vol < 1 || vol > 125) {
      const NumberEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(`:loud_sound: | **Current volume ${player.volume}**`);
      return interaction.reply({ embeds: [NumberEmbed] });
    }

    player.setVolume(vol);
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            `:loud_sound: | Successfully set volume to **${player.volume}**`
          ),
      ],
    });
  });

module.exports = command;
