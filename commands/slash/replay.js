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
          ":x: **You have to a join voice channel before you can use this command**"
        );
      return interaction.reply({ embeds: [JoinEmbed], ephemeral: true });
    }
@@ -31,7 +31,7 @@ const command = new SlashCommand()
      const SameEmbed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          "You must be in the same voice channel as me first before you can use this command"
          ":x: **You must be in the same voice channel as me to use this command**"
        );
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
    }
@@ -44,8 +44,9 @@ const command = new SlashCommand()
    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle(`Replaying: [${song.title}](${song.uri})`)
          .setColor(client.config.embedColor)
          .setDescription(`**Replay Requested By ${interaction.user.username}**`),
      ],
    });
  });

module.exports = command;
