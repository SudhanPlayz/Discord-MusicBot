const { MessageEmbed } = require("discord.js");
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
      embeds: [
        client.Embed("❌ | **There is no player to control in this server.**"),
      ],
    });
    setTimeout(() => {
      interaction.deleteReply();
    }, 5000);
    return;
  }
  if (!interaction.member.voice.channel) {
    const joinEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(
        "❌ | **You must be in a voice channel to use this command!**"
      );
    return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
  }

  if (
    interaction.guild.me.voice.channel &&
    !interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)
  ) {
    const sameEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(
        "❌ | **You must be in the same voice channel as me to use this command!**"
      );
    return interaction.reply({ embeds: [sameEmbed], ephemeral: true });
  }
  if (property === "Stop") {
    player.stop();
    player.queue.clear();
    interaction.reply({
      embeds: [
        client.Embed(
          "⏹️ | **Successfully stopped the player**"
        ),
      ],
    });
    setTimeout(() => {
      interaction.deleteReply();
    }, 5000);
    return;
  }

  // if theres no previous song, return an error.
  if (property === "Replay") {
    if (!player.queue.previous) {
      interaction.reply({
        embeds: [client.Embed("❌ | **There is no previous song to replay.**")],
      });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
      return;
    }
    const currentSong = player.queue.current;
    player.play(player.queue.previous);
    if (currentSong) player.queue.unshift(currentSong);
    return;
  }

  if (property === "PlayAndPause") {
    if (player.paused) player.pause(false);
    else player.pause(true);
    interaction.reply({
      embeds: [
        client.Embed(
          player.paused
            ? ":white_check_mark: | **Paused**"
            : ":white_check_mark: | **Resumed**"
        ),
      ],
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

  if (property === "Loop") {
    if (player.setTrackRepeat(!player.trackRepeat));
    const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
      interaction.reply({
        embeds: [
          client.Embed(`🔂 | **Loop has been \`${trackRepeat}\`**`),
        ],
      });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    return;
  }

  return interaction.reply({
    ephemeral: true,
    content: "❌ | **Unknown controller option**",
  });
};
