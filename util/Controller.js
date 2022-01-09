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
    const JoinEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(
        "❌ | **You must be in a voice channel to use this command!**"
      );
    return interaction.reply({ embeds: [JoinEmbed], ephemeral: true });
  }

  if (
    interaction.guild.me.voice.channel &&
    !interaction.guild.me.voice.channel.equals(
      interaction.member.voice.channel
    )
  ) {
    const SameEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription(
        "❌ | **You must be in the same voice channel as me to use this command!**"
      );
    return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
  }
  if (property === "LowVolume") {
    player.setVolume(player.volume - 10);
    interaction.reply({
      embeds: [
        client.Embed(
          "🔉 | **Successfully lowered server volume to** `" +
            player.volume +
            "%`"
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
    console.log("This is a test of the test lamo hiiii");
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

  if (property === "HighVolume") {
    // increase volume by 10% else if volume at 200% do nothing
    if (player.volume < 125) {
      player.setVolume(player.volume + 5);
      interaction.reply({
        embeds: [
          client.Embed(
            "🔊 | **Successfully increased server volume to** `" +
              player.volume +
              "%`"
          ),
        ],
      });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    } else {
      interaction.reply({
        embeds: [
          client.Embed(
            "👍 | **Volume is at maximum** `" + player.volume + "%`"
          ),
        ],
      });
      setTimeout(() => {
        interaction.deleteReply();
      }, 5000);
    }
    return;
  }

  return interaction.reply({
    ephemeral: true,
    content: "❌ | **Unknown controller option**",
  });
};
