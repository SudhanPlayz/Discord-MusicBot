const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("disconnect")
  .setDescription("Stops the music and leaves the voice channel")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if (!player)
      return interaction.reply({
        embeds: [
          client.ErrorEmbed(
            "Theres nothing to disconnect!"
          ),
        ],
      });

    player.destroy();

    interaction.reply({
      embeds: [client.Embed(`Successfully left <#${channel.id}>!`)],
    });
  });

module.exports = command;
