const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("disconnect")
  .setDescription("Stop the music and leave the voice channel")
  .setRun(async (client, interaction, options) => {
    let player = client.manager.players.get(interaction.guild.id);
    if(!player)return interaction.reply({ embeds: [ client.ErrorEmbed("Bot must need to be in a voice channel to disconnect") ]})

    player.destroy()

    interaction.reply({
      embeds: [
        client.Embed().setDescription(`Successfully left <#${player.voiceChannel.id}>!`),
      ],
    });
  });

module.exports = command;
