const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
  .setName("loop")
  .setDescription("Loop the current song")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("There is no music playing")],
      });
    }
    if (!interaction.member.voice.channel) {
      const JoinEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription("You need to join voice channel first before you can use this command")
      return interaction.reply({ embeds: [JoinEmbed], ephemeral: true })
    }

    if (interaction.guild.me.voice.channel && !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)) {
      const SameEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription("You must be in the same voice channel as me.")
      return interaction.reply({ embeds: [SameEmbed], ephemeral: true })
    }
    if (player.setTrackRepeat(!player.trackRepeat));
    const trackRepeat = player.trackRepeat ? "enabled" : "disabled";

    let loopembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`Loop track is now \`${trackRepeat}\``);
    interaction.reply({ embeds: [loopembed] });
  });

module.exports = command;
