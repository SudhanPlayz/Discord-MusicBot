const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("nowplaying")
  .setDescription("Shows the current song playing in the voice channel.")
  .setRun(async (client, interaction, options) => {
    const player = interaction.client.manager.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({
        embeds: [client.ErrorEmbed("**There's nothing playing**")],
      });
      // check current playing song
    } else {
      const song = player.queue.current;
      const embed = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle(
          `Current Song: ${song.title}`,
          "https://cdn.darrennathanael.com/icons/spinning_disk.gif"
        )
        .setURL(song.uri)
        .setDescription(`**Requested by:** ${song.requester}`)
        .setThumbnail(song.displayThumbnail("maxresdefault"));
      return interaction.reply({ embeds: [embed] });
    }
  });

module.exports = command;
