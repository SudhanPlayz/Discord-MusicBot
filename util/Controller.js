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

  if (property === "Replay") {
    if (!player.queue.previous)
      interaction
        .reply({
          embeds: [client.ErrorEmbed("There is no previous played song")],
        })
        .then(() => {
          setTimeout(() => {
            interaction.deleteReply();
          }, 5000);
        });

    player.queue.unshift(player.queue.previous);
    player.queue.unshift(player.queue.current);
    player.stop();
    return interaction.deferUpdate();
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
    player.setVolume(player.volume + 10);
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

  return interaction.reply({
    ephemeral: true,
    content: "Unknown controller option",
  });
};
