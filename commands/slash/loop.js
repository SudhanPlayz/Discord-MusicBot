const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("loop")
  .setDescription("Loop the current song")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("There's nothing to be looped!")],
      });
    }
    if (!player.setTrackRepeat(false)) player.setTrackRepeat(true);
    else if (!player.setTrackRepeat(true)) player.setTrackRepeat(false);

    interaction.reply({
      embeds: [client.Embed(`Loop has been set to ${player.setTrackRepeat}`)],
    });
  });

module.exports = command;