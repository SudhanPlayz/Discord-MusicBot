const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

const command = new SlashCommand()
  .setName("seek")
  .setDescription("Seek to a specific time in the current song.")
  .addStringOption((option) =>
    option
      .setName("time")
      .setDescription("Seek to time you want. Ex 2m | 10s | 53s")
      .setRequired(true)
  )

  .setRun(async (client, interaction, options) => {
    const args = interaction.options.getString("time");

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
    await interaction.deferReply();

    const time = ms(args);
    const position = player.position;
    const duration = player.queue.current.duration;

    if (time <= duration) {
      if (time > position) {
        player.seek(time);
        let thing = new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            `⏩ | **${player.queue.current.title}** has been seeked to **${ms(
              time
            )}**`
          );
        return interaction.editReply({ embeds: [thing] });
      } else {
        player.seek(time);
        let thing = new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            `⏩ | **${player.queue.current.title}** has been seeked to **${ms(
              time
            )}**`
          );
        return interaction.editReply({ embeds: [thing] });
      }
    } else {
      let thing = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          `Cannot seek current playing track. This may happened because seek duration has exceeded track duration`
        );
      return interaction.editReply({ embeds: [thing] });
    }
  });

module.exports = command;
