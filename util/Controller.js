/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").ButtonInteraction} interaction
 */
module.exports = async (client, interaction) => {
  let guild = client.guilds.cache.get(interaction.customId.split(":")[1]);
  let property = interaction.customId.split(":")[2];
  let player = client.manager.get(guild.id);

  if (!player) {
    interaction.reply({
      embeds: [client.Embed("There is no player to control in this server.")],
    });
    setTimeout(() => {
      interaction.deleteReply();
    }, 5000);
    return;
  }
  if (property === "LowVolume") {
    player.setVolume(player.volume - 10);
    interaction.reply({
      embeds: [
        client.Embed("Successfully set server volume to " + player.volume),
      ],
    });
    setTimeout(() => {
      interaction.deleteReply();
    }, 5000);
    return;
  }
  
  // !BUG no previous queue
  if (property === "Replay") {
    player.stop();
  }

  if (property === "PlayAndPause") {
    if (player.paused) player.pause(false);
    else player.pause(true);
    interaction.reply({
      embeds: [client.Embed(player.paused ? "Paused" : "Resumed")],
    });
    setTimeout(() => {
      interaction.deleteReply();
    }, 5000);
    return;
  }

  if (property === "Next") {
    player.stop();
    return interaction.deferUpdate();
  }

  if (property === "HighVolume") {
    // increase volume by 10% else if volume at 200% do nothing
    if (player.volume < 100) {
      player.setVolume(player.volume + 5);
      interaction.reply({
        embeds: [
          client.Embed("Successfully set server volume to " + player.volume),
        ],
      });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    } else {
      interaction.reply({
        embeds: [client.Embed("Volume is at max")],
      });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }
    return;
  }


  return interaction.reply({
    ephemeral: true,
    content: "Unknown controller option",
  });
};
