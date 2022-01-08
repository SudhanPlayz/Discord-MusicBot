const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("move")
  .setDescription("Moves track to a different position")
  .addIntegerOption((option) =>
    option
      .setName("track")
      .setDescription("The track number to move")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("position")
      .setDescription("The position to move the track to")
      .setRequired(true)
  )

  .setRun(async (client, interaction) => {
    const track = interaction.options.getInteger("track");
    const position = interaction.options.getInteger("position");

    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      const QueueEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(":x: | **There's nothing playing**");
      return interaction.reply({ embeds: [QueueEmbed], ephemeral: true });
    }

    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("You must be in a voice channel to use this command!");
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
          "You must be in the same voice channel as me to use this command!"
        );
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
    }

    let trackNum = Number(track) - 1;
    if (trackNum < 1 || trackNum > player.queue.length - 1) {
      return interaction.reply(":x: | **Invalid track number**");
    }

    let dest = Number(position) - 1;
    if (dest < 1 || dest > player.queue.length - 1) {
      return interaction.reply(":x: | **Invalid position number**");
    }

    const thing = player.queue[trackNum];
    player.queue.splice(trackNum, 1);
    player.queue.splice(dest, 0, thing);
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(":white_check_mark: | **Moved track**"),
      ],
    });
  });

module.exports = command;
