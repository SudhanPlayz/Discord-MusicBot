const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("skip")
  .setDescription("Skip the current song")
  .setRun(async (client, interaction, options) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;
    let player = client.manager.players.get(interaction.guild.id);
    if (!player)
      return interaction.reply({
        embeds: [
          client.ErrorEmbed(
            "Bot must need to be in a voice channel to disconnect"
          ),
        ],
      });

    player.stop();
    interaction.reply({ embeds: [client.Embed("skiped yay")] });
  });

module.exports = command;
