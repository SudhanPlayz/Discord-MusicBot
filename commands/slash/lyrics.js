const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
var fetch = require("node-fetch");

const command = new SlashCommand()
  .setName("lyrics")
  .setDescription("Shows lyrics of a song")
  // get user input
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("The song to get lyrics for")
      .setRequired(false)
  )
  .setRun(async (client, interaction, options) => {
    await interaction.reply({
      embeds: [client.Embed(":mag_right: **Searching...**")],
    });

    const args = interaction.options.getString("song");

    let player = client.manager.players.get(interaction.guild.id);

    if (!args && !player)
      return interaction.editReply({
        embeds: [client.ErrorEmbed("**There's nothing playing**")],
      });

    // if no input, search for the current song. if no song console.log("No song input");
    let search = args ? args : player.queue.current.title;
    let url = `https://api.darrennathanael.com/lyrics?song=${search}`;
    let url2 = `https://api.darrennathanael.com/lyrics-genius?song=${search}`;
    // get the lyrics
    let lyrics = await fetch(url).then((res) => res.json());

    // check if the response is 200
    if (lyrics.response !== 200) {
      let lyrics2 = await fetch(url2).then((res) => res.json());
      if (lyrics2.response !== 200) {
        let noLyrics = new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            `❌ | No lyrics found for ${search}! Please try again.`
          );
        return interaction.editReply({ embeds: [noLyrics], ephemeral: true });
      } else {
        let embed = new MessageEmbed()
          .setColor(client.config.embedColor)
          .setTitle(`${lyrics2.full_title}`)
          .setURL(lyrics2.url)
          .setThumbnail(lyrics2.thumbnail)
          .setDescription(lyrics2.lyrics);
        return interaction.editReply({ embeds: [embed], ephemeral: false });
      }
    }
    // if the response is 200
    let embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`${lyrics.full_title}`)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setDescription(lyrics.lyrics);
    return interaction.editReply({ embeds: [embed], ephemeral: false });
  });

module.exports = command;
