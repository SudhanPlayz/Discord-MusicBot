/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").CommandInteraction | import("discord.js").ContextMenuInteraction} interaction
 * @returns
 */
module.exports = async (client, interaction, props) => {
  return new Promise((resolve) => {
    if (!interaction.member.voice.channel) {
      interaction.reply({
        embeds: [
          client.ErrorEmbed(
            "You must be in a voice channel to use this command!"
          ),
        ],
      });
      return resolve(false);
    }
    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    ) {
      interaction.reply({
        embeds: [
          client.ErrorEmbed(
            "You must be in the same voice channel as me to use this command!"
          ),
        ],
      });
      return resolve(false);
    }
    if (props && props.checkPlaying) {
      let player = client.manager.players.get(interaction.guild.id);
      if (!player)
        interaction.reply({
          embeds: [client.ErrorEmbed("Nothing is playing right now...")],
        });
      return resolve(false);
    }
    resolve(interaction.member.voice.channel);
  });
};
