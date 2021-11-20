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
    if (player.setTrackRepeat(!player.trackRepeat));
    const trackRepeat = player.trackRepeat ? "enabled" : "disabled";

    let loopembed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(`Loop track is now \`${trackRepeat}\``);
    interaction.reply({ embeds: [loopembed] });
  });

module.exports = command;
