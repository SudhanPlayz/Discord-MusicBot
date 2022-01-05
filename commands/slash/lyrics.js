const SlashCommand = require("../../lib/SlashCommand");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

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
    // get the lyrics
    let lyrics = await fetch(url).then((res) => res.json());

    // check if the response is 200
    if (lyrics.response !== 200) {
      let noLyrics = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription(
          `❌ | No lyrics found for ${search}! Please try again.`
        );
      return interaction.editReply({ embeds: [noLyrics], ephemeral: true });
    }
    else {
      let lyricsEmbed = new MessageEmbed()
      .setTitle(lyrics.full_title)
      .setThumbnail(lyrics.thumbnail_full)
      .setURL(lyrics.url)
      .setColor(client.config.embedColor)
      .setDescription(lyrics.lyrics);
      return interaction.editReply({ embeds: [lyricsEmbed] });
    }
  });


module.exports = command;
