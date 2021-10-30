/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").ButtonInteraction} interaction
 */
module.exports = async (client, interaction) => {
  let guild = client.guilds.cache.get(interaction.customId.split(":")[1]);
  let property = interaction.customId.split(":")[2];
  let player = client.manager.get(guild.id);

  if (!player)
    return interaction.reply({
      embeds: [client.Embed("There is no player to control in this server.")],
    });

  if (property === "LowVolume") {
    player.setVolume(player.volume - 10);
    return interaction.reply({
      embeds: [
        client.Embed("Successfully set server volume to " + player.volume),
      ],
    });
  }

  if (property === "Replay") {
    if (!player.queue.previous)
      return interaction.reply({
        embeds: [client.ErrorEmbed("There is no previous played song")],
      });
    player.queue.unshift(player.queue.previous);
    player.queue.unshift(player.queue.current);
    player.stop();
    return interaction.deferUpdate();
  }

  if (property === "PlayAndPause") {
    if (player.paused) player.pause(false);
    else player.pause(true);
    return interaction.reply({
      embeds: [client.Embed(player.paused ? "Paused" : "Resumed")],
    });
  }

  if (property === "Next") {
    player.stop();
    return interaction.deferUpdate();
  }

  if (property === "HighVolume") {
    player.setVolume(player.volume + 10);
    return interaction.reply({
      embeds: [
        client.Embed("Successfully set server volume to " + player.volume),
      ],
    });
  }

  return interaction.reply({
    ephemeral: true,
    content: "Unknown controller option",
  });
};
