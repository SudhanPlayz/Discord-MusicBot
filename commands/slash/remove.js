const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("remove")
  .setDescription("Remove track you don't want from queue")
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("Enter track number.")
      .setRequired(true)
  )

  .setRun(async (client, interaction) => {
    const args = interaction.options.getNumber("number");

    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const queueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("There's nothing playing in the queue");
      return interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const joinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "You have to join voice channel first before you can use this command"
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
          "You must be in the same voice channel as me first before you can use this command"
        );
      return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
    }

    await interaction.deferReply();

    const position = Number(args) - 1;
    if (position > player.queue.size) {
      let thing = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          `Current queue has only **${player.queue.size}** track`
        );
      return interaction.editReply({ embeds: [thing] });
    }

    const song = player.queue[position];
    player.queue.remove(position);

    const number = position + 1;
    let thing = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`Removed track number **${number}** from queue`);
    return interaction.editReply({ embeds: [thing] });
  });

module.exports = command;
