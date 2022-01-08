const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
  .setName("grab")
  .setDescription("Saves current song to your DM's")
  .setRun(async (client, interaction) => {
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
        .setDescription(
          ":x: | **You must be in a voice channel to use this command!**"
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
          ":x: | **You must be in the same voice channel as me to use this command!**"
        );
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
    }

    const save = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setAuthor({
        name: "Saved track",
        iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
      })
      .setDescription(
        `**Saved [${player.queue.current.title}](${player.queue.current.uri}) to your DM**`
      )
      .addFields(
        {
          name: "Track Duration",
          value: `\`${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``,
          inline: true,
        },
        {
          name: "Track Author",
          value: `\`${player.queue.current.author}\``,
          inline: true,
        },
        {
          name: "Requested Guild",
          value: `\`${interaction.guild}\``,
          inline: true,
        }
      );

    interaction.user.send({ embeds: [save] });

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            "Please check your **DM**. If you don't receive any message from me please make sure your **DM** is open"
          ),
      ],
      ephemeral: true,
    });
  });

module.exports = command;
